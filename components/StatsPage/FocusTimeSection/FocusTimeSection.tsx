import { sessionService } from '@/services/SessionService';
import { useSessionCache } from '@/store/sessionCache';
import { baseTokens, Theme } from '@/styles';
import { clamp } from '@/utils/math';
import { timestampToDayKey } from '@/utils/time';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, View } from 'react-native';
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

const yValues = ['≥10h', '8h', '6h', '4h', '2h', '0h'];

export default function FocusTimeSection({ theme }: { theme: Theme }) {
  const { t } = useTranslation('stats');
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
  const [isLoading, setIsLoading] = useState(true);

  const sessions = useSessionCache((s) => s.sessionCache);

  const [canvasWidth, setCanvasWidth] = useState(0);
  const [canvasHeight, setCanvasHeight] = useState(0);
  const [textHeight, setTextHeight] = useState(10);

  const todayYYYYMMDD = timestampToDayKey(new Date().getTime());

  useEffect(() => {
    const fetchFocusTimeLogs = async () => {
      setIsLoading(true);
      try {
        const firstDay = period.days[0];
        const lastDay = period.days[period.days.length - 1];
        const startKey = new Date(
          Number(firstDay.substring(0, 4)),
          Number(firstDay.substring(4, 6)) - 1,
          Number(firstDay.substring(6, 8)),
        ).getTime();
        const endKey = new Date(
          Number(lastDay.substring(0, 4)),
          Number(lastDay.substring(4, 6)) - 1,
          Number(lastDay.substring(6, 8)),
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
      } catch {
        // 에러 시에도 빈 데이터로 설정
        const emptyData = period.days.map((day) => ({
          day: Number(day),
          focusTimeYValues: 0.02,
        }));
        setDatas(emptyData);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFocusTimeLogs();
  }, [sessions, selectedPeriod, baseDateMs]);

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
            {t('cumulativeFocusTimeTitle')}
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
        {isLoading ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <ActivityIndicator
              size="small"
              color={theme.colors.text.secondary}
            />
          </View>
        ) : (
          <>
            <YValues theme={theme} textHeight={textHeight} yValues={yValues} />
            <View style={{ flex: 1 }}>
              <GraphCanvas
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
          </>
        )}
      </View>
    </View>
  );
}
