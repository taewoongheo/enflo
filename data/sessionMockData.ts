import Session from '@/models/Session';
import TimerSession from '@/models/TimerSession';
import { sessionService } from '@/services/SessionService';
import { timerService } from '@/services/TimerService';
import {
  AppStateEvent,
  PauseEvent,
  ScrollInteractionEvent,
} from '@/types/InterruptEvent';

const createMockTimerSession = async (
  sessionId: string,
  targetDurationMs: number,
  startTs: number,
  endTs: number,
  pauseEvents: PauseEvent[] = [],
  scrollEvents: ScrollInteractionEvent[] = [],
  screenUnlockEvents: AppStateEvent[] = [],
): Promise<TimerSession> => {
  const timerSession = await timerService.createTimerSession({
    sessionId,
    startTs,
    targetDurationMs,
  });

  timerSession.startTs = startTs;
  timerSession.calculateEntropy({
    endTs,
    screenBackgroundCount: screenUnlockEvents,
    scrollInteractionCount: scrollEvents,
    pauseEvents,
  });
  timerSession.entropyScore = Math.random() * 100 + 1;

  return timerSession;
};

export const createEnfloProjectSessions = async (): Promise<Session> => {
  const sessionName = 'enflo 프로젝트 완성';
  const session = await sessionService.createSession({
    sessionName,
  });

  const sessionId = session.sessionId;
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000; // 1 day in ms
  const timerSessions = [];

  // Generate timer sessions for the past 60 days to today
  for (let dayOffset = -5; dayOffset <= 0; dayOffset++) {
    const dayStart = now + dayOffset * oneDay;

    // Skip some days randomly to create realistic gaps
    // Special period: 8/20~8/30 (approximately -15 to -5 days from today)
    const isSpecialPeriod = dayOffset >= -15 && dayOffset <= -5;

    if (isSpecialPeriod) {
      // Almost never skip during special period
      if (Math.random() < 0.05) continue;
    } else {
      if (Math.random() < 0.25) continue;
    }

    // 1-4 sessions per day randomly, more during special period
    const sessionsPerDay = isSpecialPeriod
      ? Math.floor(Math.random() * 5) + 2 // 2-6 sessions during special period
      : Math.floor(Math.random() * 4) + 1; // 1-4 sessions normally

    for (let sessionIndex = 0; sessionIndex < sessionsPerDay; sessionIndex++) {
      const hourOffset = Math.floor(Math.random() * 16) + 6; // 6AM to 10PM
      const minuteOffset = Math.floor(Math.random() * 60);
      const startTime =
        dayStart + hourOffset * 60 * 60 * 1000 + minuteOffset * 60 * 1000;

      // Random target duration between 25-120 minutes (increased minimum)
      const targetDuration = (Math.floor(Math.random() * 96) + 25) * 60 * 1000;

      // Actual duration is 80-100% of target (increased minimum)
      const completionRate = 0.8 + Math.random() * 0.2;
      const actualDuration = Math.floor(targetDuration * completionRate);

      // Generate random interruptions
      const pauseEvents = [];
      const scrollEvents = [];
      const screenUnlockEvents = [];

      // 0-2 pause events (reduced)
      const pauseCount = Math.floor(Math.random() * 3);
      for (let i = 0; i < pauseCount; i++) {
        const pauseStart =
          startTime + Math.floor(Math.random() * actualDuration);
        const pauseDuration = (Math.floor(Math.random() * 3) + 1) * 60 * 1000; // 1-3 minutes (reduced)
        pauseEvents.push({
          startTs: pauseStart,
          endTs: pauseStart + pauseDuration,
          durationMs: pauseDuration,
        });
      }

      // 0-5 scroll events
      const scrollCount = Math.floor(Math.random() * 6);
      for (let i = 0; i < scrollCount; i++) {
        scrollEvents.push({
          timestamp: startTime + Math.floor(Math.random() * actualDuration),
        });
      }

      // 0-2 screen unlock events
      const unlockCount = Math.floor(Math.random() * 3);
      for (let i = 0; i < unlockCount; i++) {
        screenUnlockEvents.push({
          timestamp: startTime + Math.floor(Math.random() * actualDuration),
          appState: 'background' as const,
        });
      }

      const timerSession = await createMockTimerSession(
        sessionId,
        targetDuration,
        startTime,
        startTime + actualDuration,
        pauseEvents,
        scrollEvents,
        screenUnlockEvents,
      );

      timerSessions.push(timerSession);
    }
  }

  // Add all timer sessions to the session
  // for (const timerSession of timerSessions) {
  //   await sessionService.addTimerSession({
  //     sessionId,
  //     timerSession,
  //   });
  // }

  return session;
};

export const createReadingSessions = async (): Promise<Session> => {
  const sessionName = '독서';
  const session = await sessionService.createSession({
    sessionName,
  });

  const sessionId = session.sessionId;
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000; // 1 day in ms
  const timerSessions = [];

  // Generate timer sessions for the past 60 days to today
  for (let dayOffset = -30; dayOffset <= 0; dayOffset++) {
    const dayStart = now + dayOffset * oneDay;

    // Skip some days randomly to create realistic gaps (reading is less frequent)
    // Special period: 8/20~8/30 (approximately -15 to -5 days from today)
    const isSpecialPeriod = dayOffset >= -15 && dayOffset <= -5;

    if (isSpecialPeriod) {
      // Less skipping during special period for reading
      if (Math.random() < 0.2) continue;
    } else {
      if (Math.random() < 0.5) continue;
    }

    // 1-2 sessions per day randomly for reading, more during special period
    const sessionsPerDay = isSpecialPeriod
      ? Math.floor(Math.random() * 3) + 2 // 2-4 sessions during special period
      : Math.floor(Math.random() * 2) + 1; // 1-2 sessions normally

    for (let sessionIndex = 0; sessionIndex < sessionsPerDay; sessionIndex++) {
      const hourOffset = Math.floor(Math.random() * 14) + 8; // 8AM to 10PM
      const minuteOffset = Math.floor(Math.random() * 60);
      const startTime =
        dayStart + hourOffset * 60 * 60 * 1000 + minuteOffset * 60 * 1000;

      // Reading sessions tend to be longer: 25-90 minutes (increased minimum)
      const targetDuration = (Math.floor(Math.random() * 66) + 25) * 60 * 1000;

      // Reading has higher completion rates: 85-100% (increased minimum)
      const completionRate = 0.85 + Math.random() * 0.15;
      const actualDuration = Math.floor(targetDuration * completionRate);

      // Generate fewer interruptions for reading
      const pauseEvents = [];
      const scrollEvents = [];
      const screenUnlockEvents = [];

      // 0-2 pause events (reading has fewer pauses)
      const pauseCount = Math.floor(Math.random() * 3);
      for (let i = 0; i < pauseCount; i++) {
        const pauseStart =
          startTime + Math.floor(Math.random() * actualDuration);
        const pauseDuration = (Math.floor(Math.random() * 3) + 1) * 60 * 1000; // 1-3 minutes
        pauseEvents.push({
          startTs: pauseStart,
          endTs: pauseStart + pauseDuration,
          durationMs: pauseDuration,
        });
      }

      // 0-2 scroll events (minimal scrolling during reading)
      const scrollCount = Math.floor(Math.random() * 3);
      for (let i = 0; i < scrollCount; i++) {
        scrollEvents.push({
          timestamp: startTime + Math.floor(Math.random() * actualDuration),
        });
      }

      // 0-1 screen unlock events (very focused activity)
      const unlockCount = Math.floor(Math.random() * 2);
      for (let i = 0; i < unlockCount; i++) {
        screenUnlockEvents.push({
          timestamp: startTime + Math.floor(Math.random() * actualDuration),
          appState: 'background' as const,
        });
      }

      const timerSession = await createMockTimerSession(
        sessionId,
        targetDuration,
        startTime,
        startTime + actualDuration,
        pauseEvents,
        scrollEvents,
        screenUnlockEvents,
      );

      timerSessions.push(timerSession);
    }
  }

  // Add all timer sessions to the session
  for (const timerSession of timerSessions) {
    await sessionService.addTimerSession({
      sessionId,
      timerSession,
    });
  }

  return session;
};

export const createFocusSessions = async (): Promise<Session> => {
  const sessionName = '몰입';
  const session = await sessionService.createSession({
    sessionName,
  });

  const sessionId = session.sessionId;
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000; // 1 day in ms
  const timerSessions = [];

  // Generate timer sessions for the past 60 days to today
  for (let dayOffset = -30; dayOffset <= 0; dayOffset++) {
    const dayStart = now + dayOffset * oneDay;

    // Skip some days randomly to create realistic gaps (focus sessions are less frequent)
    // Special period: 8/20~8/30 (approximately -15 to -5 days from today)
    const isSpecialPeriod = dayOffset >= -15 && dayOffset <= -5;

    if (isSpecialPeriod) {
      // Less skipping during special period for focus work
      if (Math.random() < 0.3) continue;
    } else {
      if (Math.random() < 0.6) continue;
    }

    // 1-3 sessions per day randomly for focus work, more during special period
    const sessionsPerDay = isSpecialPeriod
      ? Math.floor(Math.random() * 4) + 2 // 2-5 sessions during special period
      : Math.floor(Math.random() * 3) + 1; // 1-3 sessions normally

    for (let sessionIndex = 0; sessionIndex < sessionsPerDay; sessionIndex++) {
      const hourOffset = Math.floor(Math.random() * 12) + 9; // 9AM to 9PM
      const minuteOffset = Math.floor(Math.random() * 60);
      const startTime =
        dayStart + hourOffset * 60 * 60 * 1000 + minuteOffset * 60 * 1000;

      // Focus sessions can be very long or short: 25-180 minutes (increased minimum)
      const targetDuration = (Math.floor(Math.random() * 156) + 25) * 60 * 1000;

      // Focus sessions have variable completion rates: 75-100% (increased minimum)
      const completionRate = 0.75 + Math.random() * 0.25;
      const actualDuration = Math.floor(targetDuration * completionRate);

      // Generate variable interruptions for focus work
      const pauseEvents = [];
      const scrollEvents = [];
      const screenUnlockEvents = [];

      // 0-2 pause events (reduced for focus work)
      const pauseCount = Math.floor(Math.random() * 3);
      for (let i = 0; i < pauseCount; i++) {
        const pauseStart =
          startTime + Math.floor(Math.random() * actualDuration);
        const pauseDuration = (Math.floor(Math.random() * 4) + 1) * 60 * 1000; // 1-4 minutes (reduced)
        pauseEvents.push({
          startTs: pauseStart,
          endTs: pauseStart + pauseDuration,
          durationMs: pauseDuration,
        });
      }

      // 0-4 scroll events
      const scrollCount = Math.floor(Math.random() * 5);
      for (let i = 0; i < scrollCount; i++) {
        scrollEvents.push({
          timestamp: startTime + Math.floor(Math.random() * actualDuration),
        });
      }

      // 0-3 screen unlock events
      const unlockCount = Math.floor(Math.random() * 4);
      for (let i = 0; i < unlockCount; i++) {
        screenUnlockEvents.push({
          timestamp: startTime + Math.floor(Math.random() * actualDuration),
          appState: 'background' as const,
        });
      }

      const timerSession = await createMockTimerSession(
        sessionId,
        targetDuration,
        startTime,
        startTime + actualDuration,
        pauseEvents,
        scrollEvents,
        screenUnlockEvents,
      );

      timerSessions.push(timerSession);
    }
  }

  // Add all timer sessions to the session
  for (const timerSession of timerSessions) {
    await sessionService.addTimerSession({
      sessionId,
      timerSession,
    });
  }

  return session;
};

export const createAllMockSessions = async (): Promise<void> => {
  await createEnfloProjectSessions();
  await createReadingSessions();
  await createFocusSessions();
};
