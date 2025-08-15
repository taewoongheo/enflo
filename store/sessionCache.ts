import Session from '@/models/Session';
import TimerSession from '@/models/TimerSession';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

type SessionCache = {
  sessionCache: Record<string, Session>;
  clear: () => void;
  setSessions: (sessions: Session[]) => void;
  getSessions: () => Record<string, Session>;
  createSession: (session: Session) => Session;
  upsertSession: (session: Session) => Session;
  updateSession: (session: Session) => Session;
  deleteSession: (sessionId: string) => void;
  addTimerSession: (sessionId: string, timerSession: TimerSession) => void;
};

export const useSessionCache = create(
  immer<SessionCache>((set, get) => ({
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
      }),

    getSessions: () => {
      return { ...get().sessionCache };
    },

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

    deleteSession: (sessionId) => {
      set((draft) => {
        delete draft.sessionCache[sessionId];
      });
    },

    addTimerSession: (sessionId, timerSession) => {
      set((draft) => {
        const session = draft.sessionCache[sessionId];
        if (session) {
          session.addTimerSession(timerSession);
        }
      });
    },
  })),
);
