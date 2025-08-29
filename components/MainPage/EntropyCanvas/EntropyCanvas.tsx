import {
  particleCanvasHeight,
  particleCanvasWidth,
} from '@/constants/entropySystem/dimension';
import { useEntropyStore } from '@/store/entropyStore';
import {
  Canvas,
  LinearGradient,
  Mask,
  Rect,
  vec,
} from '@shopify/react-native-skia';
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

const FADE_START_RATIO = 0.75;

const EntropyCanvas = () => {
  const entropyScore = useEntropyStore((s) => s.entropyScore);

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
        style={{ width: particleCanvasWidth, height: particleCanvasHeight }}
      >
        <Mask
          mode="alpha"
          mask={
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
                  'rgba(255,255,255,1)',
                  'rgba(255,255,255,1)',
                  'rgba(255,255,255,0)',
                ]}
                positions={[0, FADE_START_RATIO, 1]}
              />
            </Rect>
          }
        >
          <EntropySystem
            touchX={touchX}
            touchY={touchY}
            isTouching={isTouching}
          />
        </Mask>
      </Canvas>
    </GestureDetector>
  );
};

export default EntropyCanvas;
