import { entropyService } from '@/services/EntropyService';
import { baseTokens, Theme } from '@/styles';
import { normalizeScoreToEntropy } from '@/utils/score';
import {
  timestampToDayKey,
  timestampToMonthKey,
  timestampToWeekKey,
  yyyymmddToMdSlash,
} from '@/utils/time';
import { Canvas, Circle, Group, Line, vec } from '@shopify/react-native-skia';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { scale } from 'react-native-size-matters';
import Typography from '../../common/Typography';
import PeriodNavigator from './components/PeriodNavigator';
import PeriodToggle from './components/PeriodToggle';
import { PERIOD } from './constants/period';
import usePeriodNavigation from './hooks/usePeriodNavigation';

type GraphData = {
  day: number;
  entropyScore: number;
};

const yValues = [0, 25, 50, 75, 100];
const WEEKLY_CIRCLE_RADIUS = scale(2);
const MONTHLY_CIRCLE_RADIUS = scale(1.5);
const WEEKLY_STROKE_WIDTH = scale(1.2);
const MONTHLY_STROKE_WIDTH = scale(1);

const WEEKLY_DAYS = 7;
const MONTHLY_DAYS = 30;

const WEEKLY_DAYS_LABEL_DIVIDE = 5;

export default function EntropyTrendSection({ theme }: { theme: Theme }) {
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
    const fetchEntropyLogs = async () => {
      try {
        console.log('기간: ', selectedPeriod);
        console.log('기준 날짜: ', timestampToDayKey(baseDateMs));

        const key =
          selectedPeriod === PERIOD.WEEKLY
            ? timestampToWeekKey(baseDateMs)
            : timestampToMonthKey(baseDateMs);

        const logs = await entropyService.getEntropyLogs(selectedPeriod, key);

        if (!logs) {
          return selectedPeriod === PERIOD.WEEKLY
            ? period.days.map((day) => ({
                day,
                entropyScore: 0,
              }))
            : period.days.map((day) => ({
                day,
                entropyScore: 0,
              }));
        }

        console.log('=======logs start======');
        for (const log of logs) {
          console.log(log.dayKey + ': ', log.entropyScore);
        }
        console.log('=======logs end======');

        const parsedDatas: GraphData[] = [];

        // 각 날짜마다 가장 높은 엔트로피를 뽑아야됨
        period.days.map((day) => {
          console.log('day:', day);
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

        console.log(parsedDatas);

        setDatas(parsedDatas);
      } catch (error) {
        console.error(error);
      }
    };
    fetchEntropyLogs();
  }, [selectedPeriod, baseDateMs]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.pages.main.sessionCard.background,
        borderColor: theme.colors.pages.main.sessionCard.border,
        borderWidth: scale(1),
        borderRadius: baseTokens.borderRadius.sm,
        // padding: baseTokens.spacing[3],
      }}
    >
      {/* 헤더: 타이틀 + 주/월 토글 */}
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
            엔트로피 변화
          </Typography>

          <PeriodToggle
            theme={theme}
            selectedPeriod={selectedPeriod}
            onToggle={handleTogglePeriod}
          />
        </View>

        {/* 기간 내비 + 라벨 */}
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

      {/* TODO: 실제 그래프 영역 */}
      <View
        style={{
          height: textHeight * 12,
          marginTop: baseTokens.spacing[3],
          flexDirection: 'row',
          padding: baseTokens.spacing[3],
        }}
      >
        <View
          style={{
            justifyContent: 'space-between',
            marginBottom: textHeight,
          }}
        >
          {yValues.map((value) => {
            return (
              <View key={value}>
                <Typography
                  variant="label"
                  style={{
                    color: theme.colors.text.primary,
                    marginRight: baseTokens.spacing[1],
                  }}
                >
                  {normalizeScoreToEntropy(value)}
                </Typography>
              </View>
            );
          })}
        </View>
        <View style={{ flex: 1 }}>
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
                          (canvasHeight - canvasHeight / 10) *
                            day.entropyScore +
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
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              overflow: 'hidden',
            }}
          >
            {datas.map((day) => {
              if (
                selectedPeriod === PERIOD.MONTHLY &&
                day.day % WEEKLY_DAYS_LABEL_DIVIDE !== 0
              ) {
                return null;
              }

              return (
                <View
                  key={day.day}
                  style={{
                    width:
                      canvasWidth /
                      (selectedPeriod === PERIOD.WEEKLY
                        ? WEEKLY_DAYS
                        : period.days.length / WEEKLY_DAYS_LABEL_DIVIDE),
                    alignItems: 'center',
                  }}
                  onLayout={(e) => setTextHeight(e.nativeEvent.layout.height)}
                >
                  <Typography
                    variant="label"
                    style={{
                      color: theme.colors.text.primary,
                    }}
                  >
                    {yyyymmddToMdSlash(String(day.day))}
                  </Typography>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
}
