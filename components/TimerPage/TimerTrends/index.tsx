import CumulateTimes from '@/components/TimerPage/TimerTrends/CumulateTimes';
import Graph from '@/components/TimerPage/TimerTrends/Graph';
import Trends from '@/components/TimerPage/TimerTrends/Trends';
import UserMessage from '@/components/TimerPage/TimerTrends/UserMessage';
import i18n from '@/i18n';
import Session from '@/models/Session';
import { Theme } from '@/styles/themes';
import { getToday } from '@/utils/time';
import { TFunction } from 'i18next';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { generateSuggestion } from '../utils/generateSuggestion';
import { generateTimeStatus } from '../utils/generateTimeStatus';
import { ChartPoint, mapFocusToY } from '../utils/mapDropToY';
import { toUserMessage } from '../utils/toUserMessage';
import { CIRCLE_RADIUS, GRAPH_HEIGHT } from './const';

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

    const timeStatus = generateTimeStatus(session, 10);
    const yValues = mapFocusToY(timeStatus);

    const newYValues = yValues.map((el) => ({
      ...el,
      y: (GRAPH_HEIGHT / 100) * el.y,
    }));

    setFocusGraphYValues(newYValues);
  }, [session.totalNetFocusMs]);

  return (
    <>
      <Trends theme={theme} t={t} />
      <CumulateTimes
        totalNetFocusMs={session.totalNetFocusMs}
        theme={theme}
        t={t}
      />
      <UserMessage theme={theme} t={t} userMessage={userMessage} />
      <Graph
        theme={theme}
        t={t}
        focusGraphYValues={focusGraphYValues}
        setCanvasWidth={setCanvasWidth}
        cellSize={cellSize}
        CIRCLE_RADIUS={CIRCLE_RADIUS}
      />
    </>
  );
}

export default TimerTrends;
