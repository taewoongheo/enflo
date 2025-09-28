import { db } from '@/db/db';
import {
  appStateEvents,
  entropyLog,
  pauseEvents,
  scrollInteractionEvents,
  sessions,
  timerSessions,
} from '@/db/schema';
import Session, { getTimeRange } from '@/models/Session';
import TimerSession from '@/models/TimerSession';
import { useEntropyStore } from '@/store/entropyStore';
import { useSessionCache } from '@/store/sessionCache';
import { log } from '@/utils/log';
import {
  timestampToDayKey,
  timestampToMonthKey,
  timestampToWeekKey,
  timestampToYearKey,
} from '@/utils/time';
import { and, eq, gte, lte } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/expo-sqlite';

class SessionService {
  private db: ReturnType<typeof drizzle>;

  constructor(db: ReturnType<typeof drizzle>) {
    this.db = db;
  }

  async hydrateSessions(): Promise<void> {
    const rows = await this.db.select().from(sessions);
    log(`하이드레이션 시작: ${rows.length} 개 세션`);

    const allSessions = await Promise.all(
      rows.map(async (sessionRow) => {
        const timerSessionRows = await this.db
          .select()
          .from(timerSessions)
          .where(eq(timerSessions.sessionId, sessionRow.sessionId));

        const session = new Session({
          sessionId: sessionRow.sessionId,
          sessionName: sessionRow.sessionName,
        });
        log(`현재 세션 이름: ${sessionRow.sessionName}`);
        log(`현재 세션 타이머 개수: ${timerSessionRows.length} 개`);

        for (const timerRow of timerSessionRows) {
          const timerSession = new TimerSession({
            sessionId: sessionRow.sessionId,
            startTs: timerRow.startTs,
            targetDurationMs: timerRow.targetDurationMs,
          });

          timerSession.timerSessionId = timerRow.timerSessionId;
          timerSession.endTs = timerRow.endTs;
          timerSession.entropyScore = timerRow.entropyScore;

          const pauseEventRows = await this.db
            .select()
            .from(pauseEvents)
            .where(eq(pauseEvents.timerSessionId, timerRow.timerSessionId));

          timerSession.pauseEvents = pauseEventRows.map((row) => ({
            startTs: row.startTs,
            endTs: row.endTs,
            durationMs: row.durationMs,
          }));

          const appStateEventRows = await this.db
            .select()
            .from(appStateEvents)
            .where(eq(appStateEvents.timerSessionId, timerRow.timerSessionId));

          timerSession.screenUnlockCount = appStateEventRows.map((row) => ({
            timestamp: row.timestamp,
            appState: row.appState as 'background',
          }));

          const scrollEventRows = await this.db
            .select()
            .from(scrollInteractionEvents)
            .where(
              eq(
                scrollInteractionEvents.timerSessionId,
                timerRow.timerSessionId,
              ),
            );

          timerSession.scrollInteractionCount = scrollEventRows.map((row) => ({
            timestamp: row.timestamp,
          }));

          if (timerSession.startTs) {
            const timeRange = getTimeRange(timerSession.startTs);
            session.addTimerSession(timerSession, timeRange);
          }
        }

        return session;
      }),
    );

    useSessionCache.getState().setSessions(allSessions);
    log(`하이드레이션 완료: ${allSessions.length} 개 세션`);
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
        if (!timerSession.entropyScore) {
          throw new Error('Entropy score is not set');
        }

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

        await this.db.insert(entropyLog).values({
          entropyScore: useEntropyStore.getState().entropyScore,
          timerEntropyScore: timerSession.entropyScore,
          timerSessionId: timerSession.timerSessionId,
          dayKey: timestampToDayKey(timerSession.endTs!),
          weekKey: timestampToWeekKey(timerSession.endTs!),
          monthKey: timestampToMonthKey(timerSession.endTs!),
          yearKey: timestampToYearKey(timerSession.endTs!),
        });
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

  async getTimerSessionsByDateRange(startTs: number, endTs: number) {
    return this.db
      .select()
      .from(timerSessions)
      .where(
        and(gte(timerSessions.endTs, startTs), lte(timerSessions.endTs, endTs)),
      );
  }

  async addSession({ sessionName }: { sessionName: string }) {
    const session = new Session({
      sessionName,
    });

    try {
      await this.db.insert(sessions).values({
        sessionId: session.sessionId,
        sessionName: session.sessionName,
      });

      useSessionCache.getState().createSession(session);
    } catch (error) {
      throw new Error('Failed to add session', { cause: error });
    }
  }

  async updateSessionName({
    sessionId,
    sessionName,
  }: {
    sessionId: string;
    sessionName: string;
  }) {
    try {
      await this.db
        .update(sessions)
        .set({ sessionName })
        .where(eq(sessions.sessionId, sessionId));

      useSessionCache.getState().updateSessionName(sessionId, sessionName);
    } catch (error) {
      throw new Error('Failed to update session name', { cause: error });
    }
  }

  async deleteSession({ sessionId }: { sessionId: string }) {
    try {
      await this.db.delete(sessions).where(eq(sessions.sessionId, sessionId));

      useSessionCache.getState().deleteSession(sessionId);
    } catch (error) {
      throw new Error('Failed to delete session', { cause: error });
    }
  }
}

export const sessionService = new SessionService(db);
