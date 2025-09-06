import { sessionService } from '@/services/SessionService';
import { baseTokens, Theme } from '@/styles';
import { clamp } from '@/utils/math';
import { timestampToDayKey, yyyymmddToYyyyMmDd } from '@/utils/time';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { scale } from 'react-native-size-matters';
import Typography from '../../common/Typography';
import usePeriodNavigation from '../hooks/usePeriodNavigation';
import GraphCanvas from './components/GraphCanvas';
import PeriodNavigator from './components/PeriodNavigator';
import PeriodToggle from './components/PeriodToggle';
import XValues from './components/XValues';
import YValues from './components/YValues';

// focusTime: hour unit, 0~10 range
type GraphData = {
  day: number;
  focusTimeYValues: number;
};

const yValues = [10, 8, 6, 4, 2, 0];

export default function FocusTimeSection({ theme }: { theme: Theme }) {
  const {
    selectedPeriod,
    baseDateMs,
    period,
    isNextAvailable,
    handleTogglePeriod,
    handlePrev,
    handleNext,
  } = usePeriodNavigation();

  const [datas, setDatas] = useState<GraphData[]>([]);

  const [canvasWidth, setCanvasWidth] = useState(0);
  const [canvasHeight, setCanvasHeight] = useState(0);
  const [textHeight, setTextHeight] = useState(10);

  const todayYYYYMMDD = timestampToDayKey(new Date().getTime());

  useEffect(() => {
    const fetchFocusTimeLogs = async () => {
      try {
        const startKey = new Date(yyyymmddToYyyyMmDd(period.days[0])).getTime();
        const endKey = new Date(
          yyyymmddToYyyyMmDd(period.days[period.days.length - 1]),
        ).getTime();

        const timerSessions = await sessionService.getTimerSessionsByDateRange(
          startKey,
          endKey,
        );

        const parsedDatas: GraphData[] = [];

        period.days.forEach((day) => {
          const matchedTimerSessions = timerSessions.filter((timerSession) => {
            if (timerSession.endTs === null) {
              return false;
            }
            return timestampToDayKey(timerSession.endTs) === Number(day);
          });

          const totalFocusTime = matchedTimerSessions.reduce(
            (acc, timerSession) => acc + timerSession.targetDurationMs,
            0,
          );

          parsedDatas.push({
            day: Number(day),
            focusTimeYValues: clamp(
              Math.floor(totalFocusTime / (1000 * 60 * 60)) * 0.1,
              0.02,
              1,
            ),
          });
        });

        setDatas(parsedDatas);
      } catch (error) {
        console.error(error);
      }
    };
    fetchFocusTimeLogs();
  }, [selectedPeriod, baseDateMs]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.pages.main.sessionCard.background,
        borderColor: theme.colors.pages.main.sessionCard.border,
        borderWidth: scale(1),
        borderRadius: baseTokens.borderRadius.sm,
      }}
    >
      <View style={{ padding: baseTokens.spacing[3] }}>
        <View
          style={{
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
          }}
        >
          <Typography
            variant="body1Bold"
            style={{ color: theme.colors.text.primary }}
          >
            누적 몰입 시간
          </Typography>

          <PeriodToggle
            theme={theme}
            selectedPeriod={selectedPeriod}
            onToggle={handleTogglePeriod}
          />
        </View>

        <PeriodNavigator
          theme={theme}
          periodStr={`${period.first} - ${period.last}`}
          isNextAvailable={isNextAvailable}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      </View>

      <View
        style={{
          borderWidth: scale(0.3),
          borderColor: theme.colors.pages.main.sessionCard.border,
        }}
      />

      {/* Graph */}
      <View
        style={{
          height: textHeight * 12,
          marginTop: baseTokens.spacing[3],
          flexDirection: 'row',
          padding: baseTokens.spacing[3],
        }}
      >
        <YValues theme={theme} textHeight={textHeight} yValues={yValues} />
        <View style={{ flex: 1 }}>
          <GraphCanvas
            theme={theme}
            datas={datas}
            selectedPeriod={selectedPeriod}
            todayYYYYMMDD={todayYYYYMMDD}
            canvasWidth={canvasWidth}
            canvasHeight={canvasHeight}
            setCanvasWidth={setCanvasWidth}
            setCanvasHeight={setCanvasHeight}
          />
          <XValues
            theme={theme}
            period={period}
            datas={datas}
            selectedPeriod={selectedPeriod}
            canvasWidth={canvasWidth}
            setTextHeight={setTextHeight}
          />
        </View>
      </View>
    </View>
  );
}
