import { db } from '@/db/db';
import {
  appStateEvents,
  pauseEvents,
  scrollInteractionEvents,
  sessions,
  timerSessions,
} from '@/db/schema';
import Session, { getTimeRange } from '@/models/Session';
import TimerSession from '@/models/TimerSession';
import { useSessionCache } from '@/store/sessionCache';
import { drizzle } from 'drizzle-orm/expo-sqlite';

class SessionService {
  private db: ReturnType<typeof drizzle>;

  constructor(db: ReturnType<typeof drizzle>) {
    this.db = db;
  }

  async hydrateSessions(): Promise<void> {
    const rows = await this.db.select().from(sessions);
    const allSessions = rows.map(
      (el) =>
        new Session({
          sessionId: el.sessionId,
          sessionName: el.sessionName,
        }),
    );

    useSessionCache.getState().setSessions(allSessions);
  }

  async clear() {
    useSessionCache.getState().clear();
    await this.db.delete(sessions);
  }

  async createSession({
    sessionName,
  }: {
    sessionName: string;
  }): Promise<Session> {
    const session = new Session({
      sessionName,
    });

    try {
      await this.db.insert(sessions).values({
        sessionId: session.sessionId,
        sessionName: session.sessionName,
      });
    } catch (error) {
      throw new Error('Failed to create session', { cause: error });
    }

    return useSessionCache.getState().createSession(session);
  }

  async addTimerSession({
    sessionId,
    timerSession,
  }: {
    sessionId: string;
    timerSession: TimerSession;
  }): Promise<TimerSession> {
    try {
      await this.db.transaction(async (tx) => {
        await tx.insert(timerSessions).values({
          timerSessionId: timerSession.timerSessionId,
          sessionId: sessionId,
          startTs: timerSession.startTs,
          endTs: timerSession.endTs,
          targetDurationMs: timerSession.targetDurationMs,
          entropyScore: timerSession.entropyScore,
        });

        for (const pauseEvent of timerSession.pauseEvents) {
          await tx.insert(pauseEvents).values({
            timerSessionId: timerSession.timerSessionId,
            startTs: pauseEvent.startTs,
            endTs: pauseEvent.endTs,
            durationMs: pauseEvent.durationMs,
          });
        }

        for (const appStateEvent of timerSession.screenUnlockCount) {
          await tx.insert(appStateEvents).values({
            timerSessionId: timerSession.timerSessionId,
            timestamp: appStateEvent.timestamp,
            appState: appStateEvent.appState,
          });
        }

        for (const scrollEvent of timerSession.scrollInteractionCount) {
          await tx.insert(scrollInteractionEvents).values({
            timerSessionId: timerSession.timerSessionId,
            timestamp: scrollEvent.timestamp,
          });
        }
      });
    } catch (error) {
      throw new Error('Failed to add timer session', { cause: error });
    }

    const timeRange = getTimeRange(timerSession.startTs!);

    useSessionCache
      .getState()
      .addTimerSession(sessionId, timerSession, timeRange);

    return timerSession;
  }
}

export const sessionService = new SessionService(db);
