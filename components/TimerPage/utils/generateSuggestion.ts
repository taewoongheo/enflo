import {
  LEVEL_LABELS,
  SUGGESTION_SCORE_RANGES,
  SUGGESTION_THRESHOLDS,
  SUGGESTION_WEIGHTS,
  TREND_LABELS,
} from '@/components/TimerPage/constant/suggestion';
import { ENTROPY_SYSTEM_CONSTANTS } from '@/constants/entropySystem/entropySystem';
import Session, { getTimeRange } from '@/models/Session';
import { clamp, iqrMean, mean, stddev } from '@/utils/math';
import { Level, Suggestion, Trend } from '../types/Suggestion';

export function generateSuggestion(session: Session): Suggestion | null {
  const rangeKey = getTimeRange(Date.now());
  const bucket = (session.timerSessionsByTimeRange[rangeKey] ||= []);

  const sessionCount = bucket.length;

  if (sessionCount < SUGGESTION_THRESHOLDS.MIN_SESSIONS) {
    return null;
  }

  const recentBucket = bucket.slice(-3);

  const successCount = bucket.filter((s) => s.isSuccess).length;
  const successRate = smoothedSuccessRate(
    successCount,
    sessionCount,
    SUGGESTION_THRESHOLDS.SUCCESS_RATE_ALPHA,
  );

  const allEntropy = bucket
    .map((s) => s.entropyScore)
    .filter((v): v is number => v != null);
  const recentEntropy = recentBucket
    .map((s) => s.entropyScore)
    .filter((v): v is number => v != null);

  const { avgAll, avgRecent, removedOutliers } = aggregateEntropy(
    allEntropy,
    recentEntropy,
  );

  const eAllScore = mapEntropyToScore(avgAll!);
  const eRecentScore = mapEntropyToScore(avgRecent!);
  const successScore = successRate * 100;

  const rawScore =
    SUGGESTION_WEIGHTS.HISTORY * eAllScore +
    SUGGESTION_WEIGHTS.SUCCESS * successScore +
    SUGGESTION_WEIGHTS.RECENT * eRecentScore;
  const score = clamp(
    rawScore,
    ENTROPY_SYSTEM_CONSTANTS.MIN_ENTROPY_SCORE,
    ENTROPY_SYSTEM_CONSTANTS.MAX_ENTROPY_SCORE,
  );

  const { trend, thUsed, sd } = trendFrom(recentEntropy);

  let label: Level;
  if (score < SUGGESTION_SCORE_RANGES.DANGER) {
    label = LEVEL_LABELS.DANGER;
  } else if (score < SUGGESTION_SCORE_RANGES.UNSTABLE) {
    label = LEVEL_LABELS.UNSTABLE;
  } else if (score < SUGGESTION_SCORE_RANGES.STABLE) {
    label = LEVEL_LABELS.STABLE;
  } else {
    label = LEVEL_LABELS.GOOD;
  }

  const denom = recentBucket.length || 1;
  const totalPauses = recentBucket.reduce(
    (sum, s) => sum + (s.pauseEvents?.length ?? 0),
    0,
  );
  const totalUnlocks = recentBucket.reduce(
    (sum, s) => sum + (s.screenUnlockCount?.length ?? 0),
    0,
  );
  const totalScrolls = recentBucket.reduce(
    (sum, s) => sum + (s.scrollInteractionCount?.length ?? 0),
    0,
  );

  const interruptionStats = {
    pauses: { count: totalPauses / denom, name: 'pauses' },
    unlocks: { count: totalUnlocks / denom, name: 'unlocks' },
    scrolls: { count: totalScrolls / denom, name: 'scrolls' },
  };

  const outlierRate =
    allEntropy.length > 0 ? removedOutliers / allEntropy.length : 0;
  const lowConfidence = outlierRate > 0.4;

  return {
    score,
    label,
    trend,
    interruptionStats,
    rationale: {
      timeRange: rangeKey,
      sampleSize: sessionCount,
      removedOutliers,
      avgEntropyAll: avgAll ?? null,
      avgEntropyRecent: avgRecent ?? null,
      successRate,
      slopePerSession: slope(recentEntropy),
      thUsed,
      sdRecent: sd,
      lowConfidence: lowConfidence || undefined,
    },
  };
}

// calculate smoothed success rate
function smoothedSuccessRate(success: number, total: number, alpha = 1) {
  return (success + alpha) / (total + 2 * alpha); // [0..1]
}

// aggregate entropy values
function aggregateEntropy(all: number[], recent: number[]) {
  const allClean = all.filter(
    (v): v is number => v != null && Number.isFinite(v),
  );
  const recentClean = recent.filter(
    (v): v is number => v != null && Number.isFinite(v),
  );

  const { mean: avgAll, removed } = iqrMean(allClean, 1.5);
  const avgRecent =
    recentClean.length >= 2
      ? ema(recentClean, 0.6)
      : recentClean.length === 1
        ? recentClean[0]
        : null;

  return { avgAll, avgRecent, removedOutliers: removed };
}

function ema(values: number[], alpha = 0.6): number | null {
  const xs = values.filter((v): v is number => Number.isFinite(v));
  if (xs.length === 0) return null;
  return xs.reduce((acc, v) => alpha * v + (1 - alpha) * acc, xs[0]);
}

// map entropy score to 0..100
function mapEntropyToScore(entropyScore: number): number {
  const E_MIN = 5;
  const E_MAX = 20;
  return clamp(((entropyScore - E_MIN) / (E_MAX - E_MIN)) * 100, 5, 100);
}

// decide trend from recent entropy values
function trendFrom(values: number[]): {
  trend: Trend;
  thUsed: number;
  sd: number | null;
} {
  const ys = values.filter((v): v is number => v != null && Number.isFinite(v));
  if (ys.length < 2) {
    return { trend: TREND_LABELS.STABLE, thUsed: 0.2, sd: null };
  }

  const m = slope(ys) ?? 0;
  const { th, sd } = dynamicThreshold(ys, 0.2);

  if (m > th) return { trend: TREND_LABELS.RISING, thUsed: th, sd };
  if (m < -th) return { trend: TREND_LABELS.DECLINING, thUsed: th, sd };
  return { trend: TREND_LABELS.STABLE, thUsed: th, sd };
}

function dynamicThreshold(recentValues: number[], minTH = 0.2) {
  const sd = stddev(recentValues);
  const th = Math.max(minTH, (sd ?? 0) * 0.25);
  return { th, sd };
}

function slope(values: number[]): number | null {
  const ys = values.filter((v): v is number => Number.isFinite(v));
  const n = ys.length;
  if (n < 2) return null;

  const xMean = (n - 1) / 2;
  const yMean = mean(ys)!;

  let num = 0,
    den = 0;
  for (let i = 0; i < n; i++) {
    const dx = i - xMean;
    num += dx * (ys[i] - yMean);
    den += dx * dx;
  }
  return den === 0 ? 0 : num / den;
}
