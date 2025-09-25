export type ScrollInteractionEvent = {
  timestamp: number;
};

export type AppStateEvent = {
  timestamp: number;
  appState: 'background';
};

export type PauseEvent = {
  startTs: number;
  endTs: number;
  durationMs: number;
};
