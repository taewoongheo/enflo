import { TIMER_MAX_MINUTES, TIMER_MIN_MINUTES } from '@/constants/time/time';
import Session, { TimeRange } from '@/models/Session';
import TimerSession from '@/models/TimerSession';

export type TimeStatusPoint = {
  time: number;
  dropValue: number;
  hasData: boolean;
};

export function generateTimeStatus(
  session: Session,
  bucketMinutes: number,
): TimeStatusPoint[] {
  const msPerMin = 60000;
  const bucketMs = bucketMinutes * msPerMin;

  // collect timer sessions
  const timerSessions: TimerSession[] = Object.values(
    session.timerSessionsByTimeRange as Record<TimeRange, TimerSession[]>,
  ).flat();

  if (timerSessions.length < 3) return [];

  // create fixed bucket array for 20-90 minute range
  const times: number[] = [];
  for (let t = TIMER_MIN_MINUTES; t <= TIMER_MAX_MINUTES; t += bucketMinutes) {
    times.push(t);
  }

  // count sessions that reach the bucket
  const denomByTime: Record<number, number> = Object.fromEntries(
    times.map((t) => [t, 0]),
  );
  for (const ts of timerSessions) {
    const sessionDurationMinutes = ts.targetDurationMs / msPerMin;
    for (const t of times) {
      if (t <= sessionDurationMinutes) {
        denomByTime[t] += 1;
      }
    }
  }

  // count events
  const countByTime: Record<number, number> = Object.fromEntries(
    times.map((t) => [t, 0]),
  );

  for (const ts of timerSessions) {
    const startTs = ts.startTs as number;
    const sessionDurationMinutes = ts.targetDurationMs / msPerMin;

    // map instant events to buckets
    const addInstantEvent = (eventTimestamp: number) => {
      const elapsedMs = eventTimestamp - startTs;
      let bucketEnd = Math.ceil(elapsedMs / bucketMs) * bucketMinutes;
      if (bucketEnd < TIMER_MIN_MINUTES) {
        bucketEnd = TIMER_MIN_MINUTES;
      }
      if (
        bucketEnd >= TIMER_MIN_MINUTES &&
        bucketEnd <= TIMER_MAX_MINUTES &&
        bucketEnd <= sessionDurationMinutes
      ) {
        countByTime[bucketEnd] += 1;
      }
    };

    // count active(unlock) events
    for (const ev of ts.screenUnlockCount) {
      addInstantEvent(ev.timestamp);
    }

    // count scroll events
    for (const ev of ts.scrollInteractionCount) {
      addInstantEvent(ev.timestamp);
    }

    // count pause events
    for (const p of ts.pauseEvents) {
      const pStart = p.startTs;
      const pEnd = p.endTs;
      for (
        let t = TIMER_MIN_MINUTES;
        t <= Math.min(TIMER_MAX_MINUTES, sessionDurationMinutes);
        t += bucketMinutes
      ) {
        const bucketStartAbs = startTs + (t - bucketMinutes) * msPerMin;
        const bucketEndAbs = startTs + t * msPerMin;
        const overlaps = pStart <= bucketEndAbs && pEnd >= bucketStartAbs;
        if (overlaps) countByTime[t] += 1;
      }
    }
  }

  // calculate drop value
  const result: TimeStatusPoint[] = times.map((t) => {
    const n = denomByTime[t] || 0;
    const c = countByTime[t] || 0;
    const hasData = n > 0;
    const dropValue = hasData ? Math.round((c / n) * 100) / 100 : 0;
    return { time: t, dropValue, hasData };
  });

  return result;
}
