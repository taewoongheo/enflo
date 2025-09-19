import {
  generateEdgeParticles,
  poissonDiskSampling,
} from '@/lib/algorithms/particleDistribution';
import { Vector } from '@/lib/math/Vector';
import {
  particleCanvasHeight,
  particleCanvasWidth,
} from '../constants/entropySystem/dimension';
import { ENTROPY_SYSTEM_CONSTANTS } from '../constants/entropySystem/entropySystem';

export const calculateVeryLowParticles = (): Vector[] => {
  const { MIN_DISTANCE, MAX_THRESHOLD, MIN_THRESHOLD } =
    ENTROPY_SYSTEM_CONSTANTS.VERY_LOW;

  const sampledParticles = poissonDiskSampling({
    width: particleCanvasWidth,
    height: particleCanvasHeight,
    minDistance: MIN_DISTANCE,
    maxThreshold: MAX_THRESHOLD,
    minThreshold: MIN_THRESHOLD,
  });

  return sampledParticles.filter((p): p is Vector => p !== undefined);
};

export const calculateLowParticles = (): Vector[] => {
  const { MIN_DISTANCE, MAX_THRESHOLD, MIN_THRESHOLD } =
    ENTROPY_SYSTEM_CONSTANTS.LOW;

  const sampledParticles = poissonDiskSampling({
    width: particleCanvasWidth,
    height: particleCanvasHeight,
    minDistance: MIN_DISTANCE,
    maxThreshold: MAX_THRESHOLD,
    minThreshold: MIN_THRESHOLD,
  });

  return sampledParticles.filter((p): p is Vector => p !== undefined);
};

export const calculateMediumParticles = (): Vector[] => {
  const { MIN_DISTANCE, MAX_THRESHOLD, MIN_THRESHOLD } =
    ENTROPY_SYSTEM_CONSTANTS.MEDIUM;

  const sampledParticles = poissonDiskSampling({
    width: particleCanvasWidth,
    height: particleCanvasHeight,
    minDistance: MIN_DISTANCE,
    maxThreshold: MAX_THRESHOLD,
    minThreshold: MIN_THRESHOLD,
  });

  const particles = sampledParticles.filter(
    (p): p is Vector => p !== undefined,
  );
  const ringParticles: Vector[] = [];

  return [...particles, ...ringParticles];
};

export const calculateHighParticles = (): Vector[] => {
  const { MIN_DISTANCE, MAX_THRESHOLD, MIN_THRESHOLD } =
    ENTROPY_SYSTEM_CONSTANTS.HIGH;

  const RING_PARTICLE_CONSTANTS = [
    {
      threshold: MAX_THRESHOLD,
      stepAngle: MAX_THRESHOLD * 0.1,
      randomOffset: MAX_THRESHOLD * 0.03,
    },
    {
      threshold: MAX_THRESHOLD * 0.9,
      stepAngle: MAX_THRESHOLD * 0.12,
      randomOffset: MAX_THRESHOLD * 0.05,
    },
    {
      threshold: MAX_THRESHOLD * 0.76,
      stepAngle: MAX_THRESHOLD * 0.14,
      randomOffset: MAX_THRESHOLD * 0.07,
    },
    {
      threshold: MAX_THRESHOLD * 0.6,
      stepAngle: MAX_THRESHOLD * 0.16,
      randomOffset: MAX_THRESHOLD * 0.1,
    },
  ];

  const sampledParticles = poissonDiskSampling({
    width: particleCanvasWidth,
    height: particleCanvasHeight,
    minDistance: MIN_DISTANCE,
    maxThreshold: MAX_THRESHOLD,
    minThreshold: MIN_THRESHOLD,
  });

  const ringParticles = [];

  for (const ringParticleConstant of RING_PARTICLE_CONSTANTS) {
    const edgeParticles = generateEdgeParticles({
      centerX: particleCanvasWidth / 2,
      centerY: particleCanvasHeight / 2,
      threshold: ringParticleConstant.threshold,
      stepAngle: ringParticleConstant.stepAngle,
      randomOffset: ringParticleConstant.randomOffset,
    });

    ringParticles.push(...edgeParticles.map((p) => new Vector(p.x, p.y)));
  }

  return [
    ...sampledParticles.filter((p): p is Vector => p !== undefined),
    ...ringParticles,
  ];
};

export const calculateVeryHighParticles = (): Vector[] => {
  const { MAX_THRESHOLD } = ENTROPY_SYSTEM_CONSTANTS.VERY_HIGH;

  const RING_PARTICLE_CONSTANTS = [
    {
      threshold: MAX_THRESHOLD,
      stepAngle: MAX_THRESHOLD * 0.06,
      randomOffset: 0,
    },
    {
      threshold: MAX_THRESHOLD * 0.92,
      stepAngle: MAX_THRESHOLD * 0.06,
      randomOffset: 0,
    },
    {
      threshold: MAX_THRESHOLD * 0.85,
      stepAngle: MAX_THRESHOLD * 0.06,
      randomOffset: 0,
    },
    {
      threshold: MAX_THRESHOLD * 0.78,
      stepAngle: MAX_THRESHOLD * 0.06,
      randomOffset: 0,
    },
    {
      threshold: MAX_THRESHOLD * 0.71,
      stepAngle: MAX_THRESHOLD * 0.06,
      randomOffset: 0,
    },
  ];

  const ringParticles = [];

  for (const ringParticleConstant of RING_PARTICLE_CONSTANTS) {
    const edgeParticles = generateEdgeParticles({
      centerX: particleCanvasWidth / 2,
      centerY: particleCanvasHeight / 2,
      threshold: ringParticleConstant.threshold,
      stepAngle: ringParticleConstant.stepAngle,
      randomOffset: ringParticleConstant.randomOffset,
    });

    ringParticles.push(...edgeParticles.map((p) => new Vector(p.x, p.y)));
  }

  return [...ringParticles];
};
