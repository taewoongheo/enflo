import Session from '@/models/Session';
import { enableMapSet } from 'immer';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

enableMapSet();

type SessionCache = {
  sessionCache: Map<string, Session>;
  setSessions: (sessions: Session[]) => void;
  getSessions: () => Session[];
  createSession: (session: Session) => Session;
  updateSession: (session: Session) => Session;
  deleteSession: (sessionId: string) => void;
};

export const useSessionCache = create(
  immer<SessionCache>((set, get) => ({
    sessionCache: new Map(),

    setSessions: (sessions) =>
      set((draft) => {
        draft.sessionCache = new Map(
          sessions.map((session) => [session.sessionId, session]),
        );
      }),

    getSessions: () => {
      const { sessionCache } = get();
      return Array.from(sessionCache.values());
    },

    createSession: (session) => {
      set((draft) => {
        draft.sessionCache.set(session.sessionId, session);
      });

      return session;
    },

    updateSession: (session) => {
      set((draft) => {
        draft.sessionCache.set(session.sessionId, session);
      });

      return session;
    },

    deleteSession: (sessionId) => {
      set((draft) => {
        draft.sessionCache.delete(sessionId);
      });
    },
  })),
);
