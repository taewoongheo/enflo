import Session, { TimeRange } from '@/models/Session';
import TimerSession from '@/models/TimerSession';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

// TODO:
// 앱 초기화 시, db 로부터 캐시 초기화하는 코드 추가
//  SessionList 에서 mock data 설정도, 하이드레이션 코드로 옮길 수 있을 듯

type SessionCache = {
  sessionCache: Record<string, Session>;
  clear: () => void;
  setSessions: (sessions: Session[]) => void;
  createSession: (session: Session) => Session;
  upsertSession: (session: Session) => Session;
  updateSession: (session: Session) => Session;
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
