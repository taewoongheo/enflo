import Typography from '@/components/common/Typography';
import { Theme } from '@/styles/themes';
import { Canvas, Circle, Group, Line, vec } from '@shopify/react-native-skia';
import { TFunction } from 'i18next';
import { View } from 'react-native';
import { scale } from 'react-native-size-matters';
import { ChartPoint } from '../utils/mapDropToY';
import { GRAPH_HEIGHT } from './const';
import InfoLayout from './InfoLayout';

const GRAPH_HEIGHT_WITH_PADDING = scale(20);
const GRAPH_TEXT_PADDING = scale(35);

// TODO: 그래프 길이가 최소 20분 이상은 되어야 할 듯

export default function Graph({
  theme,
  t,
  focusGraphYValues,
  setCanvasWidth,
  cellSize,
  CIRCLE_RADIUS,
  maxTime,
}: {
  theme: Theme;
  t: TFunction;
  focusGraphYValues: ChartPoint[];
  setCanvasWidth: (width: number) => void;
  cellSize: number;
  CIRCLE_RADIUS: number;
  maxTime: number;
}) {
  return (
    <InfoLayout>
      <Typography
        variant="body1Bold"
        style={{ color: theme.colors.pages.timer.slider.text.secondary }}
      >
        {t('focusGraph')}
      </Typography>
      <View
        style={{
          flex: 1,
          height: GRAPH_HEIGHT + GRAPH_HEIGHT_WITH_PADDING + GRAPH_TEXT_PADDING,
        }}
        onLayout={(e) => {
          setCanvasWidth(e.nativeEvent.layout.width);
        }}
      >
        {focusGraphYValues.length === 1 ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Typography
              variant="body1Regular"
              style={{ color: theme.colors.pages.timer.slider.text.primary }}
            >
              {t('noData')}
            </Typography>
          </View>
        ) : (
          <>
            <Canvas style={{ flex: 1 }}>
              <Group
                transform={[
                  { scaleY: -1 },
                  {
                    translateY: -(GRAPH_HEIGHT + GRAPH_HEIGHT_WITH_PADDING - 5),
                  },
                ]}
              >
                {focusGraphYValues.map((el, idx) => {
                  const hasNext = focusGraphYValues[idx + 1];

                  return (
                    <Group key={el.time}>
                      <Circle
                        cx={cellSize * idx + cellSize / 2}
                        cy={el.y}
                        r={CIRCLE_RADIUS}
                        color={theme.colors.pages.timer.slider.text.primary}
                      />
                      {hasNext && (
                        <Line
                          p1={vec(cellSize * idx + cellSize / 2, el.y)}
                          p2={vec(
                            cellSize * (idx + 1) + cellSize / 2,
                            hasNext.y,
                          )}
                          color={theme.colors.pages.timer.slider.text.primary}
                          strokeWidth={2}
                        />
                      )}
                    </Group>
                  );
                })}
              </Group>
            </Canvas>
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'space-between',
              }}
            >
              {focusGraphYValues.map((el) => {
                if (el.time % Math.floor(maxTime / 2) === 0) {
                  return (
                    <View
                      key={el.time}
                      style={{
                        width: cellSize,
                        alignItems: 'center',
                      }}
                    >
                      <Typography
                        variant="body1Regular"
                        style={{
                          color: theme.colors.pages.timer.slider.text.primary,
                        }}
                      >
                        {el.time}
                      </Typography>
                    </View>
                  );
                }

                return null;
              })}
            </View>
          </>
        )}
      </View>
    </InfoLayout>
  );
}
