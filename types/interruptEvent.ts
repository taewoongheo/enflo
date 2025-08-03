export type DisturbanceCountEvent = {
  timestamp: number;
};

export type PauseEvent = {
  startTs: number;
  endTs: number;
  durationMs: number;
};
