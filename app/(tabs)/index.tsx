import { ScreenLayout } from '@/components/common/ScreenLayout';
import Typography from '@/components/common/Typography';
import EntropySystem from '@/components/MainPage/EntropySystem/EntropySystem';
import {
  particleCanvasHeight,
  particleCanvasWidth,
} from '@/constants/entropySystem/dimension';
import { useTheme } from '@/contexts/ThemeContext';
import { Canvas } from '@shopify/react-native-skia';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureUpdateEvent,
  TapGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import { useSharedValue } from 'react-native-reanimated';
import { PanGestureHandlerEventPayload } from 'react-native-screens';

function MainScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation('main');

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
    .onStart((e) => handleTouch(e))
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
    <ScreenLayout>
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <GestureDetector gesture={combinedGesture}>
          <Canvas
            style={{
              width: particleCanvasWidth,
              height: particleCanvasHeight,
            }}
          >
            <EntropySystem
              touchX={touchX}
              touchY={touchY}
              isTouching={isTouching}
            />
          </Canvas>
        </GestureDetector>
        <Typography
          variant="label"
          style={{ color: theme.colors.text.primary }}
        >
          {t('entropyScoreLabel')}
        </Typography>
        <Typography
          variant="title1Bold"
          style={{ color: theme.colors.text.primary }}
        >
          0.23
        </Typography>
      </View>
    </ScreenLayout>
  );
}

export default MainScreen;
