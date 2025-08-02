export type DisturbanceCountEvent = {
  startTs: number;
};

export type PauseEvent = {
  startTs: number;
  endTs: number;
  durationMs: number;
};
