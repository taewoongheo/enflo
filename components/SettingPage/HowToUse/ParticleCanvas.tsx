import {
  particleCanvasHeight,
  particleCanvasWidth,
} from '@/components/MainPage/constants/entropySystem/dimension';
import { calculateHowToUseParticles } from '@/components/MainPage/utils/getHowToUseParticles';
import { useTheme } from '@/contexts/ThemeContext';
import {
  Canvas,
  Group,
  LinearGradient,
  Mask,
  Rect,
  vec,
} from '@shopify/react-native-skia';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureUpdateEvent,
  PanGestureHandlerEventPayload,
  TapGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import { runOnJS, useSharedValue } from 'react-native-reanimated';
import DynamicParticle from './DynamicParticle';

interface ParticleCanvasProps {
  low: boolean;
  onTouchableEnable: () => void;
}

function ParticleCanvas({ low, onTouchableEnable }: ParticleCanvasProps) {
  const { theme } = useTheme();

  const MIN_RADIUS = particleCanvasWidth * 0.005;
  const MAX_RADIUS = particleCanvasWidth * 0.00625;
  const FADE_START_RATIO = 0.75;

  const touchX = useSharedValue(0);
  const touchY = useSharedValue(0);
  const isTouching = useSharedValue(false);

  const particles = useMemo(() => calculateHowToUseParticles(), []);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loading = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setIsLoading(false);
    };

    loading();
  }, []);

  const handleTouch = (
    e:
      | GestureUpdateEvent<PanGestureHandlerEventPayload>
      | GestureUpdateEvent<TapGestureHandlerEventPayload>,
  ) => {
    'worklet';
    touchX.value = e.x;
    touchY.value = e.y;
    isTouching.value = true;

    // 첫 터치 시 touchable을 true로 설정
    runOnJS(onTouchableEnable)();
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
    <View style={{ position: 'relative' }}>
      {isLoading && (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            backgroundColor: theme.colors.background,

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
          style={{ width: particleCanvasWidth, height: particleCanvasHeight }}
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
            {particles.map((particle, index) => {
              const radius =
                Math.random() * (MAX_RADIUS - MIN_RADIUS) + MIN_RADIUS;

              const colorValue = theme.colors.particles.base;
              const maxAlpha = theme.colors.particles.maxAlpha;
              const minAlpha = theme.colors.particles.minAlpha;
              const alpha = Math.random() * (maxAlpha - minAlpha) + minAlpha;
              const color = `rgba(${colorValue}, ${colorValue}, ${colorValue}, ${alpha})`;

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
          </Mask>
        </Canvas>
      </GestureDetector>
    </View>
  );
}

export default ParticleCanvas;
