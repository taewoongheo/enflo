import {
  LEVEL_LABELS,
  TREND_LABELS,
} from '@/components/TimerPage/constant/suggestion';
import { TimeRange } from '@/models/Session';

export type Trend = (typeof TREND_LABELS)[keyof typeof TREND_LABELS];
export type Level = (typeof LEVEL_LABELS)[keyof typeof LEVEL_LABELS];

export interface Suggestion {
  score: number; // 0..100
  label: Level;
  trend: Trend;
  interruptionStats: {
    pauses: { count: number; name: string };
    unlocks: { count: number; name: string };
    scrolls: { count: number; name: string };
  };
  rationale: {
    timeRange: TimeRange;
    sampleSize: number;
    removedOutliers: number;
    avgEntropyAll: number | null;
    avgEntropyRecent: number | null;
    successRate: number; // smoothed
    slopePerSession: number | null; // 세션 당 기울기 => 변화량
    thUsed: number; // 동적 임계값
    sdRecent: number | null; // 최근 엔트로피 표준편차
    lowConfidence?: boolean; // 이상치 비율 높음
  };
}
