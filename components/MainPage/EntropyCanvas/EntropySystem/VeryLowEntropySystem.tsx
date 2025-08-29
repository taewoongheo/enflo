import {
  particleCanvasHeight,
  particleCanvasWidth,
} from '@/components/MainPage/constants/entropySystem/dimension';
import { RENDER_CONSTANTS } from '@/components/MainPage/constants/entropySystem/entropySystem';
import { poissonDiskSampling } from '@/lib/algorithms/particleDistribution';
import { Vector } from '@/lib/math/Vector';
import { Circle, vec } from '@shopify/react-native-skia';
import React, { useMemo } from 'react';
import {
  SharedValue,
  useDerivedValue,
  useFrameCallback,
  useSharedValue,
} from 'react-native-reanimated';

const INFLUENCE_DISTANCE = 100;

// friction
const FRICTION = 0.98;

// push force
const PUSH_FORCE = 5;

// speed scale
const SPEED_SCALE = 0.05;

// safe distance
const PARTICLE_MIN_DISTANCE = 10;

// poisson disk sampling
export const MIN_DISTANCE = 80;
export const MAX_ATTEMPTS = 100;

// particle creation range
export const MAX_THRESHOLD = particleCanvasWidth;
export const MIN_THRESHOLD = 0;

// particle radius range
const MIN_RADIUS = 2;
const MAX_RADIUS = 2.5;

interface ParticleSystemProps {
  touchX: SharedValue<number>;
  touchY: SharedValue<number>;
  isTouching: SharedValue<boolean>;
}

function VeryLowEntropySystem({
  touchX,
  touchY,
  isTouching,
}: ParticleSystemProps) {
  const particles = useMemo(() => {
    const sampledParticles = poissonDiskSampling({
      width: particleCanvasWidth,
      height: particleCanvasHeight,
      minDistance: MIN_DISTANCE,
      maxThreshold: MAX_THRESHOLD,
      minThreshold: MIN_THRESHOLD,
    });

    return sampledParticles.filter((p): p is Vector => p !== undefined);
  }, []);

  return (
    <>
      {particles.map((particle, index) => {
        const radius = Math.random() * (MAX_RADIUS - MIN_RADIUS) + MIN_RADIUS;

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

interface ParticleProps {
  centerX: number;
  centerY: number;
  radius: number;
  color: string;
  touchX: SharedValue<number>;
  touchY: SharedValue<number>;
  isTouching: SharedValue<boolean>;
}

function Particle({
  centerX,
  centerY,
  radius,
  color,
  touchX,
  touchY,
  isTouching,
}: ParticleProps): React.JSX.Element {
  // position and velocity
  const px = useSharedValue(centerX);
  const py = useSharedValue(centerY);
  const vx = useSharedValue(0);
  const vy = useSharedValue(0);

  // physics simulation loop
  useFrameCallback(() => {
    // apply friction (velocity decrease)
    vx.value *= FRICTION;
    vy.value *= FRICTION;

    // update position (apply velocity)
    px.value += vx.value * SPEED_SCALE;
    py.value += vy.value * SPEED_SCALE;

    // calculate touch influence
    if (isTouching.value) {
      const dx = touchX.value - px.value;
      const dy = touchY.value - py.value;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < INFLUENCE_DISTANCE) {
        const safeDistance = Math.max(distance, PARTICLE_MIN_DISTANCE);

        // normalized direction vector
        const normalizedDx = dx / safeDistance;
        const normalizedDy = dy / safeDistance;

        // calculate force
        const forceMultiplier = INFLUENCE_DISTANCE / safeDistance;
        const pushForce = PUSH_FORCE * forceMultiplier;

        // apply force in opposite direction of touch
        vx.value -= normalizedDx * pushForce;
        vy.value -= normalizedDy * pushForce;
      }
    }
  });

  const position = useDerivedValue(() => {
    return vec(px.value, py.value);
  });

  return <Circle c={position} r={radius} color={color} />;
}

export default VeryLowEntropySystem;
