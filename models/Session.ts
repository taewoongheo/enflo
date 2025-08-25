import uuid from 'react-native-uuid';
import TimerSession from './TimerSession';

export const TIME_RANGES = ['00-06', '06-12', '12-18', '18-24'] as const;

export type TimeRange = (typeof TIME_RANGES)[number];

export function getTimeRange(startTs: number): TimeRange {
  const date = new Date(startTs);
  const hour = date.getHours();
  const index = Math.floor(hour / 6);
  return TIME_RANGES[index];
}

class Session {
  sessionId: string;
  sessionName: string;
  timerSessionsByTimeRange: Record<TimeRange, TimerSession[]>;

  constructor(params: {
    sessionId?: string;
    sessionName: string;
    timerSessionsByTimeRange?: Record<TimeRange, TimerSession[]>;
  }) {
    this.sessionId = params.sessionId ?? uuid.v4();
    this.sessionName = params.sessionName;
    this.timerSessionsByTimeRange =
      params.timerSessionsByTimeRange ??
      (Object.fromEntries(
        TIME_RANGES.map((k) => [k, []]) as [TimeRange, TimerSession[]][],
      ) as Record<TimeRange, TimerSession[]>);
  }

  addTimerSession(timerSession: TimerSession, timeRange: TimeRange) {
    this.timerSessionsByTimeRange[timeRange] = [
      ...(this.timerSessionsByTimeRange[timeRange] ?? []),
      timerSession,
    ];
  }

  get totalNetFocusMs(): number {
    const totalNetFocusMs = Object.values(this.timerSessionsByTimeRange)
      .flat()
      .reduce((sum, timerSession) => {
        return sum + timerSession.netFocusMs;
      }, 0);
    return totalNetFocusMs;
  }
}

export default Session;
