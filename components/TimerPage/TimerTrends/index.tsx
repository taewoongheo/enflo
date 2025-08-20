import Typography from '@/components/common/Typography';
import i18n from '@/i18n';
import Session from '@/models/Session';
import { baseTokens } from '@/styles/baseTokens';
import { Theme } from '@/styles/themes';
import { formatMsToTime, getToday } from '@/utils/time';
import { Canvas, Circle, Group, Line, vec } from '@shopify/react-native-skia';
import { TFunction } from 'i18next';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { scale } from 'react-native-size-matters';
import { generateSuggestion } from '../utils/generateSuggestion';
import { generateTimeStatus } from '../utils/generateTimeStatus';
import { ChartPoint, mapFocusToY } from '../utils/mapDropToY';
import { toUserMessage } from '../utils/toUserMessage';

const GRAPH_HEIGHT = scale(130);
const GRAPH_HEIGHT_WITH_PADDING = scale(20);
const CIRCLE_RADIUS = scale(3);

function TimerTrends({
  session,
  t,
  theme,
}: {
  session: Session;
  t: TFunction;
  theme: Theme;
}) {
  const { t: tTimer } = useTranslation('suggestion');

  const [userMessage, setUserMessage] = useState<string | null>(null);

  const [focusGraphYValues, setFocusGraphYValues] = useState<ChartPoint[] | []>(
    [],
  );
  const lastTime = useRef<number>(0);

  const [canvasWidth, setCanvasWidth] = useState<number>(0);
  const [cellSize, setCellSize] = useState<number>(0);

  useEffect(() => {
    if (canvasWidth && focusGraphYValues.length > 0) {
      setCellSize(canvasWidth / focusGraphYValues.length);
    }
  }, [canvasWidth, focusGraphYValues.length]);

  useEffect(() => {
    setUserMessage(
      toUserMessage(
        generateSuggestion(session),
        getToday(i18n.language),
        tTimer,
      ),
    );

    const timeStatus = generateTimeStatus(session, 5);
    let yValues = mapFocusToY(timeStatus);

    yValues = [{ time: 0, y: 0 }, ...yValues];

    const newYValues = yValues.map((el) => ({
      ...el,
      y: (GRAPH_HEIGHT / 100) * el.y,
    }));

    lastTime.current = newYValues[newYValues.length - 1].time;
    setFocusGraphYValues(newYValues);
  }, [session.totalNetFocusMs]);

  return (
    <>
      <InfoLayout>
        <Typography
          variant="title2Bold"
          style={{ color: theme.colors.pages.timer.slider.text.primary }}
        >
          {t('trends')}
        </Typography>
      </InfoLayout>
      <InfoLayout>
        <Typography
          variant="body1Bold"
          style={{ color: theme.colors.pages.timer.slider.text.secondary }}
        >
          {t('totalFocusTime')}
        </Typography>
        <Typography
          variant="body1Regular"
          style={{ color: theme.colors.pages.timer.slider.text.primary }}
        >
          {formatMsToTime(session.totalNetFocusMs)}
        </Typography>
      </InfoLayout>
      <InfoLayout>
        <Typography
          variant="body1Bold"
          style={{ color: theme.colors.pages.timer.slider.text.secondary }}
        >
          {t('focusSuggestion')}
        </Typography>
        <Typography
          variant="body1Regular"
          style={{ color: theme.colors.pages.timer.slider.text.primary }}
        >
          {userMessage}
        </Typography>
      </InfoLayout>
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
            height: GRAPH_HEIGHT + GRAPH_HEIGHT_WITH_PADDING + 40,
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
                      translateY: -(
                        GRAPH_HEIGHT +
                        GRAPH_HEIGHT_WITH_PADDING -
                        5
                      ),
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
                  if (el.time % Math.floor(lastTime.current / 2) === 0) {
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
    </>
  );
}

const InfoLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <View
      style={{
        marginBottom: baseTokens.spacing[4],
      }}
    >
      {children}
    </View>
  );
};

export default TimerTrends;
