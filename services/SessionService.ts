import { sessions } from '@/db/schema';
import Session from '@/models/Session';
import { useSessionCache } from '@/store/sessionCache';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/expo-sqlite';

export default class SessionService {
  private db: ReturnType<typeof drizzle>;

  constructor(db: ReturnType<typeof drizzle>) {
    this.db = db;
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

    return Array.from(useSessionCache.getState().getSessions().values());
  }

  async getSessionById(sessionId: string): Promise<Session> {
    const cache = useSessionCache.getState().getSessions();
    const cached = cache.get(sessionId);

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

  async createSession(sessionName: string): Promise<Session> {
    const session = new Session({ sessionName });

    await this.db.insert(sessions).values({
      sessionId: session.sessionId,
      sessionName: session.sessionName,
    });

    return useSessionCache.getState().createSession(session);
  }

  // Session 삭제

  // Session 업데이트(startTs, endTs, targetDurationMs, entropyScore)

  // Session 에 TimerSession 추가
}
