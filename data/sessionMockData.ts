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
    Date.now() - 86400000 * 2, // 2 days ago
    Date.now() - 86400000 * 2 + 1600000, // 26.7 minutes later
    [
      {
        startTs: Date.now() - 86400000 * 2 + 600000,
        endTs: Date.now() - 86400000 * 2 + 660000,
        durationMs: 60000,
      },
    ],
    [
      { timestamp: Date.now() - 86400000 * 2 + 300000 },
      { timestamp: Date.now() - 86400000 * 2 + 900000 },
    ],
    [
      {
        timestamp: Date.now() - 86400000 * 2 + 1200000,
        appState: 'background',
      },
      {
        timestamp: Date.now() - 86400000 * 2 + 1400000,
        appState: 'active',
      },
    ],
  );
  const timerSession2 = await createMockTimerSession(
    sessionId,
    3600000, // 1 hour
    Date.now() - 86400000, // 1 day ago
    Date.now() - 86400000 + 3200000, // 53.3 minutes later
    [
      {
        startTs: Date.now() - 86400000 + 1200000,
        endTs: Date.now() - 86400000 + 1800000,
        durationMs: 600000,
      },
      {
        startTs: Date.now() - 86400000 + 2400000,
        endTs: Date.now() - 86400000 + 2460000,
        durationMs: 60000,
      },
    ],
    [
      { timestamp: Date.now() - 86400000 + 600000 },
      { timestamp: Date.now() - 86400000 + 1500000 },
      { timestamp: Date.now() - 86400000 + 2700000 },
    ],
    [
      { timestamp: Date.now() - 86400000 + 1800000, appState: 'background' },
      { timestamp: Date.now() - 86400000 + 2100000, appState: 'active' },
    ],
  );
  const timerSession3 = await createMockTimerSession(
    sessionId,
    2700000, // 45 minutes
    Date.now() - 43200000, // 12 hours ago
    Date.now() - 43200000 + 2400000, // 40 minutes later
    [
      {
        startTs: Date.now() - 43200000 + 900000,
        endTs: Date.now() - 43200000 + 960000,
        durationMs: 60000,
      },
    ],
    [
      { timestamp: Date.now() - 43200000 + 300000 },
      { timestamp: Date.now() - 43200000 + 1200000 },
      { timestamp: Date.now() - 43200000 + 1800000 },
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
    Date.now() - 86400000 * 3, // 3 days ago
    Date.now() - 86400000 * 3 + 1100000, // 18.3 minutes later
    [
      {
        startTs: Date.now() - 86400000 * 3 + 600000,
        endTs: Date.now() - 86400000 * 3 + 660000,
        durationMs: 60000,
      },
    ],
    [{ timestamp: Date.now() - 86400000 * 3 + 300000 }],
    [],
  );

  const timerSession2 = await createMockTimerSession(
    sessionId,
    1800000, // 30 minutes
    Date.now() - 86400000 * 1.5, // 1.5 days ago
    Date.now() - 86400000 * 1.5 + 1650000, // 27.5 minutes later
    [
      {
        startTs: Date.now() - 86400000 * 1.5 + 900000,
        endTs: Date.now() - 86400000 * 1.5 + 1020000,
        durationMs: 120000,
      },
    ],
    [
      { timestamp: Date.now() - 86400000 * 1.5 + 600000 },
      { timestamp: Date.now() - 86400000 * 1.5 + 1200000 },
    ],
    [
      {
        timestamp: Date.now() - 86400000 * 1.5 + 1020000,
        appState: 'background',
      },
      { timestamp: Date.now() - 86400000 * 1.5 + 1200000, appState: 'active' },
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
    Date.now() - 86400000 * 0.5, // 12 hours ago
    Date.now() - 86400000 * 0.5 + 900000, // 15 minutes later (perfect)
    [], // No pauses - perfect focus
    [], // No scroll interactions
    [], // No screen unlocks
  );

  const timerSession2 = await createMockTimerSession(
    sessionId,
    2400000, // 40 minutes
    Date.now() - 21600000, // 6 hours ago
    Date.now() - 21600000 + 2100000, // 35 minutes later
    [
      {
        startTs: Date.now() - 21600000 + 1200000,
        endTs: Date.now() - 21600000 + 1260000,
        durationMs: 60000,
      },
    ],
    [{ timestamp: Date.now() - 21600000 + 600000 }],
    [],
  );

  const timerSession3 = await createMockTimerSession(
    sessionId,
    1800000, // 30 minutes
    Date.now() - 7200000, // 2 hours ago
    Date.now() - 7200000 + 1500000, // 25 minutes later
    [
      {
        startTs: Date.now() - 7200000 + 600000,
        endTs: Date.now() - 7200000 + 720000,
        durationMs: 120000,
      },
      {
        startTs: Date.now() - 7200000 + 1200000,
        endTs: Date.now() - 7200000 + 1260000,
        durationMs: 60000,
      },
    ],
    [
      { timestamp: Date.now() - 7200000 + 300000 },
      { timestamp: Date.now() - 7200000 + 900000 },
    ],
    [
      { timestamp: Date.now() - 7200000 + 720000, appState: 'background' },
      { timestamp: Date.now() - 7200000 + 900000, appState: 'active' },
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
  await sessionService.addTimerSession({
    sessionId,
    timerSession: timerSession3,
  });

  return session;
};

export const createAllMockSessions = async (): Promise<Session[]> => {
  const enfloSession = await createEnfloProjectSessions();
  const readingSession = await createReadingSessions();
  const focusSession = await createFocusSessions();

  return [enfloSession, readingSession, focusSession];
};
