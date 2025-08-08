import { calculateEntropyScore } from '../components/TimerPage/utils/calculateEntropyScore';
import TimerSession from '../models/TimerSession';
import {
  AppStateEvent,
  PauseEvent,
  ScrollInteractionEvent,
} from '../types/interruptEvent';

const scenarios = [
  {
    name: '5min target, complete, no disturbance events',
    session: new TimerSession({
      sessionId: Date.now().toString(),
      targetDurationMs: 5 * 60 * 1000,
    }),
    disturbance: {
      screenUnlockEvents: [] as AppStateEvent[],
      scrollEvents: [] as ScrollInteractionEvent[],
      pauseEvents: [] as PauseEvent[],
      totalDisturbanceMs: 0,
      startTs: Date.now() - 5 * 60 * 1000,
      endTs: Date.now(),
    },
  },
  {
    name: '10min target, complete, no disturbance events',
    session: new TimerSession({
      sessionId: Date.now().toString(),
      targetDurationMs: 10 * 60 * 1000,
    }),
    disturbance: {
      screenUnlockEvents: [] as AppStateEvent[],
      scrollEvents: [] as ScrollInteractionEvent[],
      pauseEvents: [] as PauseEvent[],
      totalDisturbanceMs: 0,
      startTs: Date.now() - 10 * 60 * 1000,
      endTs: Date.now(),
    },
  },
  {
    name: '10min target, incomplete, no disturbance events (ended at 5min)',
    session: new TimerSession({
      sessionId: Date.now().toString(),
      targetDurationMs: 10 * 60 * 1000,
    }),
    disturbance: {
      screenUnlockEvents: [] as AppStateEvent[],
      scrollEvents: [] as ScrollInteractionEvent[],
      pauseEvents: [] as PauseEvent[],
      totalDisturbanceMs: 0,
      startTs: Date.now() - 10 * 60 * 1000,
      endTs: Date.now() - 5 * 60 * 1000,
    },
  },
  {
    name: '15min target, complete, disturbance events (2 events, 2min)',
    session: new TimerSession({
      sessionId: Date.now().toString(),
      targetDurationMs: 15 * 60 * 1000,
    }),
    disturbance: {
      screenUnlockEvents: [
        { timestamp: Date.now() - 8 * 60 * 1000, appState: 'background' },
      ] as AppStateEvent[],
      scrollEvents: [
        { timestamp: Date.now() - 6 * 60 * 1000 },
      ] as ScrollInteractionEvent[],
      pauseEvents: [
        {
          startTs: Date.now() - 10 * 60 * 1000,
          endTs: Date.now() - 8 * 60 * 1000,
          durationMs: 2 * 60 * 1000,
        },
      ] as PauseEvent[],
      totalDisturbanceMs: 2 * 60 * 1000,
      startTs: Date.now() - 15 * 60 * 1000,
      endTs: Date.now(),
    },
  },
  {
    name: '15min target, incomplete, disturbance events (5 events, 8min)',
    session: new TimerSession({
      sessionId: Date.now().toString(),
      targetDurationMs: 15 * 60 * 1000,
    }),
    disturbance: {
      screenUnlockEvents: [
        { timestamp: Date.now() - 12 * 60 * 1000, appState: 'background' },
        { timestamp: Date.now() - 8 * 60 * 1000, appState: 'background' },
        { timestamp: Date.now() - 4 * 60 * 1000, appState: 'background' },
      ] as AppStateEvent[],
      scrollEvents: [
        { timestamp: Date.now() - 10 * 60 * 1000 },
        { timestamp: Date.now() - 6 * 60 * 1000 },
      ] as ScrollInteractionEvent[],
      pauseEvents: [
        {
          startTs: Date.now() - 14 * 60 * 1000,
          endTs: Date.now() - 6 * 60 * 1000,
          durationMs: 8 * 60 * 1000,
        },
      ] as PauseEvent[],
      totalDisturbanceMs: 8 * 60 * 1000,
      startTs: Date.now() - 15 * 60 * 1000,
      endTs: Date.now() - 8 * 60 * 1000,
    },
  },
  {
    name: '20min target, complete, disturbance events (1 event, 30sec)',
    session: new TimerSession({
      sessionId: Date.now().toString(),
      targetDurationMs: 20 * 60 * 1000,
    }),
    disturbance: {
      screenUnlockEvents: [] as AppStateEvent[],
      scrollEvents: [
        { timestamp: Date.now() - 10 * 60 * 1000 },
      ] as ScrollInteractionEvent[],
      pauseEvents: [
        {
          startTs: Date.now() - 12 * 60 * 1000,
          endTs: Date.now() - 11.5 * 60 * 1000,
          durationMs: 30 * 1000,
        },
      ] as PauseEvent[],
      totalDisturbanceMs: 30 * 1000,
      startTs: Date.now() - 20 * 60 * 1000,
      endTs: Date.now(),
    },
  },
  {
    name: '20min target, incomplete, disturbance events (8 events, 15min)',
    session: new TimerSession({
      sessionId: Date.now().toString(),
      targetDurationMs: 20 * 60 * 1000,
    }),
    disturbance: {
      screenUnlockEvents: [
        { timestamp: Date.now() - 18 * 60 * 1000, appState: 'background' },
        { timestamp: Date.now() - 15 * 60 * 1000, appState: 'background' },
        { timestamp: Date.now() - 12 * 60 * 1000, appState: 'background' },
        { timestamp: Date.now() - 9 * 60 * 1000, appState: 'background' },
      ] as AppStateEvent[],
      scrollEvents: [
        { timestamp: Date.now() - 16 * 60 * 1000 },
        { timestamp: Date.now() - 13 * 60 * 1000 },
        { timestamp: Date.now() - 10 * 60 * 1000 },
        { timestamp: Date.now() - 7 * 60 * 1000 },
      ] as ScrollInteractionEvent[],
      pauseEvents: [
        {
          startTs: Date.now() - 19 * 60 * 1000,
          endTs: Date.now() - 4 * 60 * 1000,
          durationMs: 15 * 60 * 1000,
        },
      ] as PauseEvent[],
      totalDisturbanceMs: 15 * 60 * 1000,
      startTs: Date.now() - 20 * 60 * 1000,
      endTs: Date.now() - 8 * 60 * 1000,
    },
  },
  {
    name: '25min target, complete, disturbance events (3 events, 1min)',
    session: new TimerSession({
      sessionId: Date.now().toString(),
      targetDurationMs: 25 * 60 * 1000,
    }),
    disturbance: {
      screenUnlockEvents: [
        { timestamp: Date.now() - 10 * 60 * 1000, appState: 'background' },
      ] as AppStateEvent[],
      scrollEvents: [
        { timestamp: Date.now() - 8 * 60 * 1000 },
      ] as ScrollInteractionEvent[],
      pauseEvents: [
        {
          startTs: Date.now() - 15 * 60 * 1000,
          endTs: Date.now() - 14 * 60 * 1000,
          durationMs: 60 * 1000,
        },
      ] as PauseEvent[],
      totalDisturbanceMs: 60 * 1000,
      startTs: Date.now() - 25 * 60 * 1000,
      endTs: Date.now(),
    },
  },
  {
    name: '25min target, incomplete, disturbance events (3 events, 1min)',
    session: new TimerSession({
      sessionId: Date.now().toString(),
      targetDurationMs: 25 * 60 * 1000,
    }),
    disturbance: {
      screenUnlockEvents: [
        { timestamp: Date.now() - 10 * 60 * 1000, appState: 'background' },
      ] as AppStateEvent[],
      scrollEvents: [
        { timestamp: Date.now() - 8 * 60 * 1000 },
      ] as ScrollInteractionEvent[],
      pauseEvents: [
        {
          startTs: Date.now() - 15 * 60 * 1000,
          endTs: Date.now() - 14 * 60 * 1000,
          durationMs: 60 * 1000,
        },
      ] as PauseEvent[],
      totalDisturbanceMs: 60 * 1000,
      startTs: Date.now() - 25 * 60 * 1000,
      endTs: Date.now() - 10 * 60 * 1000,
    },
  },
  {
    name: '30min target, complete, no disturbance events',
    session: new TimerSession({
      sessionId: Date.now().toString(),
      targetDurationMs: 30 * 60 * 1000,
    }),
    disturbance: {
      screenUnlockEvents: [] as AppStateEvent[],
      scrollEvents: [] as ScrollInteractionEvent[],
      pauseEvents: [] as PauseEvent[],
      totalDisturbanceMs: 0,
      startTs: Date.now() - 30 * 60 * 1000,
      endTs: Date.now(),
    },
  },
  {
    name: '30min target, complete, disturbance events (3 events, 10min)',
    session: new TimerSession({
      sessionId: Date.now().toString(),
      targetDurationMs: 30 * 60 * 1000,
    }),
    disturbance: {
      screenUnlockEvents: [
        { timestamp: Date.now() - 10 * 60 * 1000, appState: 'background' },
      ] as AppStateEvent[],
      scrollEvents: [
        { timestamp: Date.now() - 8 * 60 * 1000 },
      ] as ScrollInteractionEvent[],
      pauseEvents: [
        {
          startTs: Date.now() - 15 * 60 * 1000,
          endTs: Date.now() - 5 * 60 * 1000,
          durationMs: 10 * 60 * 1000,
        },
      ] as PauseEvent[],
      totalDisturbanceMs: 10 * 60 * 1000,
      startTs: Date.now() - 30 * 60 * 1000,
      endTs: Date.now(),
    },
  },
  {
    name: '35min target, complete, disturbance events (4 events, 5min)',
    session: new TimerSession({
      sessionId: Date.now().toString(),
      targetDurationMs: 35 * 60 * 1000,
    }),
    disturbance: {
      screenUnlockEvents: [
        { timestamp: Date.now() - 25 * 60 * 1000, appState: 'background' },
        { timestamp: Date.now() - 15 * 60 * 1000, appState: 'background' },
      ] as AppStateEvent[],
      scrollEvents: [
        { timestamp: Date.now() - 20 * 60 * 1000 },
        { timestamp: Date.now() - 10 * 60 * 1000 },
      ] as ScrollInteractionEvent[],
      pauseEvents: [
        {
          startTs: Date.now() - 30 * 60 * 1000,
          endTs: Date.now() - 25 * 60 * 1000,
          durationMs: 5 * 60 * 1000,
        },
      ] as PauseEvent[],
      totalDisturbanceMs: 5 * 60 * 1000,
      startTs: Date.now() - 35 * 60 * 1000,
      endTs: Date.now(),
    },
  },
  {
    name: '35min target, incomplete, disturbance events (6 events, 20min)',
    session: new TimerSession({
      sessionId: Date.now().toString(),
      targetDurationMs: 35 * 60 * 1000,
    }),
    disturbance: {
      screenUnlockEvents: [
        { timestamp: Date.now() - 32 * 60 * 1000, appState: 'background' },
        { timestamp: Date.now() - 25 * 60 * 1000, appState: 'background' },
        { timestamp: Date.now() - 18 * 60 * 1000, appState: 'background' },
      ] as AppStateEvent[],
      scrollEvents: [
        { timestamp: Date.now() - 28 * 60 * 1000 },
        { timestamp: Date.now() - 21 * 60 * 1000 },
        { timestamp: Date.now() - 14 * 60 * 1000 },
      ] as ScrollInteractionEvent[],
      pauseEvents: [
        {
          startTs: Date.now() - 34 * 60 * 1000,
          endTs: Date.now() - 14 * 60 * 1000,
          durationMs: 20 * 60 * 1000,
        },
      ] as PauseEvent[],
      totalDisturbanceMs: 20 * 60 * 1000,
      startTs: Date.now() - 35 * 60 * 1000,
      endTs: Date.now() - 12 * 60 * 1000,
    },
  },
  {
    name: '45min target, complete, disturbance events (3 events, 3min)',
    session: new TimerSession({
      sessionId: Date.now().toString(),
      targetDurationMs: 45 * 60 * 1000,
    }),
    disturbance: {
      screenUnlockEvents: [
        { timestamp: Date.now() - 30 * 60 * 1000, appState: 'background' },
      ] as AppStateEvent[],
      scrollEvents: [
        { timestamp: Date.now() - 20 * 60 * 1000 },
      ] as ScrollInteractionEvent[],
      pauseEvents: [
        {
          startTs: Date.now() - 40 * 60 * 1000,
          endTs: Date.now() - 37 * 60 * 1000,
          durationMs: 3 * 60 * 1000,
        },
      ] as PauseEvent[],
      totalDisturbanceMs: 3 * 60 * 1000,
      startTs: Date.now() - 45 * 60 * 1000,
      endTs: Date.now(),
    },
  },
  {
    name: '45min target, complete, disturbance events (10 events, 0min)',
    session: new TimerSession({
      sessionId: Date.now().toString(),
      targetDurationMs: 45 * 60 * 1000,
    }),
    disturbance: {
      screenUnlockEvents: [
        { timestamp: Date.now() - 42 * 60 * 1000, appState: 'background' },
        { timestamp: Date.now() - 35 * 60 * 1000, appState: 'background' },
        { timestamp: Date.now() - 28 * 60 * 1000, appState: 'background' },
        { timestamp: Date.now() - 21 * 60 * 1000, appState: 'background' },
        { timestamp: Date.now() - 14 * 60 * 1000, appState: 'background' },
      ] as AppStateEvent[],
      scrollEvents: [
        { timestamp: Date.now() - 38 * 60 * 1000 },
        { timestamp: Date.now() - 31 * 60 * 1000 },
        { timestamp: Date.now() - 24 * 60 * 1000 },
        { timestamp: Date.now() - 17 * 60 * 1000 },
        { timestamp: Date.now() - 10 * 60 * 1000 },
      ] as ScrollInteractionEvent[],
      pauseEvents: [] as PauseEvent[],
      totalDisturbanceMs: 0,
      startTs: Date.now() - 45 * 60 * 1000,
      endTs: Date.now(),
    },
  },
  {
    name: '45min target, incomplete, disturbance events (10 events, 25min)',
    session: new TimerSession({
      sessionId: Date.now().toString(),
      targetDurationMs: 45 * 60 * 1000,
    }),
    disturbance: {
      screenUnlockEvents: [
        { timestamp: Date.now() - 42 * 60 * 1000, appState: 'background' },
        { timestamp: Date.now() - 35 * 60 * 1000, appState: 'background' },
        { timestamp: Date.now() - 28 * 60 * 1000, appState: 'background' },
        { timestamp: Date.now() - 21 * 60 * 1000, appState: 'background' },
        { timestamp: Date.now() - 14 * 60 * 1000, appState: 'background' },
      ] as AppStateEvent[],
      scrollEvents: [
        { timestamp: Date.now() - 38 * 60 * 1000 },
        { timestamp: Date.now() - 31 * 60 * 1000 },
        { timestamp: Date.now() - 24 * 60 * 1000 },
        { timestamp: Date.now() - 17 * 60 * 1000 },
        { timestamp: Date.now() - 10 * 60 * 1000 },
      ] as ScrollInteractionEvent[],
      pauseEvents: [
        {
          startTs: Date.now() - 44 * 60 * 1000,
          endTs: Date.now() - 19 * 60 * 1000,
          durationMs: 25 * 60 * 1000,
        },
      ] as PauseEvent[],
      totalDisturbanceMs: 25 * 60 * 1000,
      startTs: Date.now() - 45 * 60 * 1000,
      endTs: Date.now() - 15 * 60 * 1000,
    },
  },
  {
    name: '50min target, complete, disturbance events (3 events, 10min)',
    session: new TimerSession({
      sessionId: Date.now().toString(),
      targetDurationMs: 50 * 60 * 1000,
    }),
    disturbance: {
      screenUnlockEvents: [
        { timestamp: Date.now() - 10 * 60 * 1000, appState: 'background' },
        { timestamp: Date.now() - 20 * 60 * 1000, appState: 'background' },
      ] as AppStateEvent[],
      scrollEvents: [
        { timestamp: Date.now() - 8 * 60 * 1000 },
      ] as ScrollInteractionEvent[],
      pauseEvents: [
        {
          startTs: Date.now() - 15 * 60 * 1000,
          endTs: Date.now() - 5 * 60 * 1000,
          durationMs: 10 * 60 * 1000,
        },
      ] as PauseEvent[],
      totalDisturbanceMs: 10 * 60 * 1000,
      startTs: Date.now() - 50 * 60 * 1000,
      endTs: Date.now(),
    },
  },
  {
    name: '60min target, complete, disturbance events (2 events, 1min)',
    session: new TimerSession({
      sessionId: Date.now().toString(),
      targetDurationMs: 60 * 60 * 1000,
    }),
    disturbance: {
      screenUnlockEvents: [
        { timestamp: Date.now() - 40 * 60 * 1000, appState: 'background' },
      ] as AppStateEvent[],
      scrollEvents: [
        { timestamp: Date.now() - 20 * 60 * 1000 },
      ] as ScrollInteractionEvent[],
      pauseEvents: [
        {
          startTs: Date.now() - 50 * 60 * 1000,
          endTs: Date.now() - 49 * 60 * 1000,
          durationMs: 1 * 60 * 1000,
        },
      ] as PauseEvent[],
      totalDisturbanceMs: 1 * 60 * 1000,
      startTs: Date.now() - 60 * 60 * 1000,
      endTs: Date.now(),
    },
  },
  {
    name: '60min target, incomplete, disturbance events (12 events, 35min)',
    session: new TimerSession({
      sessionId: Date.now().toString(),
      targetDurationMs: 60 * 60 * 1000,
    }),
    disturbance: {
      screenUnlockEvents: [
        { timestamp: Date.now() - 55 * 60 * 1000, appState: 'background' },
        { timestamp: Date.now() - 45 * 60 * 1000, appState: 'background' },
        { timestamp: Date.now() - 35 * 60 * 1000, appState: 'background' },
        { timestamp: Date.now() - 25 * 60 * 1000, appState: 'background' },
        { timestamp: Date.now() - 15 * 60 * 1000, appState: 'background' },
        { timestamp: Date.now() - 5 * 60 * 1000, appState: 'background' },
      ] as AppStateEvent[],
      scrollEvents: [
        { timestamp: Date.now() - 50 * 60 * 1000 },
        { timestamp: Date.now() - 40 * 60 * 1000 },
        { timestamp: Date.now() - 30 * 60 * 1000 },
        { timestamp: Date.now() - 20 * 60 * 1000 },
        { timestamp: Date.now() - 10 * 60 * 1000 },
        { timestamp: Date.now() - 2 * 60 * 1000 },
      ] as ScrollInteractionEvent[],
      pauseEvents: [
        {
          startTs: Date.now() - 58 * 60 * 1000,
          endTs: Date.now() - 23 * 60 * 1000,
          durationMs: 35 * 60 * 1000,
        },
      ] as PauseEvent[],
      totalDisturbanceMs: 35 * 60 * 1000,
      startTs: Date.now() - 60 * 60 * 1000,
      endTs: Date.now() - 18 * 60 * 1000,
    },
  },
  {
    name: '90min target, complete, no disturbance events',
    session: new TimerSession({
      sessionId: Date.now().toString(),
      targetDurationMs: 90 * 60 * 1000,
    }),
    disturbance: {
      screenUnlockEvents: [] as AppStateEvent[],
      scrollEvents: [] as ScrollInteractionEvent[],
      pauseEvents: [] as PauseEvent[],
      totalDisturbanceMs: 0,
      startTs: Date.now() - 90 * 60 * 1000,
      endTs: Date.now(),
    },
  },
  {
    name: '90min target, complete, disturbance events (3 events, 10min)',
    session: new TimerSession({
      sessionId: Date.now().toString(),
      targetDurationMs: 90 * 60 * 1000,
    }),
    disturbance: {
      screenUnlockEvents: [
        { timestamp: Date.now() - 10 * 60 * 1000, appState: 'background' },
        { timestamp: Date.now() - 20 * 60 * 1000, appState: 'background' },
      ] as AppStateEvent[],
      scrollEvents: [
        { timestamp: Date.now() - 8 * 60 * 1000 },
      ] as ScrollInteractionEvent[],
      pauseEvents: [
        {
          startTs: Date.now() - 15 * 60 * 1000,
          endTs: Date.now() - 5 * 60 * 1000,
          durationMs: 10 * 60 * 1000,
        },
      ] as PauseEvent[],
      totalDisturbanceMs: 10 * 60 * 1000,
      startTs: Date.now() - 90 * 60 * 1000,
      endTs: Date.now(),
    },
  },
];

console.log('=== Entropy Score Simulation ===\n');

scenarios.forEach((scenario, idx) => {
  scenario.session.screenUnlockCount = scenario.disturbance.screenUnlockEvents;
  scenario.session.scrollInteractionCount = scenario.disturbance.scrollEvents;
  scenario.session.pauseEvents = scenario.disturbance.pauseEvents;
  scenario.session.startTs = scenario.disturbance.startTs;
  scenario.session.endTs = scenario.disturbance.endTs;

  const score = calculateEntropyScore(scenario.session);

  console.log(`${idx + 1}. ${scenario.name}`);
  console.log(
    `   - Target duration: ${scenario.session.targetDurationMs / 60000}min`,
  );
  console.log(
    `   - Disturbance events: ${scenario.session.screenUnlockCount.length + scenario.session.scrollInteractionCount.length} events`,
  );
  console.log(
    `   - Entropy Score: ${score === null ? 'null (less than 5min)' : score.toFixed(2)}`,
  );
  console.log('');
});

console.log('=== Simulation Complete ===');
