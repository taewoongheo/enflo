import { particleCanvasWidth } from '@/components/MainPage/constants/entropySystem/dimension';
import { Circle, vec } from '@shopify/react-native-skia';
import React from 'react';
import {
  SharedValue,
  useDerivedValue,
  useFrameCallback,
  useSharedValue,
} from 'react-native-reanimated';

interface DynamicParticleProps {
  centerX: number;
  centerY: number;
  nextX: number;
  nextY: number;
  radius: number;
  color: string;
  touchX: SharedValue<number>;
  touchY: SharedValue<number>;
  isTouching: SharedValue<boolean>;
  low: boolean;
}

function DynamicParticle({
  centerX,
  centerY,
  nextX,
  nextY,
  radius,
  color,
  touchX,
  touchY,
  isTouching,
  low,
}: DynamicParticleProps): React.JSX.Element {
  const INFLUENCE_DISTANCE = particleCanvasWidth * 0.25;
  const PARTICLE_MIN_DISTANCE = particleCanvasWidth * 0.025;

  // position and velocity
  const px = useSharedValue(centerX);
  const py = useSharedValue(centerY);
  const vx = useSharedValue(0);
  const vy = useSharedValue(0);

  // physics simulation loop
  useFrameCallback(() => {
    const RESTORE_FORCE = low ? 0.01 : 0.05;
    const FRICTION = low ? 0.98 : 0.89;
    const SPEED_SCALE = low ? 0.05 : 0.2;
    const PUSH_FORCE = low ? 120 : 20;

    if (low) {
      centerX = nextX;
      centerY = nextY;
    }

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
        const pf = PUSH_FORCE * forceMultiplier;

        // apply force in opposite direction of touch
        vx.value -= normalizedDx * pf;
        vy.value -= normalizedDy * pf;
      }
    }
  });

  const position = useDerivedValue(() => {
    return vec(px.value, py.value);
  });

  return <Circle c={position} r={radius} color={color} />;
}

export default DynamicParticle;
