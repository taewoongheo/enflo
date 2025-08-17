import Session, { TimeRange } from '@/models/Session';
import TimerSession from '@/models/TimerSession';

type TimeStatusPoint = { time: number; dropValue: number };

export function generateTimeStatus(
  session: Session,
  bucketMinutes: number,
): TimeStatusPoint[] {
  const maxXAxisMinutes = 90;
  const msPerMin = 60_000;
  const bucketMs = bucketMinutes * msPerMin;

  // collect timer sessions
  const timerSessions: TimerSession[] = Object.values(
    session.timerSessionsByTimeRange as Record<TimeRange, TimerSession[]>,
  ).flat();

  if (timerSessions.length === 0) return [];

  // determine time axis
  const maxTargetMinutes = Math.max(
    ...timerSessions.map((s) => s.targetDurationMs / msPerMin),
  );
  const tMax = Math.min(maxXAxisMinutes, maxTargetMinutes);

  // create bucket array
  const times: number[] = [];
  for (let t = bucketMinutes; t <= tMax; t += bucketMinutes) times.push(t);

  // count sessions that reach the bucket
  const denomByTime: Record<number, number> = Object.fromEntries(
    times.map((t) => [t, 0]),
  );
  for (const ts of timerSessions) {
    const reachT = Math.min(tMax, ts.targetDurationMs / msPerMin);
    for (const t of times) {
      if (t <= reachT) denomByTime[t] += 1;
    }
  }

  // count events
  const countByTime: Record<number, number> = Object.fromEntries(
    times.map((t) => [t, 0]),
  );

  for (const ts of timerSessions) {
    const startTs = ts.startTs as number;

    // count events that reach the bucket
    const reachT = Math.min(tMax, ts.targetDurationMs / msPerMin);

    // map instant events to buckets
    const addInstantEvent = (eventTimestamp: number) => {
      const elapsedMs = eventTimestamp - startTs;
      let bucketEnd = Math.ceil(elapsedMs / bucketMs) * bucketMinutes;
      if (bucketEnd < bucketMinutes) bucketEnd = bucketMinutes;
      if (bucketEnd >= bucketMinutes && bucketEnd <= reachT) {
        countByTime[bucketEnd] += 1;
      }
    };

    // count active(unlock) events
    for (const ev of ts.screenUnlockCount) {
      if (ev.appState === 'active') addInstantEvent(ev.timestamp);
    }

    // count scroll events
    for (const ev of ts.scrollInteractionCount) {
      addInstantEvent(ev.timestamp);
    }

    // count pause events
    for (const p of ts.pauseEvents) {
      const pStart = p.startTs;
      const pEnd = p.endTs;
      for (let t = bucketMinutes; t <= reachT; t += bucketMinutes) {
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
    const dropValue = n > 0 ? Math.round((c / n) * 100) / 100 : 0;
    return { time: t, dropValue };
  });

  return result;
}
