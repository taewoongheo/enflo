import { sessions } from '@/db/schema';
import Session from '@/models/Session';
import { drizzle } from 'drizzle-orm/expo-sqlite';

export default class SessionService {
  private db: ReturnType<typeof drizzle>;
  private sessionCache = new Map<string, Session>();

  constructor(db: ReturnType<typeof drizzle>) {
    this.db = db;
  }

  async getSessions(): Promise<Session[]> {
    const sessionRows = await this.db.select().from(sessions);

    this.sessionCache.clear();

    sessionRows.forEach((session) =>
      this.sessionCache.set(
        session.sessionId,
        new Session({
          sessionId: session.sessionId,
          sessionName: session.sessionName,
        }),
      ),
    );
    return Array.from(this.sessionCache.values());
  }

  // 단일 Session 조회

  // Session 에 속한 TimerSession 조회

  // 현재 Session 의 '오늘' TimerSession 조회

  async createSession(sessionName: string): Promise<Session> {
    const session = new Session({ sessionName });

    await this.db.insert(sessions).values({
      sessionId: session.sessionId,
      sessionName: session.sessionName,
    });

    this.sessionCache.set(session.sessionId, session);

    return session;
  }

  // Session 삭제

  // Session 업데이트(startTs, endTs, targetDurationMs, entropyScore)

  // Session 에 TimerSession 추가
}
