import { Theme } from '@/styles';
import { Canvas, Circle, Group, Line, vec } from '@shopify/react-native-skia';
import { scale } from 'react-native-size-matters';
import { PERIOD } from '../../constants/period';

const WEEKLY_CIRCLE_RADIUS = scale(2);
const MONTHLY_CIRCLE_RADIUS = scale(1.5);
const WEEKLY_STROKE_WIDTH = scale(1.2);
const MONTHLY_STROKE_WIDTH = scale(1);

const WEEKLY_DAYS = 7;
const MONTHLY_DAYS = 30;

export default function GraphCanvas({
  theme,
  datas,
  selectedPeriod,
  todayYYYYMMDD,
  canvasWidth,
  canvasHeight,
  setCanvasWidth,
  setCanvasHeight,
}: {
  theme: Theme;
  datas: { day: number; entropyScore: number }[];
  selectedPeriod: 'weekly' | 'monthly';
  todayYYYYMMDD: number;
  canvasWidth: number;
  canvasHeight: number;
  setCanvasWidth: (width: number) => void;
  setCanvasHeight: (height: number) => void;
}) {
  return (
    <Canvas
      style={{
        flex: 1,
      }}
      onLayout={(e) => {
        setCanvasWidth(e.nativeEvent.layout.width);
        setCanvasHeight(e.nativeEvent.layout.height);
      }}
    >
      <Group transform={[{ scaleY: -1 }, { translateY: -canvasHeight }]}>
        {datas.map((day, index) => {
          if (day.day > todayYYYYMMDD) {
            return null;
          }

          const hasNext =
            !!datas[index + 1] && datas[index].day < todayYYYYMMDD;

          return (
            <Group key={day.day}>
              <Circle
                cx={
                  index *
                    (canvasWidth /
                      (selectedPeriod === PERIOD.WEEKLY
                        ? WEEKLY_DAYS
                        : MONTHLY_DAYS)) +
                  canvasWidth /
                    (selectedPeriod === PERIOD.WEEKLY
                      ? WEEKLY_DAYS
                      : MONTHLY_DAYS) /
                    2
                }
                cy={
                  (canvasHeight - canvasHeight / 10) * day.entropyScore +
                  canvasHeight / 10 / 2
                }
                r={
                  selectedPeriod === PERIOD.WEEKLY
                    ? WEEKLY_CIRCLE_RADIUS
                    : MONTHLY_CIRCLE_RADIUS
                }
                color={theme.colors.pages.timer.slider.text.primary}
              />
              {hasNext && (
                <Line
                  p1={vec(
                    index *
                      (canvasWidth /
                        (selectedPeriod === PERIOD.WEEKLY
                          ? WEEKLY_DAYS
                          : MONTHLY_DAYS)) +
                      canvasWidth /
                        (selectedPeriod === PERIOD.WEEKLY
                          ? WEEKLY_DAYS
                          : MONTHLY_DAYS) /
                        2,
                    (canvasHeight - canvasHeight / 10) * day.entropyScore +
                      canvasHeight / 10 / 2,
                  )}
                  p2={vec(
                    (index + 1) *
                      (canvasWidth /
                        (selectedPeriod === PERIOD.WEEKLY
                          ? WEEKLY_DAYS
                          : MONTHLY_DAYS)) +
                      canvasWidth /
                        (selectedPeriod === PERIOD.WEEKLY
                          ? WEEKLY_DAYS
                          : MONTHLY_DAYS) /
                        2,
                    (canvasHeight - canvasHeight / 10) *
                      datas[index + 1].entropyScore +
                      canvasHeight / 10 / 2,
                  )}
                  color={theme.colors.pages.timer.slider.text.primary}
                  strokeWidth={
                    selectedPeriod === PERIOD.WEEKLY
                      ? WEEKLY_STROKE_WIDTH
                      : MONTHLY_STROKE_WIDTH
                  }
                />
              )}
            </Group>
          );
        })}
      </Group>
    </Canvas>
  );
}
