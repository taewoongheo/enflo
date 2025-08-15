import { db } from '@/db/db';
import {
  appStateEvents,
  pauseEvents,
  scrollInteractionEvents,
  timerSessions,
} from '@/db/schema';
import TimerSession from '@/models/TimerSession';
import {
  AppStateEvent,
  PauseEvent,
  ScrollInteractionEvent,
} from '@/types/InterruptEvent';
import { drizzle } from 'drizzle-orm/expo-sqlite';

class TimerService {
  private db: ReturnType<typeof drizzle>;

  constructor(db: ReturnType<typeof drizzle>) {
    this.db = db;
  }

  async clear() {
    await this.db.delete(timerSessions);
    await this.db.delete(pauseEvents);
    await this.db.delete(scrollInteractionEvents);
    await this.db.delete(appStateEvents);
  }

  async createTimerSession({
    sessionId,
    targetDurationMs,
  }: {
    sessionId: string;
    targetDurationMs: number;
  }): Promise<TimerSession> {
    const timerSession = new TimerSession({
      sessionId,
      targetDurationMs,
      // TODO: sessionSequenceInDay
    });

    return timerSession;
  }

  async updateStartTs({
    timerSession,
    startTs,
  }: {
    timerSession: TimerSession;
    startTs: number;
  }) {
    timerSession.startTs = startTs;
    return timerSession;
  }

  async calculateEntropy({
    timerSession,
    endTs,
    screenBackgroundCount,
    scrollInteractionCount,
    pauseEvents,
  }: {
    timerSession: TimerSession;
    endTs: number;
    screenBackgroundCount: AppStateEvent[];
    scrollInteractionCount: ScrollInteractionEvent[];
    pauseEvents: PauseEvent[];
  }) {
    return timerSession.calculateEntropy({
      endTs,
      screenBackgroundCount,
      scrollInteractionCount,
      pauseEvents,
    });
  }
}

export const timerService = new TimerService(db);
