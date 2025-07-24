export type ShakeEvent = {
  startTs: number;
};

export type BackgroundEvent = {
  startTs: number;
  endTs: number;
  durationMs: number;
};

export type PauseEvent = {
  startTs: number;
  endTs: number;
  durationMs: number;
};
