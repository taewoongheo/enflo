import i18n from '@/i18n';
import Session from '@/models/Session';
import { baseTokens } from '@/styles/baseTokens';
import { Theme } from '@/styles/themes';
import { getToday } from '@/utils/time';
import { TFunction } from 'i18next';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { scale } from 'react-native-size-matters';
import { generateSuggestion } from '../utils/generateSuggestion';
import { generateTimeStatus } from '../utils/generateTimeStatus';
import { ChartPoint, mapFocusToY } from '../utils/mapDropToY';
import { toUserMessage } from '../utils/toUserMessage';
import CumulateTimes from './CumulateTimes';
import Graph from './Graph';
import Trends from './Trends';
import UserMessage from './UserMessage';

export const GRAPH_HEIGHT = scale(120);
export const CIRCLE_RADIUS = scale(4);

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

  const [userMessage, setUserMessage] = useState<string>(t('noDataMessage'));

  const [focusGraphYValues, setFocusGraphYValues] = useState<ChartPoint[] | []>(
    [],
  );
  const maxTime = useRef<number>(0);

  const [canvasWidth, setCanvasWidth] = useState<number>(0);
  const [cellSize, setCellSize] = useState<number>(0);

  const totalNetFocusMsMemo = useMemo(() => session.totalNetFocusMs, [session]);

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

    maxTime.current = newYValues[newYValues.length - 1].time;
    setFocusGraphYValues(newYValues);
  }, [totalNetFocusMsMemo]);

  return (
    <>
      <Trends theme={theme} t={t} />
      <CumulateTimes session={session} theme={theme} t={t} />
      <UserMessage theme={theme} t={t} userMessage={userMessage} />
      <Graph
        theme={theme}
        t={t}
        focusGraphYValues={focusGraphYValues}
        setCanvasWidth={setCanvasWidth}
        cellSize={cellSize}
        CIRCLE_RADIUS={CIRCLE_RADIUS}
        maxTime={maxTime.current}
      />
    </>
  );
}

export const InfoLayout = ({ children }: { children: React.ReactNode }) => {
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
