export type ScrollInteractionEvent = {
  timestamp: number;
};

export type AppStateEvent = {
  timestamp: number;
  appState: 'active' | 'background';
};

export type PauseEvent = {
  startTs: number;
  endTs: number;
  durationMs: number;
};
