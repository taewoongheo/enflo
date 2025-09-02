export type EntropyLog = {
  id: number;
  entropyScore: number;
  createdAt: Date;
  timerSessionId: string | null;
  dayKey: number;
  weekKey: number;
  monthKey: number;
  yearKey: number;
};
