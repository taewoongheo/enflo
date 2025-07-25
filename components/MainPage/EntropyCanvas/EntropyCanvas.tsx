import {
  particleCanvasHeight,
  particleCanvasWidth,
} from '@/constants/entropySystem/dimension';
import { Canvas } from '@shopify/react-native-skia';
import React from 'react';
import {
  Gesture,
  GestureDetector,
  GestureUpdateEvent,
  TapGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import { useSharedValue } from 'react-native-reanimated';
import { PanGestureHandlerEventPayload } from 'react-native-screens';
import EntropySystem from './EntropySystem';

const EntropyCanvas = () => {
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
  );
};

export default EntropyCanvas;
