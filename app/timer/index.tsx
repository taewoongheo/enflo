import { ContentLayout } from '@/components/common/ContentLayout';
import ContentLayoutWithBack from '@/components/common/ContentLayoutWithBack';
import {
  ScrollColorBackground,
  TimerHeader,
  TimerPlayButton,
  TimerSuggestion,
  TimerTunerSlider,
} from '@/components/TimerPage';
import useBackgroundEvent from '@/components/TimerPage/hooks/useBackgroundEvent';
import usePauseEvent from '@/components/TimerPage/hooks/usePauseEvent';
import useScrollEvent from '@/components/TimerPage/hooks/useScrollEvent';
import useSession from '@/components/TimerPage/hooks/useSession';
import TimerInfo from '@/components/TimerPage/TimerInfo';
import { useTheme } from '@/contexts/ThemeContext';
import Session from '@/models/Session';
import TimerSession from '@/models/TimerSession';
import { useEntropyStore } from '@/store/entropyStore';
import { baseTokens, Theme } from '@/styles';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { TFunction } from 'i18next';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scale } from 'react-native-size-matters';

export default function Timer() {
  const router = useRouter();
  const { theme } = useTheme();
  const { sessionId } = useLocalSearchParams();
  const { t } = useTranslation('timer');

  const { session, isLoading } = useSession(sessionId as string);

  if (isLoading) {
    return (
      <View style={{ flex: 1 }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!session) {
    router.back();
    return null;
  }

  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
    >
      <ScrollColorBackground theme={theme} />
      <TimerContent theme={theme} session={session} t={t} />
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

  const timerSession = useRef<TimerSession | null>(null);

  const { updateEntropyScore } = useEntropyStore();

  // timer session disturbance data
  const { screenBackgroundCount, resetBackgroundEvent } =
    useBackgroundEvent(isRunning);
  const { scrollInteractionCount, handleScroll, resetScrollEvent } =
    useScrollEvent(isRunning);
  const { pauseEvent, resetPauseEvent } = usePauseEvent(
    isRunning,
    timerSession.current?.startTs ?? null,
  );

  useEffect(() => {
    handleTimerEnd();

    resetBackgroundEvent();
    resetScrollEvent();
    resetPauseEvent();
  }, [time]);

  const handleTimerEnd = () => {
    if (timerSession.current) {
      timerSession.current.endTs = Date.now();
      const entropyScore = timerSession.current.calculateEntropy({
        endTs: Date.now(),
        screenBackgroundCount: screenBackgroundCount.current,
        scrollInteractionCount: scrollInteractionCount.current,
        pauseEvents: pauseEvent.current,
      });

      if (entropyScore) {
        updateEntropyScore(entropyScore);
        session.addTimerSession(timerSession.current);
      }
    }

    timerSession.current = new TimerSession({
      sessionId: session.sessionId,
      targetDurationMs: time,
      // TODO: sessionSequenceInDay
    });
  };

  const handleStartPauseToggle = () => {
    if (!timerSession.current) {
      console.error('no timer session');
      return;
    }

    if (!timerSession.current.startTs) {
      timerSession.current.startTs = Date.now();
    }

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
        {/* Timer Slider */}
        <ContentLayoutWithBack
          color={theme.colors.pages.timer.slider.text.primary}
        >
          <TimerHeader theme={theme} session={session!} t={t} />

          <View style={styles.timerContentContainer}>
            <TimerSuggestion
              theme={theme}
              time={time}
              _t={t}
              isRunning={isRunning}
              setIsRunning={setIsRunning}
              handleTimerEnd={handleTimerEnd}
            />
            <TimerTunerSlider
              theme={theme}
              isRunning={isRunning}
              setTime={setTime}
            />
            <TimerPlayButton
              theme={theme}
              isRunning={isRunning}
              handleStartPauseToggle={handleStartPauseToggle}
            />
          </View>
        </ContentLayoutWithBack>
      </View>
      {/* Timer Info */}
      <ContentLayout>
        <View style={{ marginVertical: baseTokens.spacing[5] }}>
          <TimerInfo session={session} t={t} theme={theme} />
        </View>
      </ContentLayout>
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
