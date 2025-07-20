export const ENTROPY_SYSTEM_CONSTANTS = {
  // poisson disk sampling
  MIN_DISTANCE: 30,
  MAX_ATTEMPTS: 30,

  // particle creation range
  MAX_THRESHOLD: 100,
  MIN_THRESHOLD: 20,

  // particle radius range
  MIN_RADIUS: 2,
  MAX_RADIUS: 2.5,

  // edge particle setting
  EDGE_ANGLE_STEP: 3,
  EDGE_RANDOM_OFFSET: 6,
} as const;

export const RENDER_CONSTANTS = {
  // particle color range
  MAX_COLOR_VALUE: 255,
  MIN_COLOR_VALUE: 140,
} as const;
