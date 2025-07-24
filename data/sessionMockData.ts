import Session from '@/models/Session';
import TimerSession from '@/models/TimerSession';

function generateMockTimerSession(
  sessionName: string,
  sessionIndexInDay: number,
  targetDurationMinutes: number,
  focusMinutes: number,
  interrupts: {
    shakes: number;
    backgrounds: number;
    pauses: number;
  },
): TimerSession {
  const baseDate = new Date();
  const baseStartTime = new Date(
    baseDate.getFullYear(),
    baseDate.getMonth(),
    baseDate.getDate(),
    9,
    0,
    0,
    0,
  ).getTime();

  const startTs = baseStartTime + sessionIndexInDay * 90 * 60 * 1000;
  const targetDurationMs = targetDurationMinutes * 60 * 1000;
  const netFocusMs = focusMinutes * 60 * 1000;

  const totalInterruptMs =
    targetDurationMs - netFocusMs > 0
      ? targetDurationMs - netFocusMs
      : 3 * 60 * 1000;
  const endTs = startTs + targetDurationMs + totalInterruptMs;

  const timerSession = new TimerSession({ session: sessionName });

  timerSession.startTs = startTs;
  timerSession.endTs = endTs;
  timerSession.targetDurationMs = targetDurationMs;
  timerSession.sessionIndexInDay = sessionIndexInDay;

  for (let i = 0; i < interrupts.shakes; i++) {
    timerSession.shakeEvents.push({
      startTs: startTs + Math.random() * targetDurationMs,
    } as any);
  }

  let remainingBackgroundMs =
    interrupts.backgrounds > 0 ? totalInterruptMs * 0.6 : 0;
  for (let i = 0; i < interrupts.backgrounds; i++) {
    const durationMs =
      i === interrupts.backgrounds - 1
        ? remainingBackgroundMs
        : remainingBackgroundMs * Math.random();
    const eventStartTs = startTs + Math.random() * targetDurationMs;
    timerSession.backgroundEvents.push({
      startTs: eventStartTs,
      endTs: eventStartTs + durationMs,
      durationMs,
    });
    remainingBackgroundMs -= durationMs;
  }

  let remainingPauseMs = interrupts.pauses > 0 ? totalInterruptMs * 0.4 : 0;
  for (let i = 0; i < interrupts.pauses; i++) {
    const durationMs =
      i === interrupts.pauses - 1
        ? remainingPauseMs
        : remainingPauseMs * Math.random();
    const eventStartTs = startTs + Math.random() * targetDurationMs;
    timerSession.pauseEvents.push({
      startTs: eventStartTs,
      endTs: eventStartTs + durationMs,
      durationMs,
    });
    remainingPauseMs -= durationMs;
  }

  return timerSession;
}

const mockSessions: Session[] = [];

// Session 1: Work
const workSession = new Session({ sessionName: 'Work' });
workSession.timerSessionsByTimeRange = {
  '00-03': [],
  '03-06': [],
  '06-09': [],
  '09-12': [
    generateMockTimerSession('Work', 0, 60, 55, {
      shakes: 1,
      backgrounds: 2,
      pauses: 1,
    }),
    generateMockTimerSession('Work', 1, 45, 40, {
      shakes: 0,
      backgrounds: 1,
      pauses: 2,
    }),
  ],
  '12-15': [
    generateMockTimerSession('Work', 2, 90, 80, {
      shakes: 2,
      backgrounds: 3,
      pauses: 1,
    }),
  ],
  '15-18': [
    generateMockTimerSession('Work', 3, 60, 50, {
      shakes: 1,
      backgrounds: 4,
      pauses: 3,
    }),
  ],
  '18-21': [],
  '21-24': [],
};
mockSessions.push(workSession);

// Session 2: Reading
const readingSession = new Session({ sessionName: 'Reading' });
readingSession.timerSessionsByTimeRange = {
  '00-03': [],
  '03-06': [],
  '06-09': [],
  '09-12': [],
  '12-15': [],
  '15-18': [],
  '18-21': [
    generateMockTimerSession('Reading', 0, 30, 28, {
      shakes: 0,
      backgrounds: 1,
      pauses: 0,
    }),
  ],
  '21-24': [
    generateMockTimerSession('Reading', 1, 45, 45, {
      shakes: 0,
      backgrounds: 0,
      pauses: 0,
    }),
    generateMockTimerSession('Reading', 2, 60, 58, {
      shakes: 1,
      backgrounds: 1,
      pauses: 1,
    }),
  ],
};
mockSessions.push(readingSession);

// Session 3: Meditation
const meditationSession = new Session({ sessionName: 'Meditation' });
meditationSession.timerSessionsByTimeRange = {
  '00-03': [],
  '03-06': [],
  '06-09': [
    generateMockTimerSession('Meditation', 0, 15, 15, {
      shakes: 0,
      backgrounds: 0,
      pauses: 0,
    }),
    generateMockTimerSession('Meditation', 1, 20, 20, {
      shakes: 0,
      backgrounds: 0,
      pauses: 0,
    }),
  ],
  '09-12': [],
  '12-15': [],
  '15-18': [],
  '18-21': [],
  '21-24': [],
};
mockSessions.push(meditationSession);

export const sessionMockData = mockSessions;
