import { generateSuggestion } from '@/components/TimerPage/utils/generateSuggestion';
import { toUserMessage } from '@/components/TimerPage/utils/toUserMessage';
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

  session.startTs = now - params.actualDurationMs;

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

function runSimulation() {
  console.log('=== generateSuggestion 시뮬레이션 시작 ===');

  const timeRange = getTimeRange(Date.now());

  console.log('시나리오 1: 짧지만 유효한 세션들 (집중 실패 패턴)');
  const failSession = new Session({ sessionName: '집중 실패 세션' });
  failSession.timerSessionsByTimeRange[timeRange] = [];

  const shortSessionPatterns = [
    { duration: 8, pauses: 1, unlocks: 2, scrolls: 2 },
    { duration: 10, pauses: 2, unlocks: 3, scrolls: 3 },
    { duration: 12, pauses: 3, unlocks: 4, scrolls: 4 },
    { duration: 15, pauses: 4, unlocks: 5, scrolls: 5 },
    { duration: 18, pauses: 5, unlocks: 6, scrolls: 6 },
  ];

  shortSessionPatterns.forEach((pattern) => {
    const actualDuration = pattern.duration * 60 * 1000;
    const now = Date.now();
    const startTs = now - actualDuration;

    const pauseEvents: PauseEvent[] = [];
    for (let p = 0; p < pattern.pauses; p++) {
      const pauseDuration = 60 * 1000;
      pauseEvents.push(
        createPauseEvent((2 + p * 2) * 60 * 1000, pauseDuration, startTs),
      );
    }

    const unlockEvents: AppStateEvent[] = [];
    for (let u = 0; u < pattern.unlocks; u += 2) {
      unlockEvents.push(
        createAppStateEvent((1 + u * 1.5) * 60 * 1000, startTs, 'background'),
      );
      unlockEvents.push(
        createAppStateEvent(
          (1 + u * 1.5) * 60 * 1000 + 20 * 1000,
          startTs,
          'active',
        ),
      );
    }

    const scrollEvents: ScrollInteractionEvent[] = [];
    for (let s = 0; s < pattern.scrolls; s++) {
      scrollEvents.push(createScrollEvent((1 + s * 1.5) * 60 * 1000, startTs));
    }

    const session = createMockTimerSession({
      sessionId: failSession.sessionId,
      targetDurationMs: 25 * 60 * 1000,
      actualDurationMs: actualDuration,
      pauseEvents,
      screenUnlockEvents: unlockEvents,
      scrollEvents,
    });
    failSession.timerSessionsByTimeRange[timeRange].push(session);
  });

  console.log('각 세션의 엔트로피 스코어:');
  failSession.timerSessionsByTimeRange[timeRange].forEach((session, i) => {
    console.log(
      `  세션 ${i + 1}: ${session.entropyScore?.toFixed(2) ?? 'null'} (성공: ${session.isSuccess}, 길이: ${((session.endTs! - session.startTs!) / 60000).toFixed(1)}분)`,
    );
  });

  const failSuggestion = generateSuggestion(failSession);
  if (failSuggestion) {
    console.log(`점수: ${failSuggestion.score.toFixed(1)}/100`);
    console.log(`레이블: ${failSuggestion.label}`);
    console.log(`추세: ${failSuggestion.trend}`);
    console.log(`방해 요소 통계:`);
    console.log(
      `  - 일시정지: ${failSuggestion.interruptionStats.pauses.count.toFixed(1)}회/세션`,
    );
    console.log(
      `  - 앱 이탈/복귀: ${failSuggestion.interruptionStats.unlocks.count.toFixed(1)}회/세션`,
    );
    console.log(
      `  - 스크롤 방해: ${failSuggestion.interruptionStats.scrolls.count.toFixed(1)}회/세션`,
    );
    console.log(`메시지: ${toUserMessage(failSuggestion, '월요일', () => {})}`);
  }

  console.log('시나리오 2: 방해가 많은 집중 패턴');
  const problematicSession = new Session({
    sessionName: '방해가 많은 집중 세션',
  });
  problematicSession.timerSessionsByTimeRange[timeRange] = [];

  const disturbancePatterns = [
    { duration: 15, pauses: 3, unlocks: 8, scrolls: 10 },
    { duration: 18, pauses: 4, unlocks: 6, scrolls: 8 },
    { duration: 20, pauses: 5, unlocks: 10, scrolls: 12 },
    { duration: 12, pauses: 2, unlocks: 4, scrolls: 6 },
  ];

  disturbancePatterns.forEach((pattern) => {
    const actualDuration = pattern.duration * 60 * 1000;
    const now = Date.now();
    const startTs = now - actualDuration;

    const pauseEvents: PauseEvent[] = [];
    for (let p = 0; p < pattern.pauses; p++) {
      pauseEvents.push(
        createPauseEvent((2 + p * 2) * 60 * 1000, 60 * 1000, startTs),
      );
    }

    const unlockEvents: AppStateEvent[] = [];
    for (let u = 0; u < pattern.unlocks; u += 2) {
      unlockEvents.push(
        createAppStateEvent((1 + u * 1.5) * 60 * 1000, startTs, 'background'),
      );
      unlockEvents.push(
        createAppStateEvent(
          (1 + u * 1.5) * 60 * 1000 + 20 * 1000,
          startTs,
          'active',
        ),
      );
    }

    const scrollEvents: ScrollInteractionEvent[] = [];
    for (let s = 0; s < pattern.scrolls; s++) {
      scrollEvents.push(createScrollEvent((1 + s * 1) * 60 * 1000, startTs));
    }

    const session = createMockTimerSession({
      sessionId: problematicSession.sessionId,
      targetDurationMs: 25 * 60 * 1000,
      actualDurationMs: actualDuration,
      pauseEvents,
      screenUnlockEvents: unlockEvents,
      scrollEvents,
    });
    problematicSession.timerSessionsByTimeRange[timeRange].push(session);
  });

  console.log('각 세션의 엔트로피 스코어:');
  problematicSession.timerSessionsByTimeRange[timeRange].forEach(
    (session, i) => {
      console.log(
        `  세션 ${i + 1}: ${session.entropyScore?.toFixed(2) ?? 'null'} (성공: ${session.isSuccess}, 길이: ${((session.endTs! - session.startTs!) / 60000).toFixed(1)}분)`,
      );
    },
  );

  const problematicSuggestion = generateSuggestion(problematicSession);
  if (problematicSuggestion) {
    console.log(`점수: ${problematicSuggestion.score.toFixed(1)}/100`);
    console.log(`레이블: ${problematicSuggestion.label}`);
    console.log(`추세: ${problematicSuggestion.trend}`);
    console.log(
      `메시지: ${toUserMessage(problematicSuggestion, '화요일', () => {})}`,
    );
  }

  console.log('시나리오 3: 매우 성공적인 집중 패턴');
  const successSession = new Session({ sessionName: '성공적인 집중 세션' });
  successSession.timerSessionsByTimeRange[timeRange] = [];

  for (let i = 0; i < 5; i++) {
    const actualDuration = (26 + i) * 60 * 1000;
    const now = Date.now();
    const startTs = now - actualDuration;

    const session = createMockTimerSession({
      sessionId: successSession.sessionId,
      targetDurationMs: 25 * 60 * 1000,
      actualDurationMs: actualDuration,
      pauseEvents:
        i < 2 ? [createPauseEvent(15 * 60 * 1000, 30 * 1000, startTs)] : [],
      screenUnlockEvents:
        i < 3
          ? [
              createAppStateEvent(20 * 60 * 1000, startTs, 'background'),
              createAppStateEvent(
                20 * 60 * 1000 + 10 * 1000,
                startTs,
                'active',
              ),
            ]
          : [],
      scrollEvents: i < 1 ? [createScrollEvent(10 * 60 * 1000, startTs)] : [],
    });
    successSession.timerSessionsByTimeRange[timeRange].push(session);
  }

  console.log('각 세션의 엔트로피 스코어:');
  successSession.timerSessionsByTimeRange[timeRange].forEach((session, i) => {
    console.log(
      `  세션 ${i + 1}: ${session.entropyScore?.toFixed(2) ?? 'null'} (성공: ${session.isSuccess}, 길이: ${((session.endTs! - session.startTs!) / 60000).toFixed(1)}분)`,
    );
  });

  const successSuggestion = generateSuggestion(successSession);
  if (successSuggestion) {
    console.log(`점수: ${successSuggestion.score.toFixed(1)}/100`);
    console.log(`레이블: ${successSuggestion.label}`);
    console.log(`추세: ${successSuggestion.trend}`);
    console.log(
      `메시지: ${toUserMessage(successSuggestion, '수요일', () => {})}`,
    );
  }

  console.log('시나리오 4: 중간 길이 완벽한 집중 패턴 (20~30분, 방해 없음)');
  const perfectMediumSession = new Session({
    sessionName: '완벽한 중간 길이 집중 세션',
  });
  perfectMediumSession.timerSessionsByTimeRange[timeRange] = [];

  const perfectMediumPatterns = [
    { duration: 20, pauses: 0, unlocks: 0, scrolls: 0 },
    { duration: 22, pauses: 0, unlocks: 0, scrolls: 0 },
    { duration: 25, pauses: 1, unlocks: 0, scrolls: 0 },
    { duration: 28, pauses: 1, unlocks: 1, scrolls: 0 },
    { duration: 30, pauses: 0, unlocks: 0, scrolls: 0 },
  ];

  perfectMediumPatterns.forEach((pattern) => {
    const actualDuration = pattern.duration * 60 * 1000;
    const now = Date.now();
    const startTs = now - actualDuration;

    const pauseEvents: PauseEvent[] = [];
    for (let p = 0; p < pattern.pauses; p++) {
      pauseEvents.push(
        createPauseEvent(
          (pattern.duration / 2 + p * 5) * 60 * 1000,
          60 * 1000,
          startTs,
        ),
      );
    }

    const unlockEvents: AppStateEvent[] = [];
    for (let u = 0; u < pattern.unlocks; u += 2) {
      unlockEvents.push(
        createAppStateEvent(
          pattern.duration * 0.7 * 60 * 1000,
          startTs,
          'background',
        ),
      );
      unlockEvents.push(
        createAppStateEvent(
          pattern.duration * 0.7 * 60 * 1000 + 10 * 1000,
          startTs,
          'active',
        ),
      );
    }

    const session = createMockTimerSession({
      sessionId: perfectMediumSession.sessionId,
      targetDurationMs: 25 * 60 * 1000,
      actualDurationMs: actualDuration,
      pauseEvents,
      screenUnlockEvents: unlockEvents,
      scrollEvents: [],
    });
    perfectMediumSession.timerSessionsByTimeRange[timeRange].push(session);
  });

  console.log('각 세션의 엔트로피 스코어:');
  perfectMediumSession.timerSessionsByTimeRange[timeRange].forEach(
    (session, i) => {
      console.log(
        `  세션 ${i + 1}: ${session.entropyScore?.toFixed(2) ?? 'null'} (성공: ${session.isSuccess}, 길이: ${((session.endTs! - session.startTs!) / 60000).toFixed(1)}분)`,
      );
    },
  );

  const perfectMediumSuggestion = generateSuggestion(perfectMediumSession);
  if (perfectMediumSuggestion) {
    console.log(`점수: ${perfectMediumSuggestion.score.toFixed(1)}/100`);
    console.log(`레이블: ${perfectMediumSuggestion.label}`);
    console.log(`추세: ${perfectMediumSuggestion.trend}`);
    console.log(
      `메시지: ${toUserMessage(perfectMediumSuggestion, '목요일', () => {})}`,
    );
  }

  console.log('시나리오 5: 개선되고 있는 패턴 (상승세)');
  const improvingSession = new Session({
    sessionName: '개선되고 있는 집중 세션',
  });
  improvingSession.timerSessionsByTimeRange[timeRange] = [];

  const improvingData = [
    { duration: 12, pauses: 3, unlocks: 6, scrolls: 5 },
    { duration: 15, pauses: 2, unlocks: 4, scrolls: 3 },
    { duration: 20, pauses: 1, unlocks: 2, scrolls: 2 },
    { duration: 24, pauses: 1, unlocks: 1, scrolls: 1 },
    { duration: 26, pauses: 0, unlocks: 0, scrolls: 0 },
  ];

  improvingData.forEach((pattern) => {
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
        createAppStateEvent((2 + u * 3) * 60 * 1000, startTs, 'background'),
      );
      unlockEvents.push(
        createAppStateEvent(
          (2 + u * 3) * 60 * 1000 + 15 * 1000,
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
      sessionId: improvingSession.sessionId,
      targetDurationMs: 25 * 60 * 1000,
      actualDurationMs: actualDuration,
      pauseEvents,
      screenUnlockEvents: unlockEvents,
      scrollEvents,
    });
    improvingSession.timerSessionsByTimeRange[timeRange].push(session);
  });

  console.log('각 세션의 엔트로피 스코어:');
  improvingSession.timerSessionsByTimeRange[timeRange].forEach((session, i) => {
    console.log(
      `  세션 ${i + 1}: ${session.entropyScore?.toFixed(2) ?? 'null'} (성공: ${session.isSuccess}, 길이: ${((session.endTs! - session.startTs!) / 60000).toFixed(1)}분)`,
    );
  });

  const improvingSuggestion = generateSuggestion(improvingSession);
  if (improvingSuggestion) {
    console.log(`점수: ${improvingSuggestion.score.toFixed(1)}/100`);
    console.log(`레이블: ${improvingSuggestion.label}`);
    console.log(`추세: ${improvingSuggestion.trend}`);
    console.log(
      `메시지: ${toUserMessage(improvingSuggestion, '금요일', () => {})}`,
    );
  }

  console.log('시나리오 6: 데이터 부족 케이스');
  const insufficientSession = new Session({ sessionName: '데이터 부족 세션' });
  insufficientSession.timerSessionsByTimeRange[timeRange] = [];

  for (let i = 0; i < 2; i++) {
    const session = createMockTimerSession({
      sessionId: insufficientSession.sessionId,
      targetDurationMs: 25 * 60 * 1000,
      actualDurationMs: 25 * 60 * 1000,
      pauseEvents: [],
      screenUnlockEvents: [],
      scrollEvents: [],
    });
    insufficientSession.timerSessionsByTimeRange[timeRange].push(session);
  }

  const insufficientSuggestion = generateSuggestion(insufficientSession);
  if (insufficientSuggestion) {
    console.log(
      '예상치 못한 결과: 세션이 3개 미만인데도 제안이 생성되었습니다.',
    );
    console.log(insufficientSuggestion);
  } else {
    console.log('예상대로 null 반환됨 (세션 수 부족)');
  }

  console.log('시나리오 7: 장시간 집중 패턴 (60~90분)');
  const longSession = new Session({ sessionName: '장시간 집중 세션' });
  longSession.timerSessionsByTimeRange[timeRange] = [];

  const longSessionPatterns = [
    { duration: 65, pauses: 2, unlocks: 3, scrolls: 2 },
    { duration: 70, pauses: 1, unlocks: 2, scrolls: 1 },
    { duration: 75, pauses: 3, unlocks: 4, scrolls: 3 },
    { duration: 80, pauses: 1, unlocks: 1, scrolls: 1 },
    { duration: 90, pauses: 0, unlocks: 0, scrolls: 0 },
  ];

  longSessionPatterns.forEach((pattern) => {
    const actualDuration = pattern.duration * 60 * 1000;
    const now = Date.now();
    const startTs = now - actualDuration;

    const pauseEvents: PauseEvent[] = [];
    for (let p = 0; p < pattern.pauses; p++) {
      pauseEvents.push(
        createPauseEvent(
          (10 + p * 20) * 60 * 1000,
          (2 + p) * 60 * 1000,
          startTs,
        ),
      );
    }

    const unlockEvents: AppStateEvent[] = [];
    for (let u = 0; u < pattern.unlocks; u += 2) {
      unlockEvents.push(
        createAppStateEvent((15 + u * 15) * 60 * 1000, startTs, 'background'),
      );
      unlockEvents.push(
        createAppStateEvent(
          (15 + u * 15) * 60 * 1000 + 30 * 1000,
          startTs,
          'active',
        ),
      );
    }

    const scrollEvents: ScrollInteractionEvent[] = [];
    for (let s = 0; s < pattern.scrolls; s++) {
      scrollEvents.push(createScrollEvent((20 + s * 10) * 60 * 1000, startTs));
    }

    const session = createMockTimerSession({
      sessionId: longSession.sessionId,
      targetDurationMs: 60 * 60 * 1000,
      actualDurationMs: actualDuration,
      pauseEvents,
      screenUnlockEvents: unlockEvents,
      scrollEvents,
    });
    longSession.timerSessionsByTimeRange[timeRange].push(session);
  });

  console.log('각 세션의 엔트로피 스코어:');
  longSession.timerSessionsByTimeRange[timeRange].forEach((session, i) => {
    console.log(
      `  세션 ${i + 1}: ${session.entropyScore?.toFixed(2) ?? 'null'} (성공: ${session.isSuccess}, 길이: ${((session.endTs! - session.startTs!) / 60000).toFixed(1)}분)`,
    );
  });

  const longSuggestion = generateSuggestion(longSession);
  if (longSuggestion) {
    console.log(`점수: ${longSuggestion.score.toFixed(1)}/100`);
    console.log(`레이블: ${longSuggestion.label}`);
    console.log(`추세: ${longSuggestion.trend}`);
    console.log(`메시지: ${toUserMessage(longSuggestion, '토요일', () => {})}`);
  }

  console.log('시나리오 8: 장시간이지만 방해가 많은 패턴');
  const disturbedLongSession = new Session({
    sessionName: '방해가 많은 장시간 세션',
  });
  disturbedLongSession.timerSessionsByTimeRange[timeRange] = [];

  const disturbedLongPatterns = [
    { duration: 45, pauses: 8, unlocks: 12, scrolls: 15 },
    { duration: 55, pauses: 6, unlocks: 10, scrolls: 12 },
    { duration: 62, pauses: 5, unlocks: 8, scrolls: 10 },
    { duration: 70, pauses: 4, unlocks: 6, scrolls: 8 },
  ];

  disturbedLongPatterns.forEach((pattern) => {
    const actualDuration = pattern.duration * 60 * 1000;
    const now = Date.now();
    const startTs = now - actualDuration;

    const pauseEvents: PauseEvent[] = [];
    for (let p = 0; p < pattern.pauses; p++) {
      pauseEvents.push(
        createPauseEvent(
          (5 + p * 5) * 60 * 1000,
          (1 + p * 0.5) * 60 * 1000,
          startTs,
        ),
      );
    }

    const unlockEvents: AppStateEvent[] = [];
    for (let u = 0; u < pattern.unlocks; u += 2) {
      unlockEvents.push(
        createAppStateEvent((3 + u * 3) * 60 * 1000, startTs, 'background'),
      );
      unlockEvents.push(
        createAppStateEvent(
          (3 + u * 3) * 60 * 1000 + 25 * 1000,
          startTs,
          'active',
        ),
      );
    }

    const scrollEvents: ScrollInteractionEvent[] = [];
    for (let s = 0; s < pattern.scrolls; s++) {
      scrollEvents.push(createScrollEvent((2 + s * 3) * 60 * 1000, startTs));
    }

    const session = createMockTimerSession({
      sessionId: disturbedLongSession.sessionId,
      targetDurationMs: 60 * 60 * 1000,
      actualDurationMs: actualDuration,
      pauseEvents,
      screenUnlockEvents: unlockEvents,
      scrollEvents,
    });
    disturbedLongSession.timerSessionsByTimeRange[timeRange].push(session);
  });

  console.log('각 세션의 엔트로피 스코어:');
  disturbedLongSession.timerSessionsByTimeRange[timeRange].forEach(
    (session, i) => {
      console.log(
        `  세션 ${i + 1}: ${session.entropyScore?.toFixed(2) ?? 'null'} (성공: ${session.isSuccess}, 길이: ${((session.endTs! - session.startTs!) / 60000).toFixed(1)}분)`,
      );
    },
  );

  const disturbedLongSuggestion = generateSuggestion(disturbedLongSession);
  if (disturbedLongSuggestion) {
    console.log(`점수: ${disturbedLongSuggestion.score.toFixed(1)}/100`);
    console.log(`레이블: ${disturbedLongSuggestion.label}`);
    console.log(`추세: ${disturbedLongSuggestion.trend}`);
    console.log(
      `메시지: ${toUserMessage(disturbedLongSuggestion, '일요일', () => {})}`,
    );
  }

  console.log('시나리오 9: 높은 점수 + 하락세 (최근 컨디션 악화)');
  const highScoreDeclineSession = new Session({
    sessionName: '최근 컨디션 악화 세션',
  });
  highScoreDeclineSession.timerSessionsByTimeRange[timeRange] = [];

  const declinePatterns = [
    { duration: 45, pauses: 0, unlocks: 0, scrolls: 0 },
    { duration: 50, pauses: 0, unlocks: 1, scrolls: 0 },
    { duration: 42, pauses: 1, unlocks: 1, scrolls: 1 },
    { duration: 38, pauses: 1, unlocks: 2, scrolls: 2 },
    { duration: 35, pauses: 2, unlocks: 3, scrolls: 3 },
    { duration: 30, pauses: 2, unlocks: 4, scrolls: 4 },
    { duration: 28, pauses: 3, unlocks: 5, scrolls: 5 },
    { duration: 25, pauses: 3, unlocks: 6, scrolls: 6 },
    { duration: 20, pauses: 4, unlocks: 7, scrolls: 7 },
    { duration: 15, pauses: 5, unlocks: 8, scrolls: 8 },
  ];

  declinePatterns.forEach((pattern) => {
    const actualDuration = pattern.duration * 60 * 1000;
    const now = Date.now();
    const startTs = now - actualDuration;

    const pauseEvents: PauseEvent[] = [];
    for (let p = 0; p < pattern.pauses; p++) {
      pauseEvents.push(
        createPauseEvent((5 + p * 3) * 60 * 1000, 60 * 1000, startTs),
      );
    }

    const unlockEvents: AppStateEvent[] = [];
    for (let u = 0; u < pattern.unlocks; u += 2) {
      unlockEvents.push(
        createAppStateEvent((3 + u * 2) * 60 * 1000, startTs, 'background'),
      );
      unlockEvents.push(
        createAppStateEvent(
          (3 + u * 2) * 60 * 1000 + 15 * 1000,
          startTs,
          'active',
        ),
      );
    }

    const scrollEvents: ScrollInteractionEvent[] = [];
    for (let s = 0; s < pattern.scrolls; s++) {
      scrollEvents.push(createScrollEvent((2 + s * 2) * 60 * 1000, startTs));
    }

    const session = createMockTimerSession({
      sessionId: highScoreDeclineSession.sessionId,
      targetDurationMs: 25 * 60 * 1000,
      actualDurationMs: actualDuration,
      pauseEvents,
      screenUnlockEvents: unlockEvents,
      scrollEvents,
    });
    highScoreDeclineSession.timerSessionsByTimeRange[timeRange].push(session);
  });

  console.log('각 세션의 엔트로피 스코어:');
  highScoreDeclineSession.timerSessionsByTimeRange[timeRange].forEach(
    (session, i) => {
      console.log(
        `  세션 ${i + 1}: ${session.entropyScore?.toFixed(2) ?? 'null'} (성공: ${session.isSuccess}, 길이: ${((session.endTs! - session.startTs!) / 60000).toFixed(1)}분)`,
      );
    },
  );

  const highScoreDeclineSuggestion = generateSuggestion(
    highScoreDeclineSession,
  );
  if (highScoreDeclineSuggestion) {
    console.log(`점수: ${highScoreDeclineSuggestion.score.toFixed(1)}/100`);
    console.log(`레이블: ${highScoreDeclineSuggestion.label}`);
    console.log(`추세: ${highScoreDeclineSuggestion.trend}`);
    console.log(
      `메시지: ${toUserMessage(highScoreDeclineSuggestion, '월요일', () => {})}`,
    );
  }

  console.log('시나리오 10: 낮은 점수 + 상승세 (회복 중)');
  const lowScoreRisingSession = new Session({ sessionName: '회복 중인 세션' });
  lowScoreRisingSession.timerSessionsByTimeRange[timeRange] = [];

  const recoveryPatterns = [
    { duration: 8, pauses: 2, unlocks: 10, scrolls: 12 },
    { duration: 10, pauses: 2, unlocks: 8, scrolls: 10 },
    { duration: 12, pauses: 2, unlocks: 7, scrolls: 8 },
    { duration: 15, pauses: 2, unlocks: 6, scrolls: 6 },
    { duration: 18, pauses: 1, unlocks: 5, scrolls: 5 },
    { duration: 20, pauses: 1, unlocks: 4, scrolls: 4 },
    { duration: 22, pauses: 1, unlocks: 3, scrolls: 3 },
    { duration: 25, pauses: 0, unlocks: 2, scrolls: 2 },
  ];

  recoveryPatterns.forEach((pattern) => {
    const actualDuration = pattern.duration * 60 * 1000;
    const now = Date.now();
    const startTs = now - actualDuration;

    const pauseEvents: PauseEvent[] = [];
    for (let p = 0; p < pattern.pauses; p++) {
      pauseEvents.push(
        createPauseEvent((2 + p * 2) * 60 * 1000, 60 * 1000, startTs),
      );
    }

    const unlockEvents: AppStateEvent[] = [];
    for (let u = 0; u < pattern.unlocks; u += 2) {
      unlockEvents.push(
        createAppStateEvent((1 + u * 1.5) * 60 * 1000, startTs, 'background'),
      );
      unlockEvents.push(
        createAppStateEvent(
          (1 + u * 1.5) * 60 * 1000 + 20 * 1000,
          startTs,
          'active',
        ),
      );
    }

    const scrollEvents: ScrollInteractionEvent[] = [];
    for (let s = 0; s < pattern.scrolls; s++) {
      scrollEvents.push(createScrollEvent((1 + s * 1) * 60 * 1000, startTs));
    }

    const session = createMockTimerSession({
      sessionId: lowScoreRisingSession.sessionId,
      targetDurationMs: 25 * 60 * 1000,
      actualDurationMs: actualDuration,
      pauseEvents,
      screenUnlockEvents: unlockEvents,
      scrollEvents,
    });
    lowScoreRisingSession.timerSessionsByTimeRange[timeRange].push(session);
  });

  console.log('각 세션의 엔트로피 스코어:');
  lowScoreRisingSession.timerSessionsByTimeRange[timeRange].forEach(
    (session, i) => {
      console.log(
        `  세션 ${i + 1}: ${session.entropyScore?.toFixed(2) ?? 'null'} (성공: ${session.isSuccess}, 길이: ${((session.endTs! - session.startTs!) / 60000).toFixed(1)}분)`,
      );
    },
  );

  const lowScoreRisingSuggestion = generateSuggestion(lowScoreRisingSession);
  if (lowScoreRisingSuggestion) {
    console.log(`점수: ${lowScoreRisingSuggestion.score.toFixed(1)}/100`);
    console.log(`레이블: ${lowScoreRisingSuggestion.label}`);
    console.log(`추세: ${lowScoreRisingSuggestion.trend}`);
    console.log(
      `메시지: ${toUserMessage(lowScoreRisingSuggestion, '화요일', () => {})}`,
    );
  }

  console.log('시나리오 11: 중간 점수 + 유지 (일관된 평범한 패턴)');
  const mediumStableSession = new Session({ sessionName: '일관된 중간 세션' });
  mediumStableSession.timerSessionsByTimeRange[timeRange] = [];

  const stablePatterns = [
    { duration: 22, pauses: 1, unlocks: 3, scrolls: 3 },
    { duration: 20, pauses: 2, unlocks: 3, scrolls: 4 },
    { duration: 24, pauses: 1, unlocks: 4, scrolls: 3 },
    { duration: 21, pauses: 2, unlocks: 3, scrolls: 3 },
    { duration: 23, pauses: 1, unlocks: 3, scrolls: 4 },
    { duration: 19, pauses: 2, unlocks: 4, scrolls: 3 },
    { duration: 22, pauses: 1, unlocks: 3, scrolls: 3 },
    { duration: 20, pauses: 2, unlocks: 3, scrolls: 4 },
    { duration: 24, pauses: 1, unlocks: 4, scrolls: 3 },
    { duration: 21, pauses: 2, unlocks: 3, scrolls: 3 },
  ];

  stablePatterns.forEach((pattern) => {
    const actualDuration = pattern.duration * 60 * 1000;
    const now = Date.now();
    const startTs = now - actualDuration;

    const pauseEvents: PauseEvent[] = [];
    for (let p = 0; p < pattern.pauses; p++) {
      pauseEvents.push(
        createPauseEvent((5 + p * 4) * 60 * 1000, 60 * 1000, startTs),
      );
    }

    const unlockEvents: AppStateEvent[] = [];
    for (let u = 0; u < pattern.unlocks; u += 2) {
      unlockEvents.push(
        createAppStateEvent((3 + u * 3) * 60 * 1000, startTs, 'background'),
      );
      unlockEvents.push(
        createAppStateEvent(
          (3 + u * 3) * 60 * 1000 + 25 * 1000,
          startTs,
          'active',
        ),
      );
    }

    const scrollEvents: ScrollInteractionEvent[] = [];
    for (let s = 0; s < pattern.scrolls; s++) {
      scrollEvents.push(createScrollEvent((2 + s * 2.5) * 60 * 1000, startTs));
    }

    const session = createMockTimerSession({
      sessionId: mediumStableSession.sessionId,
      targetDurationMs: 25 * 60 * 1000,
      actualDurationMs: actualDuration,
      pauseEvents,
      screenUnlockEvents: unlockEvents,
      scrollEvents,
    });
    mediumStableSession.timerSessionsByTimeRange[timeRange].push(session);
  });

  console.log('각 세션의 엔트로피 스코어:');
  mediumStableSession.timerSessionsByTimeRange[timeRange].forEach(
    (session, i) => {
      console.log(
        `  세션 ${i + 1}: ${session.entropyScore?.toFixed(2) ?? 'null'} (성공: ${session.isSuccess}, 길이: ${((session.endTs! - session.startTs!) / 60000).toFixed(1)}분)`,
      );
    },
  );

  const mediumStableSuggestion = generateSuggestion(mediumStableSession);
  if (mediumStableSuggestion) {
    console.log(`점수: ${mediumStableSuggestion.score.toFixed(1)}/100`);
    console.log(`레이블: ${mediumStableSuggestion.label}`);
    console.log(`추세: ${mediumStableSuggestion.trend}`);
    console.log(
      `메시지: ${toUserMessage(mediumStableSuggestion, '수요일', () => {})}`,
    );
  }

  console.log('시나리오 12: 극단적 변동성 (지그재그 패턴)');
  const volatileSession = new Session({ sessionName: '변동성 심한 세션' });
  volatileSession.timerSessionsByTimeRange[timeRange] = [];

  const zigzagPatterns = [
    { duration: 45, pauses: 0, unlocks: 0, scrolls: 0 },
    { duration: 12, pauses: 2, unlocks: 8, scrolls: 10 },
    { duration: 40, pauses: 1, unlocks: 1, scrolls: 1 },
    { duration: 10, pauses: 2, unlocks: 9, scrolls: 12 },
    { duration: 38, pauses: 0, unlocks: 2, scrolls: 1 },
    { duration: 14, pauses: 2, unlocks: 6, scrolls: 8 },
    { duration: 42, pauses: 1, unlocks: 1, scrolls: 0 },
    { duration: 16, pauses: 2, unlocks: 7, scrolls: 9 },
  ];

  zigzagPatterns.forEach((pattern) => {
    const actualDuration = pattern.duration * 60 * 1000;
    const now = Date.now();
    const startTs = now - actualDuration;

    const pauseEvents: PauseEvent[] = [];
    for (let p = 0; p < pattern.pauses; p++) {
      pauseEvents.push(
        createPauseEvent((2 + p * 2) * 60 * 1000, 60 * 1000, startTs),
      );
    }

    const unlockEvents: AppStateEvent[] = [];
    for (let u = 0; u < pattern.unlocks; u += 2) {
      unlockEvents.push(
        createAppStateEvent((1 + u * 1.5) * 60 * 1000, startTs, 'background'),
      );
      unlockEvents.push(
        createAppStateEvent(
          (1 + u * 1.5) * 60 * 1000 + 20 * 1000,
          startTs,
          'active',
        ),
      );
    }

    const scrollEvents: ScrollInteractionEvent[] = [];
    for (let s = 0; s < pattern.scrolls; s++) {
      scrollEvents.push(createScrollEvent((1 + s * 1) * 60 * 1000, startTs));
    }

    const session = createMockTimerSession({
      sessionId: volatileSession.sessionId,
      targetDurationMs: 25 * 60 * 1000,
      actualDurationMs: actualDuration,
      pauseEvents,
      screenUnlockEvents: unlockEvents,
      scrollEvents,
    });
    volatileSession.timerSessionsByTimeRange[timeRange].push(session);
  });

  console.log('각 세션의 엔트로피 스코어:');
  volatileSession.timerSessionsByTimeRange[timeRange].forEach((session, i) => {
    console.log(
      `  세션 ${i + 1}: ${session.entropyScore?.toFixed(2) ?? 'null'} (성공: ${session.isSuccess}, 길이: ${((session.endTs! - session.startTs!) / 60000).toFixed(1)}분)`,
    );
  });

  const volatileSuggestion = generateSuggestion(volatileSession);
  if (volatileSuggestion) {
    console.log(`점수: ${volatileSuggestion.score.toFixed(1)}/100`);
    console.log(`레이블: ${volatileSuggestion.label}`);
    console.log(`추세: ${volatileSuggestion.trend}`);
    console.log(
      `메시지: ${toUserMessage(volatileSuggestion, '목요일', () => {})}`,
    );
  }
}

// 시뮬레이션 실행
runSimulation();
