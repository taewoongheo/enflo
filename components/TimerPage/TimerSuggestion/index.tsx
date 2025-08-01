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
  t,
}: {
  theme: Theme;
  time: number;
  isRunning: boolean;
  t: TFunction;
}) {
  const [timeLeft, setTimeLeft] = useState(time);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const endTimeRef = useRef<number | null>(null);
  const prevSecRef = useRef<number | null>(null);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setTimeLeft(time);
  }, [time]);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    // TODO: pause time 에 대해 다르게 계산해야됨
    endTimeRef.current = Date.now() + timeLeft;
    prevSecRef.current = Math.floor(timeLeft / 1000);

    const tick = () => {
      console.log('tick');

      const diff = endTimeRef.current! - Date.now();
      const nextSec = Math.floor(diff / 1000);

      if (nextSec <= 0) {
        clearInterval(intervalRef.current!);
        intervalRef.current = null;
        setTimeLeft(0);
        return;
      }

      if (nextSec !== prevSecRef.current) {
        prevSecRef.current = nextSec;
        setTimeLeft(nextSec * 1000);
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
          style={{
            fontSize: scale(70),
            color: theme.colors.pages.timer.slider.text.primary,
            fontFamily: 'Pretendard-Semibold',
          }}
        >
          {formatMsToMMSS(timeLeft)}
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
