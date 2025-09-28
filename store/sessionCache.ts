import Session, { TimeRange } from '@/models/Session';
import TimerSession from '@/models/TimerSession';
import { log } from '@/utils/log';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

type SessionCache = {
  sessionCache: Record<string, Session>;
  clear: () => void;
  setSessions: (sessions: Session[]) => void;
  createSession: (session: Session) => Session;
  upsertSession: (session: Session) => Session;
  updateSession: (session: Session) => Session;
  updateSessionName: (sessionId: string, sessionName: string) => string;
  deleteSession: (sessionId: string) => void;
  addTimerSession: (
    sessionId: string,
    timerSession: TimerSession,
    timeRange: TimeRange,
  ) => void;
};

export const useSessionCache = create(
  immer<SessionCache>((set) => ({
    sessionCache: {},

    clear: () => {
      set((draft) => {
        draft.sessionCache = {};
      });
    },

    setSessions: (sessions) =>
      set((draft) => {
        draft.sessionCache = {};
        sessions.forEach((session) => {
          draft.sessionCache[session.sessionId] = session;
        });
        log(`${sessions.length} 개 세션을 캐시에 저장`);
      }),

    createSession: (session) => {
      set((draft) => {
        draft.sessionCache[session.sessionId] = session;
      });

      return session;
    },

    upsertSession: (session) => {
      set((draft) => {
        draft.sessionCache[session.sessionId] = session;
      });

      return session;
    },

    updateSession: (session) => {
      set((draft) => {
        draft.sessionCache[session.sessionId] = session;
      });

      return session;
    },

    updateSessionName: (sessionId, sessionName) => {
      set((draft) => {
        const prevSession = draft.sessionCache[sessionId];
        if (prevSession) {
          draft.sessionCache[sessionId] = new Session({
            sessionId: prevSession.sessionId,
            sessionName: sessionName,
            timerSessionsByTimeRange: prevSession.timerSessionsByTimeRange,
          });
        }
      });

      return sessionId;
    },

    deleteSession: (sessionId) => {
      set((draft) => {
        delete draft.sessionCache[sessionId];
      });
    },

    addTimerSession: (sessionId, timerSession, timeRange) => {
      set((draft) => {
        const prev = draft.sessionCache[sessionId];

        if (prev) {
          const newTimerSessionsByTimeRange = {
            ...prev.timerSessionsByTimeRange,
            [timeRange]: [
              ...(prev.timerSessionsByTimeRange[timeRange] ?? []),
              timerSession,
            ],
          } as Record<TimeRange, TimerSession[]>;

          draft.sessionCache[sessionId] = new Session({
            sessionId: prev.sessionId,
            sessionName: prev.sessionName,
            timerSessionsByTimeRange: newTimerSessionsByTimeRange,
          });
        }
      });
    },
  })),
);
