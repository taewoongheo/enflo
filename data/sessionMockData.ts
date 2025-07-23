import Session, { TimeRange } from '@/models/Session';
import TimerSession from '@/models/TimerSession';

const now = Date.now();
const hourMs = 60 * 60 * 1000;

function makeTimerSession({
  session,
  startTs,
  durationMs,
  sequence,
  entropyScore,
}: {
  session: string;
  startTs: number;
  durationMs: number;
  sequence: number;
  entropyScore: number;
}) {
  const timer = new TimerSession({ session });
  timer.startTs = startTs;
  timer.endTs = startTs + durationMs;
  timer.targetDurationMs = durationMs;
  timer.sessionSequence = sequence;
  timer.entropyScore = entropyScore;
  return timer;
}

const timerSessionsByTimeRange: Record<TimeRange, TimerSession[]> = {
  '00-03': [
    makeTimerSession({
      session: 'Mock Session',
      startTs: now - 20 * hourMs,
      durationMs: 25 * 60 * 1000,
      sequence: 1,
      entropyScore: 0.23,
    }),
  ],
  '03-06': [
    makeTimerSession({
      session: 'Mock Session',
      startTs: now - 18 * hourMs,
      durationMs: 30 * 60 * 1000,
      sequence: 2,
      entropyScore: 0.31,
    }),
  ],
  '06-09': [],
  '09-12': [
    makeTimerSession({
      session: 'Mock Session',
      startTs: now - 3 * hourMs,
      durationMs: 40 * 60 * 1000,
      sequence: 3,
      entropyScore: 0.15,
    }),
    makeTimerSession({
      session: 'Mock Session',
      startTs: now - 2 * hourMs,
      durationMs: 20 * 60 * 1000,
      sequence: 4,
      entropyScore: 0.42,
    }),
  ],
  '12-15': [],
  '15-18': [],
  '18-21': [],
  '21-24': [],
};

const sessionMock = new Session({
  sessionName: 'Mock Session',
  timerSessionsByTimeRange,
});

export default sessionMock;
