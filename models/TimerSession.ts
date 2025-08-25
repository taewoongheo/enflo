import { calculateEntropyScore } from '@/components/TimerPage/utils/calculateEntropyScore';
import {
  AppStateEvent,
  PauseEvent,
  ScrollInteractionEvent,
} from '@/types/InterruptEvent';
import uuid from 'react-native-uuid';

class TimerSession {
  sessionId: string;
  timerSessionId: string;
  startTs: number | null; // Date.now()
  endTs: number | null; // Date.now()
  targetDurationMs: number; // ms
  screenUnlockCount: AppStateEvent[]; // Date.now()
  scrollInteractionCount: ScrollInteractionEvent[]; // Date.now()
  pauseEvents: PauseEvent[]; // Date.now(), duration = ms
  entropyScore: number | null; // 5 ~ 20

  static SUCCESS_MARGIN_MS = 600000; // 10 minutes

  constructor(params: {
    sessionId: string;
    startTs: number;
    targetDurationMs: number;
  }) {
    this.sessionId = params.sessionId;
    this.timerSessionId = uuid.v4();
    this.startTs = params.startTs;
    this.endTs = null;
    this.targetDurationMs = params.targetDurationMs;
    this.screenUnlockCount = [];
    this.scrollInteractionCount = [];
    this.pauseEvents = [];
    this.entropyScore = null;
  }

  calculateEntropy({
    endTs,
    screenBackgroundCount,
    scrollInteractionCount,
    pauseEvents,
  }: {
    endTs: number;
    screenBackgroundCount: AppStateEvent[];
    scrollInteractionCount: ScrollInteractionEvent[];
    pauseEvents: PauseEvent[];
  }) {
    this.endTs = endTs;
    this.screenUnlockCount = screenBackgroundCount;
    this.scrollInteractionCount = scrollInteractionCount;
    this.pauseEvents = pauseEvents;
    this.entropyScore = calculateEntropyScore(this);

    return this.entropyScore;
  }

  get isSuccess(): boolean {
    return (
      this.netFocusMs >= this.targetDurationMs - TimerSession.SUCCESS_MARGIN_MS
    );
  }

  get netFocusMs(): number {
    if (this.endTs === null || this.startTs === null) {
      return 0;
    }

    const totalDisturbance = this.totalDisturbanceMs;
    return Math.max(0, this.endTs - this.startTs - totalDisturbance);
  }

  get totalDisturbanceMs(): number {
    const pauseDisturbanceMs = this.pauseEvents.reduce(
      (sum, e) => sum + e.durationMs,
      0,
    );
    return pauseDisturbanceMs;
  }

  get pauseCount(): number {
    return this.pauseEvents.length;
  }

  // get overshootMs(): number {
  //   if (this.targetDurationMs === null) {
  //     return 0;
  //   }

  //   return this.netFocusMs - this.targetDurationMs;
  // }

  get sessionSequenceInDay(): number {
    // logic...
    return 0;
  }
}

export default TimerSession;
