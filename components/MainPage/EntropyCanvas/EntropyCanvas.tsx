import {
  particleCanvasHeight,
  particleCanvasWidth,
} from '@/components/MainPage/constants/entropySystem/dimension';
import {
  ENTROPY_SYSTEM_CONSTANTS,
  ENTROPY_SYSTEM_GLOBAL_CONSTANTS,
} from '@/components/MainPage/constants/entropySystem/entropySystem';
import { useTheme } from '@/contexts/ThemeContext';
import {
  generateEdgeParticles,
  poissonDiskSampling,
} from '@/lib/algorithms/particleDistribution';
import { Vector } from '@/lib/math/Vector';
import { useEntropyStore } from '@/store/entropyStore';
import { baseTokens, Theme } from '@/styles';
import { Foundation } from '@expo/vector-icons';
import {
  Canvas,
  Group,
  LinearGradient,
  Mask,
  Rect,
  vec,
} from '@shopify/react-native-skia';
import React, { useCallback, useMemo, useReducer } from 'react';
import { Pressable, View } from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureUpdateEvent,
  PanGestureHandlerEventPayload,
  TapGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import { SharedValue, useSharedValue } from 'react-native-reanimated';
import HighEntropySystem from './EntropySystem/HighEntropySystem';
import LowEntropySystem from './EntropySystem/LowEntropySystem';
import MediumEntropySystem from './EntropySystem/MediumEntropySystem';
import VeryHighEntropySystem from './EntropySystem/VeryHighEntropySystem';
import VeryLowEntropySystem from './EntropySystem/VeryLowEntropySystem';

// TODO: race condition between pan gesture and scrollView
const EntropyCanvas = () => {
  const FADE_START_RATIO = 0.75;
  const BUTTON_HEIGHT = particleCanvasHeight * 0.08;

  const { theme } = useTheme();

  const [refreshKey, setRefreshKey] = useReducer((s) => s + 1, 0);

  const handleRefresh = useCallback(() => {
    setRefreshKey();
  }, []);

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

  return (
    <View
      style={{
        position: 'relative',
        width: particleCanvasWidth,
        height: particleCanvasHeight,
      }}
    >
      <GestureDetector gesture={combinedGesture}>
        <Canvas
          style={{
            flex: 1,
          }}
        >
          <Mask
            mode="alpha"
            mask={
              <Group>
                <Rect
                  x={0}
                  y={0}
                  width={particleCanvasWidth}
                  height={particleCanvasHeight}
                >
                  <LinearGradient
                    start={vec(0, 0)}
                    end={vec(0, particleCanvasHeight)}
                    colors={[
                      `rgba(${theme.colors.particles.background}, ${theme.colors.particles.background}, ${theme.colors.particles.background}, 1)`,
                      `rgba(${theme.colors.particles.background}, ${theme.colors.particles.background}, ${theme.colors.particles.background}, 1)`,
                      `rgba(${theme.colors.particles.background}, ${theme.colors.particles.background}, ${theme.colors.particles.background}, 0)`,
                    ]}
                    positions={[0, FADE_START_RATIO, 1]}
                  />
                </Rect>
              </Group>
            }
          >
            <EntropySystem
              touchX={touchX}
              touchY={touchY}
              isTouching={isTouching}
              key={refreshKey}
              theme={theme}
            />
          </Mask>
        </Canvas>
      </GestureDetector>
      <View
        pointerEvents="box-none"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: particleCanvasHeight * 0.025,
          height: BUTTON_HEIGHT,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Pressable
          onPress={handleRefresh}
          style={{
            backgroundColor: theme.colors.pages.main.sessionCard.background,
            borderWidth: 1,
            borderColor: theme.colors.pages.main.sessionCard.border,
            borderRadius: baseTokens.borderRadius.lg,

            paddingVertical: baseTokens.spacing[2],
            aspectRatio: 1.7,

            justifyContent: 'center',
            alignItems: 'center',

            zIndex: 1000,
          }}
        >
          <Foundation
            name="refresh"
            size={BUTTON_HEIGHT * 0.55}
            color={theme.colors.text.primary}
          />
        </Pressable>
      </View>
    </View>
  );
};

function EntropySystem({
  touchX,
  touchY,
  isTouching,
  theme,
}: {
  touchX: SharedValue<number>;
  touchY: SharedValue<number>;
  isTouching: SharedValue<boolean>;
  theme: Theme;
}) {
  const entropyScore = useEntropyStore((s) => s.entropyScore);

  const veryLowParticles = useMemo(() => {
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
  }, []);

  const lowParticles = useMemo(() => {
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
  }, []);

  const mediumParticles = useMemo(() => {
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
  }, []);

  const highParticles = useMemo(() => {
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
  }, []);

  const veryHighParticles = useMemo(() => {
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
  }, []);

  if (
    entropyScore <= ENTROPY_SYSTEM_GLOBAL_CONSTANTS.ENTROPY_SCORE.VERY_LOW_MAX
  ) {
    return (
      <VeryLowEntropySystem
        touchX={touchX}
        touchY={touchY}
        isTouching={isTouching}
        theme={theme}
        particles={veryLowParticles}
      />
    );
  }

  if (entropyScore <= ENTROPY_SYSTEM_GLOBAL_CONSTANTS.ENTROPY_SCORE.LOW_MAX) {
    return (
      <LowEntropySystem
        touchX={touchX}
        touchY={touchY}
        isTouching={isTouching}
        theme={theme}
        particles={lowParticles}
      />
    );
  }

  if (
    entropyScore <= ENTROPY_SYSTEM_GLOBAL_CONSTANTS.ENTROPY_SCORE.MEDIUM_MAX
  ) {
    return (
      <MediumEntropySystem
        touchX={touchX}
        touchY={touchY}
        isTouching={isTouching}
        theme={theme}
        particles={mediumParticles}
      />
    );
  }

  if (entropyScore <= ENTROPY_SYSTEM_GLOBAL_CONSTANTS.ENTROPY_SCORE.HIGH_MAX) {
    return (
      <HighEntropySystem
        touchX={touchX}
        touchY={touchY}
        isTouching={isTouching}
        theme={theme}
        particles={highParticles}
      />
    );
  }

  return (
    <VeryHighEntropySystem
      touchX={touchX}
      touchY={touchY}
      isTouching={isTouching}
      theme={theme}
      particles={veryHighParticles}
    />
  );
}

export default EntropyCanvas;
