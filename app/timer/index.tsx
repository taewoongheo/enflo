import ContentLayoutWithBack from '@/components/common/ContentLayoutWithBack';
import Typography from '@/components/common/Typography';
import { useTheme } from '@/contexts/ThemeContext';
import { sessionMockData } from '@/data/sessionMockData';
import Session from '@/models/Session';
import { baseTokens } from '@/styles';
import { Fontisto } from '@expo/vector-icons';
import { Canvas, RoundedRect } from '@shopify/react-native-skia';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LayoutChangeEvent, Pressable, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scale } from 'react-native-size-matters';

const CELL_WIDTH = scale(2);
const CELL_GAP = scale(5);

interface Cell {
  x: number;
  y: number;
  width: number;
  height: number;
  isSelected: boolean;
}

export default function Timer() {
  const { theme } = useTheme();
  const router = useRouter();
  const { sessionId } = useLocalSearchParams();
  const { t } = useTranslation('timer');
  const { top } = useSafeAreaInsets();

  const [isRunning, setIsRunning] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [timerSettingCells, setTimerSettingCells] = useState<Cell[]>([]);

  const slideX = useSharedValue(0);

  useEffect(() => {
    const found = sessionMockData.find((el) => el.sessionId === sessionId);
    if (!found) {
      router.back();
    } else {
      setSession(found);
    }
  }, [router, sessionId]);

  const handleCanvasLayout = (e: LayoutChangeEvent) => {
    const { width } = e.nativeEvent.layout;
    const centerX = width / 2 - CELL_WIDTH / 2;
    const halfCount = Math.floor(width / 2 / (CELL_WIDTH + CELL_GAP));

    const cells: Cell[] = [];

    for (let i = halfCount; i >= 1; i--) {
      cells.push({
        x: centerX - (CELL_WIDTH + CELL_GAP) * i,
        y: 0,
        width: CELL_WIDTH,
        height: 180,
        isSelected: false,
      });
    }

    cells.push({
      x: centerX,
      y: 0,
      width: CELL_WIDTH,
      height: 180,
      isSelected: true,
    });

    for (let i = 1; i <= halfCount; i++) {
      cells.push({
        x: centerX + (CELL_WIDTH + CELL_GAP) * i,
        y: 0,
        width: CELL_WIDTH,
        height: 180,
        isSelected: false,
      });
    }

    setTimerSettingCells(cells);
  };

  const PanGestureHandler = Gesture.Pan().onChange((event) => {
    const x = event.absoluteX;

    slideX.value = x;
    console.log(slideX.value);
  });

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingTop: top,
      }}
    >
      <ContentLayoutWithBack>
        <Typography
          variant="title2Bold"
          style={{ color: theme.colors.text.primary }}
        >
          {session?.sessionName}
        </Typography>
        <Typography
          variant="title2Bold"
          style={{ color: theme.colors.text.secondary }}
        >
          {t('timer')}
        </Typography>

        <View
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: baseTokens.spacing[2],
            marginTop: baseTokens.spacing[6],
          }}
        >
          <Text
            style={{
              fontSize: scale(70),
              color: theme.colors.text.primary,
              fontFamily: 'Pretendard-Semibold',
            }}
          >
            90:00
          </Text>
          <Typography
            variant="body1Regular"
            style={{
              color: theme.colors.text.secondary,
              textAlign: 'center',
            }}
          >
            {t('suggestions')}
          </Typography>

          <GestureDetector gesture={PanGestureHandler}>
            <Canvas
              style={{
                width: '100%',
                height: 180,
                marginVertical: baseTokens.spacing[2],
              }}
              onLayout={handleCanvasLayout}
            >
              {timerSettingCells.map((cell, index) => (
                <RoundedRect
                  key={index}
                  x={cell.x}
                  y={cell.y}
                  width={cell.width}
                  height={cell.height}
                  color={
                    cell.isSelected
                      ? theme.colors.text.primary
                      : theme.colors.text.secondary
                  }
                  r={baseTokens.borderRadius.md}
                />
              ))}
            </Canvas>
          </GestureDetector>

          {/* TODO: gradient style */}
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: theme.colors.text.secondary,
              borderRadius: baseTokens.borderRadius.sm,
              padding: baseTokens.spacing[2],
              paddingVertical: baseTokens.spacing[3],
            }}
          >
            <Pressable onPress={() => setIsRunning((prev) => !prev)}>
              <Fontisto
                name={isRunning ? 'pause' : 'play'}
                size={baseTokens.iconSize.lg}
                color={theme.colors.text.primary}
              />
            </Pressable>
          </View>
        </View>
      </ContentLayoutWithBack>
    </View>
  );
}
