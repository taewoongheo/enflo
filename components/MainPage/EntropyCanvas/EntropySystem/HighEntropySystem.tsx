import { ENTROPY_SYSTEM_CONSTANTS } from '@/components/MainPage/constants/entropySystem/entropySystem';
import { Vector } from '@/lib/math/Vector';
import { Theme } from '@/styles';
import { Circle, vec } from '@shopify/react-native-skia';
import React from 'react';
import {
  SharedValue,
  useDerivedValue,
  useFrameCallback,
  useSharedValue,
} from 'react-native-reanimated';

const {
  PARTICLE: {
    INFLUENCE_DISTANCE,
    RESTORE_FORCE,
    FRICTION,
    PUSH_FORCE,
    SPEED_SCALE,
    PARTICLE_MIN_DISTANCE,
  },
  MIN_RADIUS,
  MAX_RADIUS,
} = ENTROPY_SYSTEM_CONSTANTS.HIGH;

interface ParticleSystemProps {
  touchX: SharedValue<number>;
  touchY: SharedValue<number>;
  isTouching: SharedValue<boolean>;
  theme: Theme;
  particles: Vector[];
}

function HighEntropySystem({
  touchX,
  touchY,
  isTouching,
  theme,
  particles,
}: ParticleSystemProps) {
  return (
    <>
      {particles.map((particle, index) => {
        const radius = Math.random() * (MAX_RADIUS - MIN_RADIUS) + MIN_RADIUS;

        const colorValue = theme.colors.particles.base;

        const maxAlpha = theme.colors.particles.maxAlpha;
        const minAlpha = theme.colors.particles.minAlpha;

        const alpha = Math.random() * (maxAlpha - minAlpha) + minAlpha;

        const color = `rgba(${colorValue}, ${colorValue}, ${colorValue}, ${alpha})`;

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
    // restore force
    const rtX = (centerX - px.value) * RESTORE_FORCE;
    const rtY = (centerY - py.value) * RESTORE_FORCE;

    // apply force to velocity (acceleration)
    vx.value += rtX;
    vy.value += rtY;

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

export default HighEntropySystem;
