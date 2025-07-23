export type ShakeEvent = {
  startsTs: number;
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
