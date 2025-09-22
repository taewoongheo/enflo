import {
  particleCanvasHeight,
  particleCanvasWidth,
} from '@/components/MainPage/constants/entropySystem/dimension';
import { ENTROPY_SYSTEM_GLOBAL_CONSTANTS } from '@/components/MainPage/constants/entropySystem/entropySystem';
import { HAPTIC_THROTTLE_TIME } from '@/constants/haptics';
import { useTheme } from '@/contexts/ThemeContext';
import { Vector } from '@/lib/math/Vector';
import { useEntropyStore } from '@/store/entropyStore';
import { baseTokens, Theme } from '@/styles';
import { hapticEntropyDrag } from '@/utils/haptics';
import { Foundation } from '@expo/vector-icons';
import {
  Canvas,
  Group,
  LinearGradient,
  Mask,
  Rect,
  vec,
} from '@shopify/react-native-skia';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import {
  ComposedGesture,
  Gesture,
  GestureDetector,
  GestureUpdateEvent,
  PanGestureHandlerEventPayload,
  TapGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import { runOnJS, SharedValue, useSharedValue } from 'react-native-reanimated';
import {
  calculateHighParticles,
  calculateLowParticles,
  calculateMediumParticles,
  calculateVeryHighParticles,
  calculateVeryLowParticles,
} from '../utils/getPaticlePositions';
import EntropySystemWrapper, { ParticleProps } from './EntropySystemWrapper';
import {
  HighParticle,
  LowParticle,
  MediumParticle,
  VeryHighParticle,
  VeryLowParticle,
} from './Particles';

const EntropyCanvas = () => {
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
      runOnJS(hapticEntropyDrag)();

      handleTouch(e);
    })
    .onEnd(() => {
      'worklet';
      isTouching.value = false;
    });

  const lastTimestamp = useSharedValue<number>(0);

  const pan = Gesture.Pan()
    .onBegin((e) => {
      lastTimestamp.value = performance.now();

      handleTouch(e);
    })
    .onUpdate((e) => {
      if (performance.now() - lastTimestamp.value > HAPTIC_THROTTLE_TIME) {
        lastTimestamp.value = performance.now();

        runOnJS(hapticEntropyDrag)();
      }

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
      <EntropySystem
        combinedGesture={combinedGesture}
        touchX={touchX}
        touchY={touchY}
        isTouching={isTouching}
        theme={theme}
        refreshKey={refreshKey}
      />
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
  combinedGesture,
  touchX,
  touchY,
  isTouching,
  theme,
  refreshKey,
}: {
  combinedGesture: ComposedGesture;
  touchX: SharedValue<number>;
  touchY: SharedValue<number>;
  isTouching: SharedValue<boolean>;
  theme: Theme;
  refreshKey: number;
}) {
  const FADE_START_RATIO = 0.75;

  const entropyScore = useEntropyStore((s) => s.entropyScore);

  const veryLowParticles = useMemo(() => calculateVeryLowParticles(), []);
  const lowParticles = useMemo(() => calculateLowParticles(), []);
  const mediumParticles = useMemo(() => calculateMediumParticles(), []);
  const highParticles = useMemo(() => calculateHighParticles(), []);
  const veryHighParticles = useMemo(() => calculateVeryHighParticles(), []);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loading = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setIsLoading(false);
    };

    loading();
  }, []);

  let particles: Vector[] = [];
  let ParticleComponent: React.ComponentType<ParticleProps> | null = null;

  if (
    entropyScore <= ENTROPY_SYSTEM_GLOBAL_CONSTANTS.ENTROPY_SCORE.VERY_LOW_MAX
  ) {
    particles = veryLowParticles;
    ParticleComponent = VeryLowParticle;
  } else if (
    entropyScore <= ENTROPY_SYSTEM_GLOBAL_CONSTANTS.ENTROPY_SCORE.LOW_MAX
  ) {
    particles = lowParticles;
    ParticleComponent = LowParticle;
  } else if (
    entropyScore <= ENTROPY_SYSTEM_GLOBAL_CONSTANTS.ENTROPY_SCORE.MEDIUM_MAX
  ) {
    particles = mediumParticles;
    ParticleComponent = MediumParticle;
  } else if (
    entropyScore <= ENTROPY_SYSTEM_GLOBAL_CONSTANTS.ENTROPY_SCORE.HIGH_MAX
  ) {
    particles = highParticles;
    ParticleComponent = HighParticle;
  } else {
    particles = veryHighParticles;
    ParticleComponent = VeryHighParticle;
  }

  return (
    <View
      style={{
        position: 'relative',
      }}
    >
      {isLoading && (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.colors.background,

            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,

            zIndex: 1000,
          }}
        >
          <ActivityIndicator size="large" color={theme.colors.text.primary} />
        </View>
      )}
      <GestureDetector gesture={combinedGesture}>
        <Canvas
          style={{
            width: particleCanvasWidth,
            height: particleCanvasHeight,
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
            <EntropySystemWrapper
              key={refreshKey}
              touchX={touchX}
              touchY={touchY}
              isTouching={isTouching}
              theme={theme}
              particles={particles}
              ParticleComponent={ParticleComponent}
            />
          </Mask>
        </Canvas>
      </GestureDetector>
    </View>
  );
}

export default EntropyCanvas;
