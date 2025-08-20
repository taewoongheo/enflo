import { generateTimeStatus } from '@/components/TimerPage/utils/generateTimeStatus';
import { mapFocusToY } from '@/components/TimerPage/utils/mapDropToY';
import Session, { getTimeRange } from '@/models/Session';
import TimerSession from '@/models/TimerSession';
import {
  AppStateEvent,
  PauseEvent,
  ScrollInteractionEvent,
} from '@/types/InterruptEvent';

function createMockTimerSession(params: {
  sessionId: string;
  targetDurationMs: number;
  actualDurationMs: number;
  pauseEvents?: PauseEvent[];
  screenUnlockEvents?: AppStateEvent[];
  scrollEvents?: ScrollInteractionEvent[];
}): TimerSession {
  const session = new TimerSession({
    sessionId: params.sessionId,
    targetDurationMs: params.targetDurationMs,
  });

  const now = Date.now();
  session.startTs = now - params.actualDurationMs;

  session.calculateEntropy({
    endTs: now,
    screenBackgroundCount: params.screenUnlockEvents || [],
    scrollInteractionCount: params.scrollEvents || [],
    pauseEvents: params.pauseEvents || [],
  });

  return session;
}

function createPauseEvent(
  startOffset: number,
  durationMs: number,
  baseTs: number,
): PauseEvent {
  const startTs = baseTs + startOffset;
  return {
    startTs,
    endTs: startTs + durationMs,
    durationMs,
  };
}

function createAppStateEvent(
  offset: number,
  baseTs: number,
  appState: 'active' | 'background',
): AppStateEvent {
  return {
    timestamp: baseTs + offset,
    appState,
  };
}

function createScrollEvent(
  offset: number,
  baseTs: number,
): ScrollInteractionEvent {
  return {
    timestamp: baseTs + offset,
  };
}

function runTimeStatusSimulation() {
  console.log('=== generateTimeStatus 시뮬레이션 시작 ===');

  const timeRange = getTimeRange(Date.now());

  // 시나리오 1: 짧은 세션들에서 방해 패턴 분석
  console.log('\n시나리오 1: 짧은 세션들 (10-20분), 다양한 방해 패턴');
  const shortSession = new Session({ sessionName: '짧은 세션 패턴' });
  shortSession.timerSessionsByTimeRange[timeRange] = [];

  const shortPatterns = [
    { duration: 12, pauses: 1, unlocks: 2, scrolls: 3 },
    { duration: 15, pauses: 2, unlocks: 3, scrolls: 4 },
    { duration: 18, pauses: 1, unlocks: 4, scrolls: 2 },
    { duration: 20, pauses: 3, unlocks: 2, scrolls: 5 },
  ];

  shortPatterns.forEach((pattern) => {
    const actualDuration = pattern.duration * 60 * 1000;
    const now = Date.now();
    const startTs = now - actualDuration;

    const pauseEvents: PauseEvent[] = [];
    for (let p = 0; p < pattern.pauses; p++) {
      pauseEvents.push(
        createPauseEvent((3 + p * 4) * 60 * 1000, 60 * 1000, startTs),
      );
    }

    const unlockEvents: AppStateEvent[] = [];
    for (let u = 0; u < pattern.unlocks; u += 2) {
      unlockEvents.push(
        createAppStateEvent((2 + u * 2) * 60 * 1000, startTs, 'background'),
      );
      unlockEvents.push(
        createAppStateEvent(
          (2 + u * 2) * 60 * 1000 + 15 * 1000,
          startTs,
          'active',
        ),
      );
    }

    const scrollEvents: ScrollInteractionEvent[] = [];
    for (let s = 0; s < pattern.scrolls; s++) {
      scrollEvents.push(createScrollEvent((1 + s * 2) * 60 * 1000, startTs));
    }

    const session = createMockTimerSession({
      sessionId: shortSession.sessionId,
      targetDurationMs: 25 * 60 * 1000,
      actualDurationMs: actualDuration,
      pauseEvents,
      screenUnlockEvents: unlockEvents,
      scrollEvents,
    });
    shortSession.timerSessionsByTimeRange[timeRange].push(session);
  });

  const shortTimeStatus = generateTimeStatus(shortSession, 5);
  const shortFocusY = mapFocusToY(shortTimeStatus);

  console.log('짧은 세션 Time Status (5분 버킷):');
  console.log('원본 데이터:', shortTimeStatus);
  console.log('몰입도 Y값 (0~100, 높을수록 집중):', shortFocusY);

  // 시나리오 2: 중간 길이 세션들 (25-40분)
  console.log('\n시나리오 2: 중간 길이 세션들 (25-40분)');
  const mediumSession = new Session({ sessionName: '중간 길이 세션 패턴' });
  mediumSession.timerSessionsByTimeRange[timeRange] = [];

  const mediumPatterns = [
    { duration: 25, pauses: 1, unlocks: 2, scrolls: 2 },
    { duration: 30, pauses: 2, unlocks: 3, scrolls: 3 },
    { duration: 35, pauses: 1, unlocks: 4, scrolls: 2 },
    { duration: 40, pauses: 3, unlocks: 2, scrolls: 4 },
    { duration: 28, pauses: 2, unlocks: 3, scrolls: 3 },
  ];

  mediumPatterns.forEach((pattern) => {
    const actualDuration = pattern.duration * 60 * 1000;
    const now = Date.now();
    const startTs = now - actualDuration;

    const pauseEvents: PauseEvent[] = [];
    for (let p = 0; p < pattern.pauses; p++) {
      pauseEvents.push(
        createPauseEvent((5 + p * 8) * 60 * 1000, 90 * 1000, startTs),
      );
    }

    const unlockEvents: AppStateEvent[] = [];
    for (let u = 0; u < pattern.unlocks; u += 2) {
      unlockEvents.push(
        createAppStateEvent((7 + u * 5) * 60 * 1000, startTs, 'background'),
      );
      unlockEvents.push(
        createAppStateEvent(
          (7 + u * 5) * 60 * 1000 + 20 * 1000,
          startTs,
          'active',
        ),
      );
    }

    const scrollEvents: ScrollInteractionEvent[] = [];
    for (let s = 0; s < pattern.scrolls; s++) {
      scrollEvents.push(createScrollEvent((3 + s * 5) * 60 * 1000, startTs));
    }

    const session = createMockTimerSession({
      sessionId: mediumSession.sessionId,
      targetDurationMs: 45 * 60 * 1000,
      actualDurationMs: actualDuration,
      pauseEvents,
      screenUnlockEvents: unlockEvents,
      scrollEvents,
    });
    mediumSession.timerSessionsByTimeRange[timeRange].push(session);
  });

  const mediumTimeStatus = generateTimeStatus(mediumSession, 5);
  const mediumFocusY = mapFocusToY(mediumTimeStatus);

  console.log('중간 길이 세션 Time Status (5분 버킷):');
  console.log('원본 데이터:', mediumTimeStatus);
  console.log('몰입도 Y값 (0~100, 높을수록 집중):', mediumFocusY);

  // 시나리오 3: 장시간 세션들 (60-90분)
  console.log('\n시나리오 3: 장시간 세션들 (60-90분)');
  const longSession = new Session({ sessionName: '장시간 세션 패턴' });
  longSession.timerSessionsByTimeRange[timeRange] = [];

  const longPatterns = [
    { duration: 65, pauses: 2, unlocks: 3, scrolls: 4 },
    { duration: 75, pauses: 3, unlocks: 4, scrolls: 5 },
    { duration: 85, pauses: 1, unlocks: 2, scrolls: 2 },
    { duration: 90, pauses: 4, unlocks: 5, scrolls: 6 },
  ];

  longPatterns.forEach((pattern) => {
    const actualDuration = pattern.duration * 60 * 1000;
    const now = Date.now();
    const startTs = now - actualDuration;

    const pauseEvents: PauseEvent[] = [];
    for (let p = 0; p < pattern.pauses; p++) {
      pauseEvents.push(
        createPauseEvent((15 + p * 15) * 60 * 1000, 2 * 60 * 1000, startTs),
      );
    }

    const unlockEvents: AppStateEvent[] = [];
    for (let u = 0; u < pattern.unlocks; u += 2) {
      unlockEvents.push(
        createAppStateEvent((10 + u * 12) * 60 * 1000, startTs, 'background'),
      );
      unlockEvents.push(
        createAppStateEvent(
          (10 + u * 12) * 60 * 1000 + 30 * 1000,
          startTs,
          'active',
        ),
      );
    }

    const scrollEvents: ScrollInteractionEvent[] = [];
    for (let s = 0; s < pattern.scrolls; s++) {
      scrollEvents.push(createScrollEvent((8 + s * 8) * 60 * 1000, startTs));
    }

    const session = createMockTimerSession({
      sessionId: longSession.sessionId,
      targetDurationMs: 90 * 60 * 1000,
      actualDurationMs: actualDuration,
      pauseEvents,
      screenUnlockEvents: unlockEvents,
      scrollEvents,
    });
    longSession.timerSessionsByTimeRange[timeRange].push(session);
  });

  const longTimeStatus = generateTimeStatus(longSession, 5);
  const longFocusY = mapFocusToY(longTimeStatus);

  console.log('장시간 세션 Time Status (5분 버킷):');
  console.log('원본 데이터:', longTimeStatus);
  console.log('몰입도 Y값 (0~100, 높을수록 집중):', longFocusY);

  // 시나리오 4: 초기 집중력 약화 패턴 (처음 10분에 방해 집중)
  console.log('\n시나리오 4: 초기 집중력 약화 패턴');
  const earlyDisturbanceSession = new Session({
    sessionName: '초기 방해 패턴',
  });
  earlyDisturbanceSession.timerSessionsByTimeRange[timeRange] = [];

  for (let i = 0; i < 4; i++) {
    const actualDuration = (30 + i * 5) * 60 * 1000;
    const now = Date.now();
    const startTs = now - actualDuration;

    // 초기 10분에 집중적으로 방해 발생
    const pauseEvents: PauseEvent[] = [
      createPauseEvent(3 * 60 * 1000, 60 * 1000, startTs),
      createPauseEvent(7 * 60 * 1000, 45 * 1000, startTs),
    ];

    const unlockEvents: AppStateEvent[] = [
      createAppStateEvent(2 * 60 * 1000, startTs, 'background'),
      createAppStateEvent(2 * 60 * 1000 + 10 * 1000, startTs, 'active'),
      createAppStateEvent(5 * 60 * 1000, startTs, 'background'),
      createAppStateEvent(5 * 60 * 1000 + 15 * 1000, startTs, 'active'),
      createAppStateEvent(8 * 60 * 1000, startTs, 'background'),
      createAppStateEvent(8 * 60 * 1000 + 20 * 1000, startTs, 'active'),
    ];

    const scrollEvents: ScrollInteractionEvent[] = [
      createScrollEvent(1 * 60 * 1000, startTs),
      createScrollEvent(4 * 60 * 1000, startTs),
      createScrollEvent(6 * 60 * 1000, startTs),
      createScrollEvent(9 * 60 * 1000, startTs),
    ];

    const session = createMockTimerSession({
      sessionId: earlyDisturbanceSession.sessionId,
      targetDurationMs: 45 * 60 * 1000,
      actualDurationMs: actualDuration,
      pauseEvents,
      screenUnlockEvents: unlockEvents,
      scrollEvents,
    });
    earlyDisturbanceSession.timerSessionsByTimeRange[timeRange].push(session);
  }

  const earlyDisturbanceTimeStatus = generateTimeStatus(
    earlyDisturbanceSession,
    5,
  );
  const earlyFocusY = mapFocusToY(earlyDisturbanceTimeStatus);

  console.log('초기 방해 패턴 Time Status (5분 버킷):');
  console.log('원본 데이터:', earlyDisturbanceTimeStatus);
  console.log('몰입도 Y값 (0~100, 높을수록 집중):', earlyFocusY);

  // 시나리오 5: 후반 피로도 증가 패턴 (20분 이후 방해 증가)
  console.log('\n시나리오 5: 후반 피로도 증가 패턴');
  const lateFatigueSession = new Session({ sessionName: '후반 피로 패턴' });
  lateFatigueSession.timerSessionsByTimeRange[timeRange] = [];

  for (let i = 0; i < 5; i++) {
    const actualDuration = (35 + i * 3) * 60 * 1000;
    const now = Date.now();
    const startTs = now - actualDuration;

    // 20분 이후에 방해 증가
    const pauseEvents: PauseEvent[] = [
      createPauseEvent(22 * 60 * 1000, 90 * 1000, startTs),
      createPauseEvent(28 * 60 * 1000, 75 * 1000, startTs),
      createPauseEvent(32 * 60 * 1000, 60 * 1000, startTs),
    ];

    const unlockEvents: AppStateEvent[] = [
      createAppStateEvent(21 * 60 * 1000, startTs, 'background'),
      createAppStateEvent(21 * 60 * 1000 + 20 * 1000, startTs, 'active'),
      createAppStateEvent(25 * 60 * 1000, startTs, 'background'),
      createAppStateEvent(25 * 60 * 1000 + 25 * 1000, startTs, 'active'),
      createAppStateEvent(30 * 60 * 1000, startTs, 'background'),
      createAppStateEvent(30 * 60 * 1000 + 30 * 1000, startTs, 'active'),
      createAppStateEvent(34 * 60 * 1000, startTs, 'background'),
      createAppStateEvent(34 * 60 * 1000 + 15 * 1000, startTs, 'active'),
    ];

    const scrollEvents: ScrollInteractionEvent[] = [
      createScrollEvent(23 * 60 * 1000, startTs),
      createScrollEvent(26 * 60 * 1000, startTs),
      createScrollEvent(29 * 60 * 1000, startTs),
      createScrollEvent(31 * 60 * 1000, startTs),
      createScrollEvent(33 * 60 * 1000, startTs),
    ];

    const session = createMockTimerSession({
      sessionId: lateFatigueSession.sessionId,
      targetDurationMs: 45 * 60 * 1000,
      actualDurationMs: actualDuration,
      pauseEvents,
      screenUnlockEvents: unlockEvents,
      scrollEvents,
    });
    lateFatigueSession.timerSessionsByTimeRange[timeRange].push(session);
  }

  const lateFatigueTimeStatus = generateTimeStatus(lateFatigueSession, 5);
  const lateFocusY = mapFocusToY(lateFatigueTimeStatus);

  console.log('후반 피로 패턴 Time Status (5분 버킷):');
  console.log('원본 데이터:', lateFatigueTimeStatus);
  console.log('몰입도 Y값 (0~100, 높을수록 집중):', lateFocusY);

  // 시나리오 6: 완벽한 집중 패턴 (방해 거의 없음)
  console.log('\n시나리오 6: 완벽한 집중 패턴');
  const perfectSession = new Session({ sessionName: '완벽한 집중 패턴' });
  perfectSession.timerSessionsByTimeRange[timeRange] = [];

  for (let i = 0; i < 3; i++) {
    const actualDuration = (50 + i * 10) * 60 * 1000;
    const now = Date.now();
    const startTs = now - actualDuration;

    // 최소한의 방해만
    const pauseEvents: PauseEvent[] =
      i === 1 ? [createPauseEvent(25 * 60 * 1000, 30 * 1000, startTs)] : [];

    const unlockEvents: AppStateEvent[] =
      i === 2
        ? [
            createAppStateEvent(15 * 60 * 1000, startTs, 'background'),
            createAppStateEvent(15 * 60 * 1000 + 10 * 1000, startTs, 'active'),
          ]
        : [];

    const scrollEvents: ScrollInteractionEvent[] =
      i === 0 ? [createScrollEvent(10 * 60 * 1000, startTs)] : [];

    const session = createMockTimerSession({
      sessionId: perfectSession.sessionId,
      targetDurationMs: 60 * 60 * 1000,
      actualDurationMs: actualDuration,
      pauseEvents,
      screenUnlockEvents: unlockEvents,
      scrollEvents,
    });
    perfectSession.timerSessionsByTimeRange[timeRange].push(session);
  }

  const perfectTimeStatus = generateTimeStatus(perfectSession, 5);
  const perfectFocusY = mapFocusToY(perfectTimeStatus);

  console.log('완벽한 집중 패턴 Time Status (5분 버킷):');
  console.log('원본 데이터:', perfectTimeStatus);
  console.log('몰입도 Y값 (0~100, 높을수록 집중):', perfectFocusY);

  console.log('\n=== 시뮬레이션 완료 ===');
}

// 시뮬레이션 실행
runTimeStatusSimulation();
