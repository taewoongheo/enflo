import { useTheme } from '@/contexts/ThemeContext';
import { Canvas, Group, RoundedRect } from '@shopify/react-native-skia';
import { View } from 'react-native';
import { scale } from 'react-native-size-matters';
import { PERIOD } from '../../constants/period';

const WEEKLY_RECT_WIDTH = scale(20);
const WEEKLY_RECT_RADIUS = scale(2);

const MONTHLY_RECT_WIDTH = scale(5);
const MONTHLY_RECT_RADIUS = scale(1);

const WEEKLY_DAYS = 7;
const MONTHLY_DAYS = 30;

export default function GraphCanvas({
  datas,
  selectedPeriod,
  todayYYYYMMDD,
  canvasWidth,
  canvasHeight,
  setCanvasWidth,
  setCanvasHeight,
}: {
  datas: { day: number; focusTimeYValues: number }[];
  selectedPeriod: 'weekly' | 'monthly';
  todayYYYYMMDD: number;
  canvasWidth: number;
  canvasHeight: number;
  setCanvasWidth: (width: number) => void;
  setCanvasHeight: (height: number) => void;
}) {
  const cellWidth =
    canvasWidth /
    (selectedPeriod === PERIOD.WEEKLY ? WEEKLY_DAYS : MONTHLY_DAYS);

  const { theme } = useTheme();

  return (
    <View
      style={{ flex: 1 }}
      onLayout={(e) => {
        setCanvasWidth(e.nativeEvent.layout.width);
        setCanvasHeight(e.nativeEvent.layout.height);
      }}
    >
      <Canvas
        style={{
          flex: 1,
        }}
      >
        <Group transform={[{ scaleY: -1 }, { translateY: -canvasHeight }]}>
          {datas.map((day, index) => {
            if (day.day > todayYYYYMMDD) {
              return null;
            }

            return (
              <Group key={day.day}>
                <RoundedRect
                  x={
                    index * cellWidth +
                    (cellWidth -
                      (selectedPeriod === PERIOD.MONTHLY
                        ? MONTHLY_RECT_WIDTH
                        : WEEKLY_RECT_WIDTH)) /
                      2
                  }
                  y={0}
                  width={
                    selectedPeriod === PERIOD.MONTHLY
                      ? MONTHLY_RECT_WIDTH
                      : WEEKLY_RECT_WIDTH
                  }
                  height={canvasHeight * day.focusTimeYValues}
                  color={theme.colors.pages.timer.slider.text.primary}
                  r={
                    selectedPeriod === PERIOD.MONTHLY
                      ? MONTHLY_RECT_RADIUS
                      : WEEKLY_RECT_RADIUS
                  }
                />
              </Group>
            );
          })}
        </Group>
      </Canvas>
    </View>
  );
}
