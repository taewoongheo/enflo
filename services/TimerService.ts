import { db } from '@/db/db';
import {
  appStateEvents,
  pauseEvents,
  scrollInteractionEvents,
  timerSessions,
} from '@/db/schema';
import TimerSession from '@/models/TimerSession';
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

  async createTimerSession(
    sessionId: string,
    targetDurationMs: number,
  ): Promise<TimerSession> {
    const timerSession = new TimerSession({
      sessionId,
      targetDurationMs,
      // TODO: sessionSequenceInDay
    });

    return timerSession;
  }
}

export const timerService = new TimerService(db);
