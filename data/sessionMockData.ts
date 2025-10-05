import Session from '@/models/Session';
import TimerSession from '@/models/TimerSession';
import { sessionService } from '@/services/SessionService';
import { timerService } from '@/services/TimerService';
import {
  AppStateEvent,
  PauseEvent,
  ScrollInteractionEvent,
} from '@/types/InterruptEvent';

// Helper function to generate more realistic entropy scores based on interruptions
const calculateRealisticEntropyScore = (
  targetDurationMs: number,
  actualDurationMs: number,
  pauseEvents: PauseEvent[],
  scrollEvents: ScrollInteractionEvent[],
  screenUnlockEvents: AppStateEvent[],
): number => {
  // Base score starts high (good focus)
  let entropyScore = 85 + Math.random() * 15; // 85-100 base

  // Reduce score based on completion rate
  const completionRate = actualDurationMs / targetDurationMs;
  if (completionRate < 0.8) {
    entropyScore -= (0.8 - completionRate) * 50; // Penalty for low completion
  }

  // Reduce score based on interruptions
  const totalPauseDuration = pauseEvents.reduce(
    (sum, pause) => sum + pause.durationMs,
    0,
  );
  const pausePenalty = Math.min((totalPauseDuration / (1000 * 60)) * 3, 20); // Max 20 points penalty
  entropyScore -= pausePenalty;

  // Scroll interruptions penalty
  const scrollPenalty = Math.min(scrollEvents.length * 2, 15); // Max 15 points penalty
  entropyScore -= scrollPenalty;

  // Screen unlock penalty
  const unlockPenalty = Math.min(screenUnlockEvents.length * 5, 25); // Max 25 points penalty
  entropyScore -= unlockPenalty;

  // Add some randomness for variety
  entropyScore += (Math.random() - 0.5) * 20; // ±10 random variation

  // Ensure score is within bounds
  return Math.max(1, Math.min(100, Math.round(entropyScore)));
};

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

  // Use realistic entropy calculation instead of random
  timerSession.entropyScore = calculateRealisticEntropyScore(
    targetDurationMs,
    endTs - startTs,
    pauseEvents,
    scrollEvents,
    screenUnlockEvents,
  );

  return timerSession;
};

export const createEnfloProjectSessions = async (): Promise<Session> => {
  const sessionName = 'enflo 프로젝트 완성';
  const session = await sessionService.createSession({
    sessionName,
  });

  const sessionId = session.sessionId;
  const oneDay = 24 * 60 * 60 * 1000; // 1 day in ms
  const timerSessions = [];

  // 2025년 9월 1일부터 30일까지
  const september2025Start = new Date('2025-09-01T00:00:00.000Z').getTime();

  // Generate timer sessions for September 2025 (30 days)
  for (let day = 1; day <= 30; day++) {
    const dayStart = september2025Start + (day - 1) * oneDay;
    const dayOfWeek = new Date(dayStart).getDay(); // 0 = Sunday, 6 = Saturday
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    // Create different patterns based on day of week and periods
    const isEarlyMonth = day <= 10; // 9/1-9/10: 프로젝트 시작, 높은 동기
    const isMidMonth = day > 10 && day <= 20; // 9/11-9/20: 중간 슬럼프
    const isLateMonth = day > 20; // 9/21-9/30: 마감 압박, 집중도 증가

    // Skip probability based on period and day type
    let skipProbability = 0.1; // Base skip rate
    if (isWeekend) skipProbability += 0.3; // Weekends more likely to skip
    if (isMidMonth) skipProbability += 0.2; // Mid-month slump
    if (isEarlyMonth) skipProbability -= 0.05; // High motivation early
    if (isLateMonth) skipProbability -= 0.1; // Deadline pressure

    if (Math.random() < skipProbability) continue;

    // Sessions per day based on period and day type
    let baseSessionsPerDay = 2;
    if (isEarlyMonth) baseSessionsPerDay = 3; // High motivation
    if (isMidMonth) baseSessionsPerDay = 1; // Slump period
    if (isLateMonth) baseSessionsPerDay = 4; // Crunch time
    if (isWeekend) baseSessionsPerDay = Math.max(1, baseSessionsPerDay - 1); // Fewer on weekends

    const sessionsPerDay = Math.floor(Math.random() * 3) + baseSessionsPerDay; // Add randomness

    for (let sessionIndex = 0; sessionIndex < sessionsPerDay; sessionIndex++) {
      // More realistic time distribution based on period and session index
      let preferredHours = [9, 10, 11, 14, 15, 16, 19, 20, 21]; // Common work hours
      if (isWeekend) preferredHours = [10, 11, 14, 15, 16, 17, 20, 21]; // Later start on weekends
      if (isLateMonth)
        preferredHours = [8, 9, 10, 11, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22]; // Extended hours during crunch

      const hourOffset =
        preferredHours[Math.floor(Math.random() * preferredHours.length)];
      const minuteOffset = Math.floor(Math.random() * 60);
      const startTime =
        dayStart + hourOffset * 60 * 60 * 1000 + minuteOffset * 60 * 1000;

      // Variable target duration based on period and time of day
      let baseDuration = 45; // Base 45 minutes
      if (isEarlyMonth) baseDuration = 60; // Longer sessions when motivated
      if (isMidMonth) baseDuration = 30; // Shorter during slump
      if (isLateMonth) baseDuration = 90; // Much longer during crunch
      if (hourOffset >= 20) baseDuration *= 0.8; // Shorter evening sessions

      const durationVariation = Math.floor(Math.random() * 40) - 20; // ±20 minutes
      const targetDuration =
        Math.max(15, baseDuration + durationVariation) * 60 * 1000;

      // Completion rate varies by period and session characteristics
      let baseCompletionRate = 0.85;
      if (isEarlyMonth) baseCompletionRate = 0.9; // High completion when motivated
      if (isMidMonth) baseCompletionRate = 0.7; // Lower during slump
      if (isLateMonth) baseCompletionRate = 0.95; // Very high during crunch
      if (sessionIndex > 3) baseCompletionRate -= 0.1; // Fatigue in later sessions

      const completionRate = Math.max(
        0.5,
        Math.min(1.0, baseCompletionRate + (Math.random() - 0.5) * 0.3),
      );
      const actualDuration = Math.floor(targetDuration * completionRate);

      // Generate interruptions based on period and session quality
      const pauseEvents = [];
      const scrollEvents = [];
      const screenUnlockEvents = [];

      // Pause events vary by period
      let maxPauses = 2;
      if (isEarlyMonth) maxPauses = 1; // Fewer pauses when focused
      if (isMidMonth) maxPauses = 4; // More pauses during slump
      if (isLateMonth) maxPauses = 1; // Fewer pauses during crunch

      const pauseCount = Math.floor(Math.random() * (maxPauses + 1));
      for (let i = 0; i < pauseCount; i++) {
        const pauseStart =
          startTime + Math.floor(Math.random() * actualDuration);
        let pauseDuration = (Math.floor(Math.random() * 5) + 1) * 60 * 1000; // 1-5 minutes
        if (isMidMonth) pauseDuration *= 1.5; // Longer pauses during slump
        if (isLateMonth) pauseDuration *= 0.7; // Shorter pauses during crunch

        pauseEvents.push({
          startTs: pauseStart,
          endTs: pauseStart + pauseDuration,
          durationMs: pauseDuration,
        });
      }

      // Scroll events vary by focus level
      let maxScrolls = 3;
      if (isEarlyMonth) maxScrolls = 2; // Less scrolling when focused
      if (isMidMonth) maxScrolls = 8; // More scrolling during slump
      if (isLateMonth) maxScrolls = 1; // Minimal scrolling during crunch

      const scrollCount = Math.floor(Math.random() * (maxScrolls + 1));
      for (let i = 0; i < scrollCount; i++) {
        scrollEvents.push({
          timestamp: startTime + Math.floor(Math.random() * actualDuration),
        });
      }

      // Screen unlock events vary by distraction level
      let maxUnlocks = 2;
      if (isEarlyMonth) maxUnlocks = 1; // Less distraction when motivated
      if (isMidMonth) maxUnlocks = 5; // More distraction during slump
      if (isLateMonth) maxUnlocks = 0; // Minimal distraction during crunch

      const unlockCount = Math.floor(Math.random() * (maxUnlocks + 1));
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
  // await createEnfloProjectSessions();
  // await createReadingSessions();
  // await createFocusSessions();
};
