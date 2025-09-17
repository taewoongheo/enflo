import {
  particleCanvasHeight,
  particleCanvasWidth,
} from '@/components/MainPage/constants/entropySystem/dimension';
import { RING_PARTICLE_CONSTANTS } from '@/components/MainPage/EntropyCanvas/EntropySystem/VeryHighEntropySystem';
import { useTheme } from '@/contexts/ThemeContext';
import { generateEdgeParticles } from '@/lib/algorithms/particleDistribution';
import { Canvas, Circle, vec } from '@shopify/react-native-skia';
import React, { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureUpdateEvent,
  PanGestureHandlerEventPayload,
  TapGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import {
  SharedValue,
  useDerivedValue,
  useFrameCallback,
  useSharedValue,
} from 'react-native-reanimated';

function HowToUseScreen() {
  const MIN_RADIUS = particleCanvasWidth * 0.005;
  const MAX_RADIUS = particleCanvasWidth * 0.00625;

  const { theme } = useTheme();

  const touchX = useSharedValue(0);
  const touchY = useSharedValue(0);
  const isTouching = useSharedValue(false);

  const handleTouch = (
    e:
      | GestureUpdateEvent<PanGestureHandlerEventPayload>
      | GestureUpdateEvent<TapGestureHandlerEventPayload>,
  ) => {
    'worklet';
    touchX.value = e.x;
    touchY.value = e.y;
    isTouching.value = true;
  };

  const tap = Gesture.Tap()
    .onBegin((e) => {
      handleTouch(e);
    })
    .onEnd(() => {
      'worklet';
      isTouching.value = false;
    });

  const pan = Gesture.Pan()
    .onBegin((e) => {
      handleTouch(e);
    })
    .onUpdate((e) => {
      handleTouch(e);
    })
    .onEnd(() => {
      'worklet';
      isTouching.value = false;
    });

  const combinedGesture = Gesture.Race(tap, pan);

  // particles

  const [low, setLow] = useState(false);

  const particles = useMemo(() => {
    const ringParticles = [];

    for (let i = 0; i < RING_PARTICLE_CONSTANTS.length; i++) {
      const ringParticleConstant = RING_PARTICLE_CONSTANTS[i];

      ringParticles.push(
        ...generateEdgeParticles(
          {
            centerX: particleCanvasWidth / 2,
            centerY: particleCanvasHeight / 2,
            threshold: ringParticleConstant.threshold,
            stepAngle: ringParticleConstant.stepAngle,
            randomOffset: ringParticleConstant.randomOffset,
          },
          i + 1,
        ),
      );
    }

    const allParticles = [...ringParticles];

    return allParticles;
  }, [low]);

  const handleNext = () => {
    setLow((prev) => !prev);
  };

  return (
    <>
      <GestureDetector gesture={combinedGesture}>
        <Canvas
          style={{ width: particleCanvasWidth, height: particleCanvasHeight }}
        >
          {particles.map((particle, index) => {
            const radius =
              Math.random() * (MAX_RADIUS - MIN_RADIUS) + MIN_RADIUS;

            const colorValue = Math.floor(
              Math.random() *
                (theme.colors.particlesRGBValue.max -
                  theme.colors.particlesRGBValue.min +
                  1) +
                theme.colors.particlesRGBValue.min,
            );

            const color = `rgb(${colorValue}, ${colorValue}, ${colorValue})`;

            return (
              <DynamicParticle
                key={`particle-${index}-${particle.x}-${particle.y}`}
                centerX={particle.x}
                centerY={particle.y}
                nextX={particle.nextX}
                nextY={particle.nextY}
                radius={radius}
                color={color}
                touchX={touchX}
                touchY={touchY}
                isTouching={isTouching}
                low={low}
              />
            );
          })}
        </Canvas>
      </GestureDetector>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          gap: 20,
        }}
      >
        <Text>How to use</Text>
        <Pressable
          onPress={handleNext}
          style={{
            padding: 10,
            backgroundColor: 'skyblue',
            paddingHorizontal: 20,
            borderRadius: 10,
          }}
        >
          <Text>Next</Text>
        </Pressable>
      </View>
    </>
  );
}

interface ParticleProps {
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
}: ParticleProps): React.JSX.Element {
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
    const FRICTION = low ? 0.99 : 0.89;
    const SPEED_SCALE = low ? 0.05 : 0.2;
    const PUSH_FORCE = low ? 100 : 20;

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

export default HowToUseScreen;
