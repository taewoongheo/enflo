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
} from '@/lib/algorithms/poissonDiskSampling';
import { Vector } from '@/lib/math/Vector';
import React, { useMemo } from 'react';
import { SharedValue } from 'react-native-reanimated';

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
      minDistance: ENTROPY_SYSTEM_CONSTANTS.MIN_DISTANCE,
      maxAttempts: ENTROPY_SYSTEM_CONSTANTS.MAX_ATTEMPTS,
      maxThreshold: ENTROPY_SYSTEM_CONSTANTS.MAX_THRESHOLD,
      minThreshold: ENTROPY_SYSTEM_CONSTANTS.MIN_THRESHOLD,
    });

    const edgeParticles = generateEdgeParticles(
      particleCanvasWidth / 2,
      particleCanvasHeight / 2,
      ENTROPY_SYSTEM_CONSTANTS.MAX_THRESHOLD,
      ENTROPY_SYSTEM_CONSTANTS.EDGE_ANGLE_STEP,
    );

    const allParticles: Vector[] = [
      ...sampledParticles.filter((p): p is Vector => p !== undefined),
      ...edgeParticles,
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
