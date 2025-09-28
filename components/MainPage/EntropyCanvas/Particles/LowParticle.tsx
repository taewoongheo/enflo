import { ENTROPY_SYSTEM_CONSTANTS } from '@/components/MainPage/constants/entropySystem/entropySystem';
import { Circle, vec } from '@shopify/react-native-skia';
import {
  useDerivedValue,
  useFrameCallback,
  useSharedValue,
} from 'react-native-reanimated';
import { ParticleProps } from '../EntropySystemWrapper';

const {
  PARTICLE: {
    INFLUENCE_DISTANCE,
    FRICTION,
    PUSH_FORCE,
    SPEED_SCALE,
    PARTICLE_MIN_DISTANCE,
  },
  MIN_RADIUS,
  MAX_RADIUS,
} = ENTROPY_SYSTEM_CONSTANTS.LOW;

function LowParticle({
  centerX,
  centerY,
  color,
  touchX,
  touchY,
  isTouching,
}: ParticleProps) {
  const radius = Math.random() * (MAX_RADIUS - MIN_RADIUS) + MIN_RADIUS;

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

export default LowParticle;
