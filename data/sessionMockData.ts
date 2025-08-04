import Session from '@/models/Session';
import TimerSession from '@/models/TimerSession';
import { getLocales } from 'expo-localization';

function generateMockTimerSession(
  sessionName: string,
  sessionIndexInDay: number,
  targetDurationMinutes: number,
  focusMinutes: number,
  interrupts: {
    shakes: number;
    screenUnlocks: number;
    scrollInteractions: number;
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

  for (let i = 0; i < interrupts.screenUnlocks; i++) {
    timerSession.screenUnlockCount.push({
      startTs: startTs + Math.random() * targetDurationMs,
    } as any);
  }

  for (let i = 0; i < interrupts.scrollInteractions; i++) {
    timerSession.scrollInteractionCount.push({
      startTs: startTs + Math.random() * targetDurationMs,
    } as any);
  }

  let remainingPauseMs = interrupts.pauses > 0 ? totalInterruptMs : 0;
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

const locale = getLocales()[0].languageCode;
const isKorean = locale === 'ko';

// Session 1: Work
const workSession = new Session({
  sessionName: isKorean
    ? '집중 업무 및 프로젝트 개발'
    : 'Focused tasks and project development',
});
workSession.timerSessionsByTimeRange = {
  '00-03': [],
  '03-06': [],
  '06-09': [],
  '09-12': [
    generateMockTimerSession(
      isKorean
        ? '집중 업무 및 프로젝트 개발'
        : 'Focused tasks and project development',
      0,
      60,
      55,
      {
        shakes: 1,
        screenUnlocks: 1,
        scrollInteractions: 1,
        pauses: 1,
      },
    ),
    generateMockTimerSession(
      isKorean
        ? '집중 업무 및 프로젝트 개발'
        : 'Focused tasks and project development',
      1,
      45,
      40,
      {
        shakes: 0,
        screenUnlocks: 1,
        scrollInteractions: 0,
        pauses: 2,
      },
    ),
  ],
  '12-15': [
    generateMockTimerSession(
      isKorean
        ? '집중 업무 및 프로젝트 개발'
        : 'Focused tasks and project development',
      2,
      90,
      80,
      {
        shakes: 2,
        screenUnlocks: 2,
        scrollInteractions: 1,
        pauses: 1,
      },
    ),
  ],
  '15-18': [
    generateMockTimerSession(
      isKorean
        ? '집중 업무 및 프로젝트 개발'
        : 'Focused tasks and project development',
      3,
      60,
      50,
      {
        shakes: 1,
        screenUnlocks: 2,
        scrollInteractions: 2,
        pauses: 3,
      },
    ),
  ],
  '18-21': [],
  '21-24': [],
};
mockSessions.push(workSession);

// Session 2: Reading
const readingSession = new Session({
  sessionName: isKorean
    ? '자기계발 및 전문서적 독서'
    : 'Self-improvement and professional books',
});
readingSession.timerSessionsByTimeRange = {
  '00-03': [],
  '03-06': [],
  '06-09': [],
  '09-12': [],
  '12-15': [],
  '15-18': [],
  '18-21': [
    generateMockTimerSession(
      isKorean
        ? '자기계발 및 전문서적 독서'
        : 'Self-improvement and professional books',
      0,
      30,
      28,
      {
        shakes: 0,
        screenUnlocks: 1,
        scrollInteractions: 0,
        pauses: 0,
      },
    ),
  ],
  '21-24': [
    generateMockTimerSession(
      isKorean
        ? '자기계발 및 전문서적 독서'
        : 'Self-improvement and professional books',
      1,
      45,
      45,
      {
        shakes: 0,
        screenUnlocks: 0,
        scrollInteractions: 0,
        pauses: 0,
      },
    ),
    generateMockTimerSession(
      isKorean
        ? '자기계발 및 전문서적 독서'
        : 'Self-improvement and professional books',
      2,
      60,
      58,
      {
        shakes: 1,
        screenUnlocks: 1,
        scrollInteractions: 0,
        pauses: 1,
      },
    ),
  ],
};
mockSessions.push(readingSession);

// Session 3: Meditation
const meditationSession = new Session({
  sessionName: isKorean
    ? '아침 명상 및 마음챙김 훈련'
    : 'Morning meditation and mindfulness training',
});
meditationSession.timerSessionsByTimeRange = {
  '00-03': [],
  '03-06': [],
  '06-09': [
    generateMockTimerSession(
      isKorean
        ? '아침 명상 및 마음챙김 훈련'
        : 'Morning meditation and mindfulness training',
      0,
      15,
      15,
      {
        shakes: 0,
        screenUnlocks: 0,
        scrollInteractions: 0,
        pauses: 0,
      },
    ),
    generateMockTimerSession(
      isKorean
        ? '아침 명상 및 마음챙김 훈련'
        : 'Morning meditation and mindfulness training',
      1,
      20,
      20,
      {
        shakes: 0,
        screenUnlocks: 0,
        scrollInteractions: 0,
        pauses: 0,
      },
    ),
  ],
  '09-12': [],
  '12-15': [],
  '15-18': [],
  '18-21': [],
  '21-24': [],
};
mockSessions.push(meditationSession);

export const sessionMockData = mockSessions;
