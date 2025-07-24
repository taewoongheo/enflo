import { ContentLayout } from '@/components/common/ContentLayout';
import Typography from '@/components/common/Typography';
import EntropySystem from '@/components/MainPage/EntropySystem/EntropySystem';
import {
  particleCanvasHeight,
  particleCanvasWidth,
} from '@/constants/entropySystem/dimension';
import { useTheme } from '@/contexts/ThemeContext';
import { sessionMockData } from '@/data/sessionMockData';
import Session from '@/models/Session';
import { baseTokens } from '@/styles';
import { AntDesign } from '@expo/vector-icons';
import { Canvas } from '@shopify/react-native-skia';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import {
  FlatList,
  Gesture,
  GestureDetector,
  GestureUpdateEvent,
  ScrollView,
  TapGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import { useSharedValue } from 'react-native-reanimated';
import { PanGestureHandlerEventPayload } from 'react-native-screens';
import { scale } from 'react-native-size-matters';

export function formatMsToTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number) => String(n).padStart(2, '0');

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

function MainScreen() {
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    setSessions(sessionMockData);
  }, []);

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
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
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
        <ContentLayout>
          <TouchableOpacity
            style={styles.entropyScoreContainer}
            activeOpacity={0.7}
            onPress={() => {
              console.log('entropy score clicked');
            }}
          >
            <Typography
              variant="title1Bold"
              style={{ color: theme.colors.text.primary }}
            >
              0.23
            </Typography>
            <AntDesign
              name="questioncircle"
              size={14}
              color={theme.colors.text.secondary}
              style={{
                marginTop: baseTokens.spacing[2],
                marginLeft: baseTokens.spacing[1],
              }}
            />
          </TouchableOpacity>
          <Typography
            variant="body1Regular"
            style={{ color: theme.colors.text.secondary }}
          >
            {t('entropySuggestion')}
          </Typography>
          <FlatList
            data={sessions}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              gap: baseTokens.spacing[2],
              marginVertical: baseTokens.spacing[4],
            }}
            renderItem={({ item }) => (
              <View
                style={{
                  width: scale(200),
                  height: scale(120),
                  backgroundColor: theme.colors.text.secondary,
                  padding: baseTokens.spacing[3],
                  borderRadius: baseTokens.borderRadius.sm,
                  justifyContent: 'space-between',
                }}
              >
                <Typography
                  variant="body1Regular"
                  style={{ color: theme.colors.background }}
                >
                  {item.sessionName}
                </Typography>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Typography
                    variant="title1Bold"
                    style={{ color: theme.colors.background }}
                  >
                    {formatMsToTime(item.totalNetFocusMs)}
                  </Typography>
                  <AntDesign
                    name="caretright"
                    size={scale(24)}
                    color={theme.colors.background}
                  />
                </View>
              </View>
            )}
          />
        </ContentLayout>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  entropyScoreContainer: {
    flexDirection: 'row',
  },
});

export default MainScreen;
