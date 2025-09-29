import {
  cancelSpecificNotification,
  scheduleNotificationAsync,
} from '@/app/_layout';
import {
  MINUTE_MS,
  NOTIFICATION_TRIGGER_PADDING_SECONDS,
} from '@/constants/time/time';
import { Theme } from '@/styles';
import { formatMsToMMSS } from '@/utils/time';
import { TFunction } from 'i18next';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { scale } from 'react-native-size-matters';
import { getTimerFinishAlertMessages } from '../constant/alert';

function TimerSuggestion({
  theme,
  time,
  isRunning,
  setIsRunning,
  _t,
  handleTimerEnd,
}: {
  theme: Theme;
  time: number;
  isRunning: boolean;
  setIsRunning: (isRunning: boolean) => void;
  _t: TFunction;
  handleTimerEnd: () => void;
}) {
  const [leftTime, setLeftTime] = useState(time);
  const { t } = useTranslation('timer');

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const endTimeRef = useRef<number | null>(null);
  const prevSecRef = useRef<number | null>(null);

  const notificationRef = useRef<string | null>(null);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setLeftTime(time);
  }, [time]);

  useEffect(() => {
    const startTimer = async () => {
      if (!isRunning) {
        if (notificationRef.current) {
          cancelSpecificNotification(notificationRef.current);
        }
        return;
      }

      // notification
      const alertMessages = getTimerFinishAlertMessages(t);
      const { title, message } =
        alertMessages[Math.floor(Math.random() * alertMessages.length)];

      const notificationIdentifier = await scheduleNotificationAsync({
        title: title(Math.floor(leftTime / MINUTE_MS)),
        body: message(Math.floor(leftTime / MINUTE_MS)),
        triggerSeconds: Math.max(
          NOTIFICATION_TRIGGER_PADDING_SECONDS,
          leftTime / 1000 - NOTIFICATION_TRIGGER_PADDING_SECONDS,
        ),
      });
      notificationRef.current = notificationIdentifier ?? null;

      endTimeRef.current = Date.now() + leftTime;
      prevSecRef.current = Math.floor(leftTime / 1000);

      const tick = () => {
        const diff = endTimeRef.current! - Date.now();
        const nextSec = Math.floor(diff / 1000);

        const safeEndMs = Math.max(0, endTimeRef.current! - Date.now());
        if (safeEndMs === 0) {
          handleTimerEnd();
          // TODO: add overshoot time logic

          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          setLeftTime(time);
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
    };

    startTimer();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (notificationRef.current) {
        cancelSpecificNotification(notificationRef.current);
        notificationRef.current = null;
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
            fontSize: scale(73),
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
      {/* <Typography
        variant="body1Regular"
        style={{
          color: theme.colors.pages.timer.slider.text.secondary,
          textAlign: 'center',
        }}
      >
        {t('suggestions')}
      </Typography> */}
    </>
  );
}

export default TimerSuggestion;
