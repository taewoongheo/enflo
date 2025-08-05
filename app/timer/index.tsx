import ContentLayoutWithBack from '@/components/common/ContentLayoutWithBack';
import {
  ScrollColorBackground,
  TimerHeader,
  TimerPlayButton,
  TimerSuggestion,
  TimerTunerSlider,
} from '@/components/TimerPage';
import useBackgroundEvent from '@/components/TimerPage/hooks/useBackgroundEvent';
import useScrollEvent from '@/components/TimerPage/hooks/useScrollEvent';
import useSession from '@/components/TimerPage/hooks/useSession';
import { useTheme } from '@/contexts/ThemeContext';
import Session from '@/models/Session';
import { baseTokens, Theme } from '@/styles';
import { PauseEvent } from '@/types/interruptEvent';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { TFunction } from 'i18next';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scale } from 'react-native-size-matters';

export default function Timer() {
  const router = useRouter();
  const { theme } = useTheme();
  const { sessionId } = useLocalSearchParams();
  const { t } = useTranslation('timer');

  const { session, isLoading } = useSession(sessionId as string);

  if (!isLoading && !session) {
    router.back();
    return null;
  }

  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
    >
      <ScrollColorBackground theme={theme} />
      <TimerContent theme={theme} session={session!} t={t} />
    </SafeAreaView>
  );
}

function TimerContent({
  theme,
  session,
  t,
}: {
  theme: Theme;
  session: Session;
  t: TFunction;
}) {
  const [time, setTime] = useState(5 * 60 * 1000);
  const [isRunning, setIsRunning] = useState(false);

  // timer session disturbance data
  const { screenBackgroundCount } = useBackgroundEvent(isRunning);
  const { scrollInteractionCount, handleScroll } = useScrollEvent(isRunning);

  const pauseEvent = useRef<PauseEvent[]>([]);
  const pauseStartTime = useRef<number | null>(null);

  const timerStartedOnce = useRef<boolean>(false);

  useEffect(() => {
    timerStartedOnce.current = false;
    pauseEvent.current = [];
    pauseStartTime.current = null;

    screenBackgroundCount.current = [];
    scrollInteractionCount.current = [];

    console.log('changedTime - timerStartedOnce: ', timerStartedOnce.current);
    console.log('changedTime - pauseEvent: ', pauseEvent.current);
    console.log('changedTime - pauseStartTime: ', pauseStartTime.current);
  }, [time]);

  // puase event
  useEffect(() => {
    if (!timerStartedOnce.current) {
      return;
    }

    if (isRunning) {
      if (!pauseStartTime.current) {
        return;
      }

      const now = Date.now();
      pauseEvent.current.push({
        startTs: pauseStartTime.current,
        endTs: now,
        durationMs: now - pauseStartTime.current,
      });

      pauseStartTime.current = null;

      return;
    }

    pauseStartTime.current = Date.now();
  }, [isRunning]);

  const handlePauseTimer = () => {
    timerStartedOnce.current = true;
    setIsRunning(!isRunning);
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={styles.scrollView}
      onScroll={handleScroll}
    >
      <View
        style={[
          styles.timerContainer,
          {
            backgroundColor: theme.colors.pages.timer.slider.background,
            borderRadius: baseTokens.borderRadius.xl,
          },
        ]}
      >
        <ContentLayoutWithBack
          color={theme.colors.pages.timer.slider.text.primary}
        >
          <TimerHeader theme={theme} session={session!} t={t} />

          <View style={styles.timerContentContainer}>
            <TimerSuggestion
              theme={theme}
              time={time}
              t={t}
              isRunning={isRunning}
              setIsRunning={setIsRunning}
            />
            <TimerTunerSlider
              theme={theme}
              isRunning={isRunning}
              setTime={setTime}
            />
            <TimerPlayButton
              theme={theme}
              isRunning={isRunning}
              handlePauseTimer={handlePauseTimer}
            />
          </View>
        </ContentLayoutWithBack>
      </View>
      {/* TODO: session info content here */}
      {/* <View style={{ flex: 1, backgroundColor: 'red' }}></View> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  timerContainer: {
    flex: 1,
    paddingBottom: scale(10),
  },
  timerContentContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: baseTokens.spacing[2],
    marginTop: baseTokens.spacing[6],
  },
});
