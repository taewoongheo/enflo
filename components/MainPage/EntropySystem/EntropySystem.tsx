import Particle from '@/components/MainPage/EntropySystem/Particle';
import {
  particleCanvasHeight,
  particleCanvasWidth,
} from '@/constants/entropySystem/dimension';
import {
  ENTROPY_SYSTEM_CONSTANTS,
  RENDER_CONSTANTS,
} from '@/constants/entropySystem/entropySystem';
import {
  generateEdgeParticles,
  poissonDiskSampling,
} from '@/lib/algorithms/particleDistribution';
import { Vector } from '@/lib/math/Vector';
import React, { useMemo } from 'react';
import { SharedValue } from 'react-native-reanimated';

const RING_PARTICLE_CONSTANTS = [
  {
    threshold: 100,
    stepAngle: 10,
    randomOffset: 4,
  },
  {
    threshold: 90,
    stepAngle: 12,
    randomOffset: 10,
  },
  {
    threshold: 80,
    stepAngle: 14,
    randomOffset: 16,
  },
];
interface ParticleSystemProps {
  touchX: SharedValue<number>;
  touchY: SharedValue<number>;
  isTouching: SharedValue<boolean>;
}

function EntropySystem({ touchX, touchY, isTouching }: ParticleSystemProps) {
  const particles = useMemo(() => {
    const sampledParticles = poissonDiskSampling({
      width: particleCanvasWidth,
      height: particleCanvasHeight,
      centerX: particleCanvasWidth / 2,
      centerY: particleCanvasHeight / 2,
      minDistance: ENTROPY_SYSTEM_CONSTANTS.MIN_DISTANCE,
      maxAttempts: ENTROPY_SYSTEM_CONSTANTS.MAX_ATTEMPTS,
      maxThreshold: ENTROPY_SYSTEM_CONSTANTS.MAX_THRESHOLD,
      minThreshold: ENTROPY_SYSTEM_CONSTANTS.MIN_THRESHOLD,
    });

    const ringParticles: Vector[] = [];

    for (const ringParticleConstant of RING_PARTICLE_CONSTANTS) {
      ringParticles.push(
        ...generateEdgeParticles({
          centerX: particleCanvasWidth / 2,
          centerY: particleCanvasHeight / 2,
          threshold: ringParticleConstant.threshold,
          stepAngle: ringParticleConstant.stepAngle,
          randomOffset: ringParticleConstant.randomOffset,
        }),
      );
    }

    const allParticles: Vector[] = [
      ...sampledParticles.filter((p): p is Vector => p !== undefined),
      ...ringParticles,
    ];

    return allParticles;
  }, []);

  return (
    <>
      {particles.map((particle, index) => {
        const radius =
          Math.random() *
            (ENTROPY_SYSTEM_CONSTANTS.MAX_RADIUS -
              ENTROPY_SYSTEM_CONSTANTS.MIN_RADIUS) +
          ENTROPY_SYSTEM_CONSTANTS.MIN_RADIUS;

        const colorValue =
          Math.random() *
            (RENDER_CONSTANTS.MAX_COLOR_VALUE -
              RENDER_CONSTANTS.MIN_COLOR_VALUE) +
          RENDER_CONSTANTS.MIN_COLOR_VALUE;

        const color = `rgb(${colorValue}, ${colorValue}, ${colorValue})`;

        return (
          <Particle
            key={`particle-${index}-${particle.x}-${particle.y}`}
            centerX={particle.x}
            centerY={particle.y}
            radius={radius}
            color={color}
            touchX={touchX}
            touchY={touchY}
            isTouching={isTouching}
          />
        );
      })}
    </>
  );
}

export default EntropySystem;
