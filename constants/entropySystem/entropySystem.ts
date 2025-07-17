export const ENTROPY_SYSTEM_CONSTANTS = {
  // poisson disk sampling
  MIN_DISTANCE: 19,
  MAX_ATTEMPTS: 30,

  // particle creation range
  MAX_THRESHOLD: 100,
  MIN_THRESHOLD: 20,

  // particle radius range
  MIN_RADIUS: 0.8,
  MAX_RADIUS: 1.3,

  // edge particle setting
  EDGE_ANGLE_STEP: 3,
  EDGE_RANDOM_OFFSET: 6,
} as const;

export const RENDER_CONSTANTS = {
  // particle color range
  MAX_COLOR_VALUE: 170,
  MIN_COLOR_VALUE: 0,
} as const;
