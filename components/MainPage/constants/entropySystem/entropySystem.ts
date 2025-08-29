import { particleCanvasWidth } from './dimension';

export const ENTROPY_SYSTEM_GLOBAL_CONSTANTS = {
  // entropy score
  MIN_ENTROPY_SCORE: 0,
  MAX_ENTROPY_SCORE: 100,
  DELTA_PER_MINUTE: 0.08,
  INITIAL_ENTROPY_SCORE: 80,
  ENTROPY_SCORE_UPDATE_INTERVAL_MS: 60 * 1000,

  ENTROPY_SCORE: {
    VERY_LOW_MAX: 20,
    LOW_MAX: 40,
    MEDIUM_MAX: 60,
    HIGH_MAX: 80,
    VERY_HIGH_MAX: 100,
  },
} as const;

// TODO: 1분마다 렌더링 매번 되는거 방지
// TOOD: 테스트
// TODO: 아이콘 크기 fontScale 로 보정

export const ENTROPY_SYSTEM_CONSTANTS = {
  MAX_ATTEMPTS: 30,
  VERY_LOW: {
    PARTICLE: {
      INFLUENCE_DISTANCE: particleCanvasWidth * 0.25,
      FRICTION: 0.98,
      PUSH_FORCE: 2,
      SPEED_SCALE: 0.2,
      PARTICLE_MIN_DISTANCE: particleCanvasWidth * 0.025,
    },
    MIN_DISTANCE: particleCanvasWidth * 0.1,
    MAX_THRESHOLD: particleCanvasWidth,
    MIN_THRESHOLD: 0,
    MIN_RADIUS: particleCanvasWidth * 0.005,
    MAX_RADIUS: particleCanvasWidth * 0.00625,
  },
  LOW: {
    PARTICLE: {
      INFLUENCE_DISTANCE: particleCanvasWidth * 0.25,
      FRICTION: 0.98,
      PUSH_FORCE: 2,
      SPEED_SCALE: 0.2,
      PARTICLE_MIN_DISTANCE: particleCanvasWidth * 0.025,
    },
    MIN_DISTANCE: particleCanvasWidth * 0.1,
    MAX_THRESHOLD: particleCanvasWidth * 0.4,
    MIN_THRESHOLD: particleCanvasWidth * 0.075,
    MIN_RADIUS: particleCanvasWidth * 0.005,
    MAX_RADIUS: particleCanvasWidth * 0.00625,
  },
  MEDIUM: {
    PARTICLE: {
      INFLUENCE_DISTANCE: particleCanvasWidth * 0.25,
      RESTORE_FORCE: 0.01,
      FRICTION: 0.99,
      PUSH_FORCE: 20,
      SPEED_SCALE: 0.2,
      PARTICLE_MIN_DISTANCE: particleCanvasWidth * 0.025,
    },
    MIN_DISTANCE: particleCanvasWidth * 0.075,
    MAX_THRESHOLD: particleCanvasWidth * 0.325,
    MIN_THRESHOLD: particleCanvasWidth * 0.05,
    MIN_RADIUS: particleCanvasWidth * 0.005,
    MAX_RADIUS: particleCanvasWidth * 0.00625,
  },
  HIGH: {
    PARTICLE: {
      INFLUENCE_DISTANCE: particleCanvasWidth * 0.25,
      RESTORE_FORCE: 0.01,
      FRICTION: 0.97,
      PUSH_FORCE: 20,
      SPEED_SCALE: 0.2,
      PARTICLE_MIN_DISTANCE: particleCanvasWidth * 0.025,
    },
    MIN_DISTANCE: particleCanvasWidth * 0.075,
    MAX_THRESHOLD: particleCanvasWidth * 0.25,
    MIN_THRESHOLD: particleCanvasWidth * 0.05,
    MIN_RADIUS: particleCanvasWidth * 0.005,
    MAX_RADIUS: particleCanvasWidth * 0.00625,
  },
  VERY_HIGH: {
    PARTICLE: {
      INFLUENCE_DISTANCE: particleCanvasWidth * 0.25,
      RESTORE_FORCE: 0.05,
      FRICTION: 0.89,
      PUSH_FORCE: 20,
      SPEED_SCALE: 0.2,
      PARTICLE_MIN_DISTANCE: particleCanvasWidth * 0.025,
    },
    MIN_DISTANCE: particleCanvasWidth * 0.075,
    MAX_THRESHOLD: particleCanvasWidth * 0.25,
    MIN_THRESHOLD: particleCanvasWidth * 0.05,
    MIN_RADIUS: particleCanvasWidth * 0.005,
    MAX_RADIUS: particleCanvasWidth * 0.00625,
  },
};

export const RENDER_CONSTANTS = {
  // particle color range
  MAX_COLOR_VALUE: 255,
  MIN_COLOR_VALUE: 140,
} as const;
