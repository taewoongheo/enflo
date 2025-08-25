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
    new Date(Date.now() - 86400000 * 2).setHours(21, 30, 0, 0), // 2 days ago at 9:30 PM (18-24)
    new Date(Date.now() - 86400000 * 2).setHours(21, 30, 0, 0) + 1600000, // 26.7 minutes later
    [
      {
        startTs:
          new Date(Date.now() - 86400000 * 2).setHours(21, 30, 0, 0) + 600000,
        endTs:
          new Date(Date.now() - 86400000 * 2).setHours(21, 30, 0, 0) + 660000,
        durationMs: 60000,
      },
    ],
    [
      {
        timestamp:
          new Date(Date.now() - 86400000 * 2).setHours(21, 30, 0, 0) + 300000,
      },
      {
        timestamp:
          new Date(Date.now() - 86400000 * 2).setHours(21, 30, 0, 0) + 900000,
      },
    ],
    [
      {
        timestamp:
          new Date(Date.now() - 86400000 * 2).setHours(21, 30, 0, 0) + 1200000,
        appState: 'background',
      },
      {
        timestamp:
          new Date(Date.now() - 86400000 * 2).setHours(21, 30, 0, 0) + 1400000,
        appState: 'active',
      },
    ],
  );
  const timerSession2 = await createMockTimerSession(
    sessionId,
    3600000, // 1 hour
    new Date(Date.now() - 86400000).setHours(22, 15, 0, 0), // 1 day ago at 10:15 PM (18-24)
    new Date(Date.now() - 86400000).setHours(22, 15, 0, 0) + 3200000, // 53.3 minutes later
    [
      {
        startTs:
          new Date(Date.now() - 86400000).setHours(22, 15, 0, 0) + 1200000,
        endTs: new Date(Date.now() - 86400000).setHours(22, 15, 0, 0) + 1800000,
        durationMs: 600000,
      },
      {
        startTs:
          new Date(Date.now() - 86400000).setHours(22, 15, 0, 0) + 2400000,
        endTs: new Date(Date.now() - 86400000).setHours(22, 15, 0, 0) + 2460000,
        durationMs: 60000,
      },
    ],
    [
      {
        timestamp:
          new Date(Date.now() - 86400000).setHours(22, 15, 0, 0) + 600000,
      },
      {
        timestamp:
          new Date(Date.now() - 86400000).setHours(22, 15, 0, 0) + 1500000,
      },
      {
        timestamp:
          new Date(Date.now() - 86400000).setHours(22, 15, 0, 0) + 2700000,
      },
    ],
    [
      {
        timestamp:
          new Date(Date.now() - 86400000).setHours(22, 15, 0, 0) + 1800000,
        appState: 'background',
      },
      {
        timestamp:
          new Date(Date.now() - 86400000).setHours(22, 15, 0, 0) + 2100000,
        appState: 'active',
      },
    ],
  );
  const timerSession3 = await createMockTimerSession(
    sessionId,
    2700000, // 45 minutes
    new Date(Date.now() - 43200000).setHours(23, 0, 0, 0), // 12 hours ago at 11:00 PM (18-24)
    new Date(Date.now() - 43200000).setHours(23, 0, 0, 0) + 2400000, // 40 minutes later
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

  const timerSession4 = await createMockTimerSession(
    sessionId,
    1200000, // 20 minutes
    new Date(Date.now() - 36000000).setHours(20, 45, 0, 0), // 10 hours ago at 8:45 PM (18-24)
    new Date(Date.now() - 36000000).setHours(20, 45, 0, 0) + 1100000, // 18.3 minutes later
    [
      {
        startTs: Date.now() - 36000000 + 400000,
        endTs: Date.now() - 36000000 + 460000,
        durationMs: 60000,
      },
    ],
    [
      { timestamp: Date.now() - 36000000 + 200000 },
      { timestamp: Date.now() - 36000000 + 800000 },
    ],
    [
      {
        timestamp: Date.now() - 36000000 + 600000,
        appState: 'background',
      },
      {
        timestamp: Date.now() - 36000000 + 700000,
        appState: 'active',
      },
    ],
  );

  const timerSession5 = await createMockTimerSession(
    sessionId,
    3000000, // 50 minutes
    new Date(Date.now() - 18000000).setHours(21, 0, 0, 0), // 5 hours ago at 9:00 PM (18-24)
    new Date(Date.now() - 18000000).setHours(21, 0, 0, 0) + 2800000, // 46.7 minutes later
    [
      {
        startTs: Date.now() - 18000000 + 1000000,
        endTs: Date.now() - 18000000 + 1120000,
        durationMs: 120000,
      },
      {
        startTs: Date.now() - 18000000 + 2000000,
        endTs: Date.now() - 18000000 + 2060000,
        durationMs: 60000,
      },
    ],
    [
      { timestamp: Date.now() - 18000000 + 500000 },
      { timestamp: Date.now() - 18000000 + 1500000 },
      { timestamp: Date.now() - 18000000 + 2200000 },
    ],
    [
      {
        timestamp: Date.now() - 18000000 + 1120000,
        appState: 'background',
      },
      {
        timestamp: Date.now() - 18000000 + 1300000,
        appState: 'active',
      },
    ],
  );

  const timerSession6 = await createMockTimerSession(
    sessionId,
    1500000, // 25 minutes
    new Date(Date.now() - 9000000).setHours(22, 30, 0, 0), // 2.5 hours ago at 10:30 PM (18-24)
    new Date(Date.now() - 9000000).setHours(22, 30, 0, 0) + 1400000, // 23.3 minutes later
    [
      {
        startTs: Date.now() - 9000000 + 600000,
        endTs: Date.now() - 9000000 + 660000,
        durationMs: 60000,
      },
    ],
    [
      { timestamp: Date.now() - 9000000 + 300000 },
      { timestamp: Date.now() - 9000000 + 900000 },
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

  // await sessionService.addTimerSession({
  //   sessionId,
  //   timerSession: timerSession1,
  // });
  // await sessionService.addTimerSession({
  //   sessionId,
  //   timerSession: timerSession2,
  // });
  // await sessionService.addTimerSession({
  //   sessionId,
  //   timerSession: timerSession3,
  // });

  return session;
};

export const createAllMockSessions = async (): Promise<void> => {
  // await createEnfloProjectSessions();
  // await createReadingSessions();
  await createFocusSessions();
};
