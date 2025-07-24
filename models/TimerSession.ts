import {
  BackgroundEvent,
  PauseEvent,
  ShakeEvent,
} from '@/types/interruptEvent';
import uuid from 'react-native-uuid';

// unit: ms
class TimerSession {
  timerSessionId: string;
  session: string;
  startTs: number;
  endTs: number | null;
  targetDurationMs: number | null;
  shakeEvents: ShakeEvent[];
  backgroundEvents: BackgroundEvent[];
  pauseEvents: PauseEvent[];
  sessionIndexInDay: number; // The sequence number of this session in the day
  entropyScore: number | null;

  static SUCCESS_MARGIN_MS = 600000; // 10 minutes

  constructor(params: { session: string }) {
    this.timerSessionId = uuid.v4();
    this.session = params.session;
    this.startTs = new Date().getTime();
    this.endTs = null;
    this.targetDurationMs = null;
    this.shakeEvents = [];
    this.backgroundEvents = [];
    this.pauseEvents = [];
    this.sessionIndexInDay = 0;
    this.entropyScore = null;
  }

  get netFocusMs(): number {
    if (this.endTs === null) {
      return 0;
    }

    const totalInterrupt = this.totalInterruptMs;
    return Math.max(0, this.endTs - this.startTs - totalInterrupt);
  }

  get totalInterruptMs(): number {
    const backgroundInterruptMs = this.backgroundEvents.reduce(
      (sum, e) => sum + e.durationMs,
      0,
    );
    const pauseInterruptMs = this.pauseEvents.reduce(
      (sum, e) => sum + e.durationMs,
      0,
    );
    return backgroundInterruptMs + pauseInterruptMs;
  }

  get backgroundCount(): number {
    return this.backgroundEvents.length;
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

  get isSuccess(): boolean {
    if (this.targetDurationMs === null) {
      return false;
    }

    return (
      this.netFocusMs >= this.targetDurationMs - TimerSession.SUCCESS_MARGIN_MS
    );
  }
}

export default TimerSession;
