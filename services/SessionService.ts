import { db } from '@/db/db';
import {
  appStateEvents,
  pauseEvents,
  scrollInteractionEvents,
  sessions,
  timerSessions,
} from '@/db/schema';
import Session from '@/models/Session';
import TimerSession from '@/models/TimerSession';
import { useSessionCache } from '@/store/sessionCache';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/expo-sqlite';

class SessionService {
  private db: ReturnType<typeof drizzle>;

  constructor(db: ReturnType<typeof drizzle>) {
    this.db = db;
  }

  async clear() {
    useSessionCache.getState().clear();
    await this.db.delete(sessions);
  }

  async getSessions(): Promise<Session[]> {
    const sessionRows = await this.db.select().from(sessions);

    const newSessions = sessionRows.map(
      (session) =>
        new Session({
          sessionId: session.sessionId,
          sessionName: session.sessionName,
        }),
    );

    useSessionCache.getState().setSessions(newSessions);

    return Object.values(useSessionCache.getState().getSessions());
  }

  async getSessionById({ sessionId }: { sessionId: string }): Promise<Session> {
    const cache = useSessionCache.getState().getSessions();
    const cached = cache[sessionId];

    if (cached) return cached;

    const rows = await this.db
      .select()
      .from(sessions)
      .where(eq(sessions.sessionId, sessionId))
      .limit(1);

    if (rows.length === 0) {
      throw new Error('Session not found');
    }

    const row = rows[0];
    const session = new Session({
      sessionId: sessionId,
      sessionName: row.sessionName,
    });

    useSessionCache.getState().upsertSession(session);

    return session;
  }

  // Session 에 속한 TimerSession 조회

  // 현재 Session 의 '오늘' TimerSession 조회

  async createSession({
    sessionName,
  }: {
    sessionName: string;
  }): Promise<Session> {
    const session = new Session({
      sessionName,
    });

    await this.db.insert(sessions).values({
      sessionId: session.sessionId,
      sessionName: session.sessionName,
    });

    return useSessionCache.getState().createSession(session);
  }

  // Session 삭제

  // Session 업데이트(startTs, endTs, targetDurationMs, entropyScore)

  async addTimerSession(
    sessionId: string,
    timerSession: TimerSession,
  ): Promise<TimerSession> {
    useSessionCache.getState().addTimerSession(sessionId, timerSession);

    await this.db.insert(timerSessions).values({
      timerSessionId: timerSession.timerSessionId,
      sessionId: sessionId,
      startTs: timerSession.startTs,
      endTs: timerSession.endTs,
      targetDurationMs: timerSession.targetDurationMs,
      entropyScore: timerSession.entropyScore,
    });

    for (const pauseEvent of timerSession.pauseEvents) {
      await this.db.insert(pauseEvents).values({
        timerSessionId: timerSession.timerSessionId,
        startTs: pauseEvent.startTs,
        endTs: pauseEvent.endTs,
        durationMs: pauseEvent.durationMs,
      });
    }

    for (const appStateEvent of timerSession.screenUnlockCount) {
      await this.db.insert(appStateEvents).values({
        timerSessionId: timerSession.timerSessionId,
        timestamp: appStateEvent.timestamp,
        appState: appStateEvent.appState,
      });
    }

    for (const scrollEvent of timerSession.scrollInteractionCount) {
      await this.db.insert(scrollInteractionEvents).values({
        timerSessionId: timerSession.timerSessionId,
        timestamp: scrollEvent.timestamp,
      });
    }

    return timerSession;
  }
}

export const sessionService = new SessionService(db);
