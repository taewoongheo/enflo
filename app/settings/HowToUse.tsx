import Typography from '@/components/common/Typography';
import {
  particleCanvasHeight,
  particleCanvasWidth,
} from '@/components/MainPage/constants/entropySystem/dimension';
import { RING_PARTICLE_CONSTANTS } from '@/components/MainPage/EntropyCanvas/EntropySystem/VeryHighEntropySystem';
import { useTheme } from '@/contexts/ThemeContext';
import { generateEdgeParticles } from '@/lib/algorithms/particleDistribution';
import { baseTokens } from '@/styles';
import {
  Canvas,
  Circle,
  Group,
  LinearGradient,
  Mask,
  Rect,
  vec,
} from '@shopify/react-native-skia';
import { useRouter } from 'expo-router';
import React, { useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import {
  FlatList,
  Gesture,
  GestureDetector,
  GestureUpdateEvent,
  PanGestureHandlerEventPayload,
  Pressable,
  TapGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import {
  runOnJS,
  SharedValue,
  useDerivedValue,
  useFrameCallback,
  useSharedValue,
} from 'react-native-reanimated';

const ONBOARDING_CONTENT = [
  {
    content:
      '엔트로피는 무질서도를 나타내요.\n무질서도가 높을수록 입자는 더 불규칙하게 움직입니다',
  },
  {
    content:
      '얼음과 물로 예시를 들어볼게요.\n얼음은 엔트로피가 낮은 상태, 즉 무질서도가 낮고 정돈된 상태에요',
  },
  {
    content:
      '그러다 얼음이 녹아 물이 되면 엔트로피가 높은 상태가 됩니다.\n자연적인 상태에서 엔트로피는 계속해서 높아져요.',
  },
  {
    content:
      '우리의 집중도 마찬가지예요.\n가만히 두면 정신적 엔트로피가 높아져 집중을 잃습니다.',
  },
  {
    content:
      '하지만 몰입은 엔트로피를 낮추고 집중을 붙잡아 줍니다. \nenflo와 함께 낮은 엔트로피를 유지해보세요',
  },
  {
    content:
      'enflo는 엔트로피를 낮추고 집중을 붙잡아 줍니다. \nenflo와 함께 낮은 엔트로피를 유지해보세요',
  },
];

function HowToUseScreen() {
  const router = useRouter();

  const [touchable, setTouchable] = useState(false);

  const MIN_RADIUS = particleCanvasWidth * 0.005;
  const MAX_RADIUS = particleCanvasWidth * 0.00625;
  const FADE_START_RATIO = 0.75;

  const { theme } = useTheme();

  const touchX = useSharedValue(0);
  const touchY = useSharedValue(0);
  const isTouching = useSharedValue(false);

  const enableTouchable = async () => {
    if (!touchable) {
      setTimeout(() => {
        setTouchable(true);
      }, 1000);
    }
  };

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
    runOnJS(enableTouchable)();
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

  const listRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

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
  }, []);

  const handleNext = () => {
    if (currentIndex === ONBOARDING_CONTENT.length - 1) {
      router.push('/');
      return;
    }

    if (currentIndex === 1) {
      setTouchable(false);
    }

    const nextIndex = Math.min(currentIndex + 1, ONBOARDING_CONTENT.length - 1);
    setCurrentIndex(nextIndex);
    listRef.current?.scrollToIndex({ index: nextIndex, animated: true });

    if (nextIndex >= 2 && nextIndex < ONBOARDING_CONTENT.length - 2) {
      setLow(true);
      return;
    }

    setLow(false);
  };

  const getButtonText = (index: number) => {
    if (index === ONBOARDING_CONTENT.length - 1) {
      return '시작하기';
    }

    if (!touchable) {
      return '화면을 터치하거나 드래그해보세요';
    }

    return '다음';
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
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
      <View style={{ flex: 1 }}>
        <FlatList
          ref={listRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
          data={ONBOARDING_CONTENT}
          keyExtractor={(item, index) => index.toString()}
          getItemLayout={(data, index) => ({
            length: particleCanvasWidth,
            offset: particleCanvasWidth * index,
            index,
          })}
          renderItem={({ item, index }) => (
            <View
              style={{
                width: particleCanvasWidth,
                flex: 1,
                paddingHorizontal: 20,
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: baseTokens.spacing[6],
              }}
            >
              <Typography
                variant="body1Regular"
                style={{
                  textAlign: 'center',
                  color: theme.colors.text.primary,
                }}
              >
                {item.content}
              </Typography>

              <Pressable
                onPress={handleNext}
                disabled={!touchable}
                style={{
                  backgroundColor: theme.colors.text.primary,
                  paddingHorizontal: baseTokens.spacing[4],
                  paddingVertical: baseTokens.spacing[2],
                  borderRadius: baseTokens.borderRadius.sm,
                  opacity: touchable ? 1 : 0.5,
                }}
              >
                <Typography
                  variant="body2Bold"
                  style={{
                    color: theme.colors.background,
                    textAlign: 'center',
                  }}
                >
                  {getButtonText(index)}
                </Typography>
              </Pressable>
            </View>
          )}
        />
      </View>
    </View>
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

export default HowToUseScreen;
