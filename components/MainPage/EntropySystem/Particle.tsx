import { PHYSICS_CONSTANTS } from '@/constants/entropySystem/physics';
import { Circle, vec } from '@shopify/react-native-skia';
import React from 'react';
import {
  SharedValue,
  useDerivedValue,
  useFrameCallback,
  useSharedValue,
} from 'react-native-reanimated';

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
    const rtX = (centerX - px.value) * PHYSICS_CONSTANTS.RESTORE_FORCE;
    const rtY = (centerY - py.value) * PHYSICS_CONSTANTS.RESTORE_FORCE;

    // apply force to velocity (acceleration)
    vx.value += rtX;
    vy.value += rtY;

    // apply friction (velocity decrease)
    vx.value *= PHYSICS_CONSTANTS.FRICTION;
    vy.value *= PHYSICS_CONSTANTS.FRICTION;

    // update position (apply velocity)
    px.value += vx.value * PHYSICS_CONSTANTS.SPEED_SCALE;
    py.value += vy.value * PHYSICS_CONSTANTS.SPEED_SCALE;

    // calculate touch influence
    if (isTouching.value) {
      const dx = touchX.value - px.value;
      const dy = touchY.value - py.value;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < PHYSICS_CONSTANTS.INFLUENCE_DISTANCE) {
        const safeDistance = Math.max(distance, PHYSICS_CONSTANTS.MIN_DISTANCE);

        // normalized direction vector
        const normalizedDx = dx / safeDistance;
        const normalizedDy = dy / safeDistance;

        // calculate force
        const forceMultiplier =
          PHYSICS_CONSTANTS.INFLUENCE_DISTANCE / safeDistance;
        const pushForce = PHYSICS_CONSTANTS.PUSH_FORCE * forceMultiplier;

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

export default Particle;
