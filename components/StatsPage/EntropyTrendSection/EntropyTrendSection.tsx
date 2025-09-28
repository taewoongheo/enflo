import { entropyService } from '@/services/EntropyService';
import { useEntropyStore } from '@/store/entropyStore';
import { useSessionCache } from '@/store/sessionCache';
import { baseTokens, Theme } from '@/styles';
import { log } from '@/utils/log';
import { normalizeScoreToEntropy } from '@/utils/score';
import {
  timestampToDayKey,
  timestampToMonthKey,
  timestampToWeekKey,
} from '@/utils/time';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, View } from 'react-native';
import { scale } from 'react-native-size-matters';
import Typography from '../../common/Typography';
import { PERIOD } from '../constants/period';
import usePeriodNavigation from '../hooks/usePeriodNavigation';
import GraphCanvas from './components/GraphCanvas';
import PeriodNavigator from './components/PeriodNavigator';
import PeriodToggle from './components/PeriodToggle';
import XValues from './components/XValues';
import YValues from './components/YValues';

type GraphData = {
  day: number;
  entropyScore: number;
};

const yValues = [0, 25, 50, 75, 100];

export default function EntropyTrendSection({ theme }: { theme: Theme }) {
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

  const entropyScore = useEntropyStore((s) => s.entropyScore);

  const todayYYYYMMDD = timestampToDayKey(new Date().getTime());

  useEffect(() => {
    const fetchEntropyLogs = async () => {
      log(`fetchEntropyLogs: ${entropyScore}`);
      setIsLoading(true);
      try {
        const key =
          selectedPeriod === PERIOD.WEEKLY
            ? timestampToWeekKey(baseDateMs)
            : timestampToMonthKey(baseDateMs);

        const logs = await entropyService.getEntropyLogs(selectedPeriod, key);

        if (!logs) {
          const emptyData =
            selectedPeriod === PERIOD.WEEKLY
              ? period.days.map((day) => ({
                  day: Number(day),
                  entropyScore: 0,
                }))
              : period.days.map((day) => ({
                  day: Number(day),
                  entropyScore: 0,
                }));
          setDatas(emptyData);
          return;
        }

        const parsedDatas: GraphData[] = [];

        log(`logs: ${JSON.stringify(logs)}`);

        // get max entropy score for each day
        period.days.map((day) => {
          const matchedLogs = logs.filter((log) => log.dayKey === Number(day));
          const maxScore = matchedLogs.reduce(
            (max, cur) => Math.max(max, cur.entropyScore),
            0,
          );

          parsedDatas.push({
            day: Number(day),
            entropyScore: Number(normalizeScoreToEntropy(maxScore)),
          });
        });

        log(`parsedDatas: ${JSON.stringify(parsedDatas)}`);

        setDatas(parsedDatas);
      } catch {
        const emptyData = period.days.map((day) => ({
          day: Number(day),
          entropyScore: 0,
        }));
        setDatas(emptyData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEntropyLogs();
  }, [sessions, selectedPeriod, baseDateMs, entropyScore]);

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
            {t('entropyTrendTitle')}
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
          </>
        )}
      </View>
    </View>
  );
}
