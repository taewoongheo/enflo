import { DisturbanceCountEvent, PauseEvent } from '@/types/interruptEvent';
import uuid from 'react-native-uuid';

class TimerSession {
  timerSessionId: string;
  session: string;
  startTs: number; // Date.now()
  endTs: number | null; // Date.now()
  targetDurationMs: number | null; // ms
  shakeEvents: DisturbanceCountEvent[]; // Date.now()
  screenUnlockCount: DisturbanceCountEvent[]; // Date.now()
  scrollInteractionCount: DisturbanceCountEvent[]; // Date.now()
  pauseEvents: PauseEvent[]; // Date.now(), duration = ms
  entropyScore: number | null; // 5 ~ 20

  static SUCCESS_MARGIN_MS = 600000; // 10 minutes

  constructor(params: { session: string }) {
    this.timerSessionId = uuid.v4();
    this.session = params.session;
    this.startTs = new Date().getTime();
    this.endTs = null;
    this.targetDurationMs = null;
    this.shakeEvents = [];
    this.screenUnlockCount = [];
    this.scrollInteractionCount = [];
    this.pauseEvents = [];
    this.entropyScore = null;
  }

  calculateEntropyScore(): number {
    // logic...
    return 0;
  }

  get isSuccess(): boolean {
    if (this.targetDurationMs === null) {
      return false;
    }

    return (
      this.netFocusMs >= this.targetDurationMs - TimerSession.SUCCESS_MARGIN_MS
    );
  }

  get netFocusMs(): number {
    if (this.endTs === null) {
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

  get overshootMs(): number {
    if (this.targetDurationMs === null) {
      return 0;
    }

    return this.netFocusMs - this.targetDurationMs;
  }

  get sessionSequenceInDay(): number {
    // logic...
    return 0;
  }
}

export default TimerSession;
