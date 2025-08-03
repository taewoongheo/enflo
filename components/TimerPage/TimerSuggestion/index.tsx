import Typography from '@/components/common/Typography';
import { Theme } from '@/styles';
import { formatMsToMMSS } from '@/utils/time';
import { TFunction } from 'i18next';
import { useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { scale } from 'react-native-size-matters';

function TimerSuggestion({
  theme,
  time,
  isRunning,
  setIsRunning,
  t,
}: {
  theme: Theme;
  time: number;
  isRunning: boolean;
  setIsRunning: (isRunning: boolean) => void;
  t: TFunction;
}) {
  const [leftTime, setLeftTime] = useState(time);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const endTimeRef = useRef<number | null>(null);
  const prevSecRef = useRef<number | null>(null);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setLeftTime(time);
  }, [time]);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    endTimeRef.current = Date.now() + leftTime;
    prevSecRef.current = Math.floor(leftTime / 1000);

    const tick = () => {
      const diff = endTimeRef.current! - Date.now();
      const nextSec = Math.floor(diff / 1000);

      const safeEndMs = Math.max(0, endTimeRef.current! - Date.now());
      if (safeEndMs === 0) {
        clearInterval(intervalRef.current!);
        intervalRef.current = null;
        setLeftTime(0);
        setIsRunning(false);
        return;
      }

      if (nextSec !== prevSecRef.current) {
        prevSecRef.current = nextSec;
        setLeftTime(nextSec * 1000);
      }
    };

    tick();
    intervalRef.current = setInterval(tick, 250);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning]);

  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'baseline',
        }}
      >
        <Text
          testID="timer"
          style={{
            fontSize: scale(70),
            color: theme.colors.pages.timer.slider.text.primary,
            fontFamily: 'Pretendard-Semibold',
          }}
        >
          {formatMsToMMSS(leftTime)}
        </Text>
        {/* <Typography
          variant="body1Regular"
          style={{
            color: theme.colors.pages.timer.slider.text.secondary,
          }}
        >
          {t('minutes')}
        </Typography> */}
      </View>
      <Typography
        variant="body1Regular"
        style={{
          color: theme.colors.pages.timer.slider.text.secondary,
          textAlign: 'center',
        }}
      >
        {t('suggestions')}
      </Typography>
    </>
  );
}

export default TimerSuggestion;
