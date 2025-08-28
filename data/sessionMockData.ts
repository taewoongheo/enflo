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

  return timerSession;
};

export const createEnfloProjectSessions = async (): Promise<Session> => {
  const sessionName = 'enflo 프로젝트 완성';
  const session = await sessionService.createSession({
    sessionName,
  });

  const sessionId = session.sessionId;

  const timerSession1 = await createMockTimerSession(
    sessionId,
    1800000, // 30 minutes
    Date.now() - 7200000, // 2 hours ago
    Date.now() - 7200000 + 1600000, // 26.7 minutes later
    [
      {
        startTs: Date.now() - 7200000 + 600000,
        endTs: Date.now() - 7200000 + 660000,
        durationMs: 60000,
      },
    ],
    [
      {
        timestamp: Date.now() - 7200000 + 300000,
      },
      {
        timestamp: Date.now() - 7200000 + 900000,
      },
    ],
    [
      {
        timestamp: Date.now() - 7200000 + 1200000,
        appState: 'background',
      },
    ],
  );
  const timerSession2 = await createMockTimerSession(
    sessionId,
    3600000, // 1 hour
    Date.now() - 5400000, // 1.5 hours ago
    Date.now() - 5400000 + 3200000, // 53.3 minutes later
    [
      {
        startTs: Date.now() - 5400000 + 1200000,
        endTs: Date.now() - 5400000 + 1800000,
        durationMs: 600000,
      },
      {
        startTs: Date.now() - 5400000 + 2400000,
        endTs: Date.now() - 5400000 + 2460000,
        durationMs: 60000,
      },
    ],
    [
      {
        timestamp: Date.now() - 5400000 + 600000,
      },
      {
        timestamp: Date.now() - 5400000 + 1500000,
      },
      {
        timestamp: Date.now() - 5400000 + 2700000,
      },
    ],
    [
      {
        timestamp: Date.now() - 5400000 + 1800000,
        appState: 'background',
      },
    ],
  );
  const timerSession3 = await createMockTimerSession(
    sessionId,
    2700000, // 45 minutes
    Date.now() - 3600000, // 1 hour ago
    Date.now() - 3600000 + 2400000, // 40 minutes later
    [
      {
        startTs: Date.now() - 3600000 + 900000,
        endTs: Date.now() - 3600000 + 960000,
        durationMs: 60000,
      },
    ],
    [
      { timestamp: Date.now() - 3600000 + 300000 },
      { timestamp: Date.now() - 3600000 + 1200000 },
      { timestamp: Date.now() - 3600000 + 1800000 },
    ],
    [],
  );

  const timerSession4 = await createMockTimerSession(
    sessionId,
    1200000, // 20 minutes
    Date.now() - 1800000, // 30 minutes ago
    Date.now() - 1800000 + 1100000, // 18.3 minutes later
    [
      {
        startTs: Date.now() - 1800000 + 400000,
        endTs: Date.now() - 1800000 + 460000,
        durationMs: 60000,
      },
    ],
    [
      { timestamp: Date.now() - 1800000 + 200000 },
      { timestamp: Date.now() - 1800000 + 800000 },
    ],
    [
      {
        timestamp: Date.now() - 1800000 + 600000,
        appState: 'background',
      },
    ],
  );

  const timerSession5 = await createMockTimerSession(
    sessionId,
    3000000, // 50 minutes
    Date.now() - 900000, // 15 minutes ago
    Date.now() - 900000 + 2800000, // 46.7 minutes later
    [
      {
        startTs: Date.now() - 900000 + 1000000,
        endTs: Date.now() - 900000 + 1120000,
        durationMs: 120000,
      },
      {
        startTs: Date.now() - 900000 + 2000000,
        endTs: Date.now() - 900000 + 2060000,
        durationMs: 60000,
      },
    ],
    [
      { timestamp: Date.now() - 900000 + 500000 },
      { timestamp: Date.now() - 900000 + 1500000 },
      { timestamp: Date.now() - 900000 + 2200000 },
    ],
    [
      {
        timestamp: Date.now() - 900000 + 1120000,
        appState: 'background',
      },
    ],
  );

  const timerSession6 = await createMockTimerSession(
    sessionId,
    1500000, // 25 minutes
    Date.now() - 600000, // 10 minutes ago
    Date.now() - 600000 + 1400000, // 23.3 minutes later
    [
      {
        startTs: Date.now() - 600000 + 600000,
        endTs: Date.now() - 600000 + 660000,
        durationMs: 60000,
      },
    ],
    [
      { timestamp: Date.now() - 600000 + 300000 },
      { timestamp: Date.now() - 600000 + 900000 },
    ],
    [],
  );

  await sessionService.addTimerSession({
    sessionId,
    timerSession: timerSession1,
  });
  await sessionService.addTimerSession({
    sessionId,
    timerSession: timerSession2,
  });
  await sessionService.addTimerSession({
    sessionId,
    timerSession: timerSession3,
  });
  await sessionService.addTimerSession({
    sessionId,
    timerSession: timerSession4,
  });
  await sessionService.addTimerSession({
    sessionId,
    timerSession: timerSession5,
  });
  await sessionService.addTimerSession({
    sessionId,
    timerSession: timerSession6,
  });

  return session;
};

export const createReadingSessions = async (): Promise<Session> => {
  const sessionName = '독서';
  const session = await sessionService.createSession({
    sessionName,
  });

  const sessionId = session.sessionId;

  const timerSession1 = await createMockTimerSession(
    sessionId,
    1200000, // 20 minutes
    Date.now() - 4800000, // 80 minutes ago
    Date.now() - 4800000 + 1100000, // 18.3 minutes later
    [
      {
        startTs: Date.now() - 4800000 + 600000,
        endTs: Date.now() - 4800000 + 660000,
        durationMs: 60000,
      },
    ],
    [{ timestamp: Date.now() - 4800000 + 300000 }],
    [],
  );

  const timerSession2 = await createMockTimerSession(
    sessionId,
    1800000, // 30 minutes
    Date.now() - 2700000, // 45 minutes ago
    Date.now() - 2700000 + 1650000, // 27.5 minutes later
    [
      {
        startTs: Date.now() - 2700000 + 900000,
        endTs: Date.now() - 2700000 + 1020000,
        durationMs: 120000,
      },
    ],
    [
      { timestamp: Date.now() - 2700000 + 600000 },
      { timestamp: Date.now() - 2700000 + 1200000 },
    ],
    [
      {
        timestamp: Date.now() - 2700000 + 1020000,
        appState: 'background',
      },
    ],
  );

  await sessionService.addTimerSession({
    sessionId,
    timerSession: timerSession1,
  });
  await sessionService.addTimerSession({
    sessionId,
    timerSession: timerSession2,
  });

  return session;
};

export const createFocusSessions = async (): Promise<Session> => {
  const sessionName = '몰입';
  const session = await sessionService.createSession({
    sessionName,
  });

  const sessionId = session.sessionId;

  const timerSession1 = await createMockTimerSession(
    sessionId,
    900000, // 15 minutes
    Date.now() - 3000000, // 50 minutes ago
    Date.now() - 3000000 + 900000, // 15 minutes later (perfect)
    [], // No pauses - perfect focus
    [], // No scroll interactions
    [], // No screen unlocks
  );

  const timerSession2 = await createMockTimerSession(
    sessionId,
    2400000, // 40 minutes
    Date.now() - 2400000, // 40 minutes ago
    Date.now() - 2400000 + 2100000, // 35 minutes later
    [
      {
        startTs: Date.now() - 2400000 + 1200000,
        endTs: Date.now() - 2400000 + 1260000,
        durationMs: 60000,
      },
    ],
    [{ timestamp: Date.now() - 2400000 + 600000 }],
    [],
  );

  const timerSession3 = await createMockTimerSession(
    sessionId,
    1800000, // 30 minutes
    Date.now() - 1200000, // 20 minutes ago
    Date.now() - 1200000 + 1500000, // 25 minutes later
    [
      {
        startTs: Date.now() - 1200000 + 600000,
        endTs: Date.now() - 1200000 + 720000,
        durationMs: 120000,
      },
      {
        startTs: Date.now() - 1200000 + 1200000,
        endTs: Date.now() - 1200000 + 1260000,
        durationMs: 60000,
      },
    ],
    [
      { timestamp: Date.now() - 1200000 + 300000 },
      { timestamp: Date.now() - 1200000 + 900000 },
    ],
    [{ timestamp: Date.now() - 1200000 + 720000, appState: 'background' }],
  );

  await sessionService.addTimerSession({
    sessionId,
    timerSession: timerSession1,
  });
  await sessionService.addTimerSession({
    sessionId,
    timerSession: timerSession2,
  });
  await sessionService.addTimerSession({
    sessionId,
    timerSession: timerSession3,
  });

  return session;
};

export const createAllMockSessions = async (): Promise<void> => {
  await createEnfloProjectSessions();
  await createReadingSessions();
  await createFocusSessions();
};
