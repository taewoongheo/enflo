import { MINUTE_MS } from '@/constants/time/time';
import TimerSession from '@/models/TimerSession';
import { clamp } from '@/utils/math';

const SESSION_START_BONUS = 0.2;
const SESSION_END_BONUS = 0.2;
const FOCUS_BONUS_PER_MINUTE = 2;
const DISTURBANCE_EVENT_PENALTY = -0.8;
const DISTURBANCE_TIME_PENALTY_PER_MINUTE = -0.4;
const SEQUENCE_SCORE_WEIGHT = 0.2;
// const OVERSHOOT_SCORE_WEIGHT = 0.2;
const SUCCESS_BONUS = 0.2;
// const MIN_ENTROPY_SCORE = 5;
// const MAX_ENTROPY_SCORE = 20;
const MAX_SEQUENCE_BONUS = 5;
// const MAX_OVERSHOOT_BONUS = 5;

export function calculateEntropyScore(session: TimerSession): number | null {
  const netFocusMs = session.netFocusMs;
  const screenUnlockEvents = session.screenUnlockCount;
  const scrollEvents = session.scrollInteractionCount;
  const totalDisturbanceMs = session.totalDisturbanceMs;
  const sessionSequenceInDay = session.sessionSequenceInDay;
  //   const overshootMs = session.overshootMs;
  const isSuccess = session.isSuccess;

  if (netFocusMs <= 5 * 60 * 1000) {
    return null;
  }

  // Convert milliseconds to minutes
  const netFocusMinutes = netFocusMs / MINUTE_MS;
  const totalDisturbMinutes = totalDisturbanceMs / MINUTE_MS;
  //   const overshootMinutes = overshootMs / MINUTE_MS;

  // 1) Base score: session start + end bonuses
  const baseScore = SESSION_START_BONUS + SESSION_END_BONUS;

  // 2) Focus reward (per minute)
  const focusScore = FOCUS_BONUS_PER_MINUTE * netFocusMinutes;

  // 3) Disturbance penalty
  const eventCount = screenUnlockEvents.length + scrollEvents.length;
  const eventPenalty = DISTURBANCE_EVENT_PENALTY * eventCount;
  const timePenalty = DISTURBANCE_TIME_PENALTY_PER_MINUTE * totalDisturbMinutes;
  const disturbanceScore = eventPenalty + timePenalty;

  // 4) Sequence bonus (capped)
  const sequenceScore = clamp(
    SEQUENCE_SCORE_WEIGHT * sessionSequenceInDay,
    0,
    MAX_SEQUENCE_BONUS,
  );

  // 5) Overshoot bonus (capped)
  //   const overshootScore = clamp(
  //     OVERSHOOT_SCORE_WEIGHT * overshootMinutes,
  //     0,
  //     MAX_OVERSHOOT_BONUS,
  //   );

  // 6) Success bonus
  const successScore = isSuccess ? SUCCESS_BONUS : 0;

  // 7) Sum all components and clamp final score
  const rawScore =
    baseScore +
    focusScore +
    disturbanceScore +
    sequenceScore +
    // overshootScore +
    successScore;

  //   return clamp(rawScore, MIN_ENTROPY_SCORE, MAX_ENTROPY_SCORE);
  return rawScore;
}
