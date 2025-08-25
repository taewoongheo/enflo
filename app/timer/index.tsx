import { ContentLayout } from '@/components/common/ContentLayout';
import ContentLayoutWithBack from '@/components/common/ContentLayoutWithBack';
import {
  ScrollColorBackground,
  TimerHeader,
  TimerPlayButton,
  TimerSuggestion,
  TimerTrends,
  TimerTunerSlider,
} from '@/components/TimerPage';
import useBackgroundEvent from '@/components/TimerPage/hooks/useBackgroundEvent';
import usePauseEvent from '@/components/TimerPage/hooks/usePauseEvent';
import useScrollEvent from '@/components/TimerPage/hooks/useScrollEvent';
import { useTheme } from '@/contexts/ThemeContext';
import Session from '@/models/Session';
import TimerSession from '@/models/TimerSession';
import { sessionService } from '@/services/SessionService';
import { timerService } from '@/services/TimerService';
import { useEntropyStore } from '@/store/entropyStore';
import { useSessionCache } from '@/store/sessionCache';
import { baseTokens, Theme } from '@/styles';
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

  const session = useSessionCache((s) => s.sessionCache[sessionId as string]);

  useEffect(() => {
    if (session) {
      return;
    }

    router.back();
  }, [session]);

  if (!session) {
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
  const [time, setTime] = useState(1 * 60 * 1000);
  const [isRunning, setIsRunning] = useState(false);

  const timerSession = useRef<TimerSession | null>(null);

  const updateEntropyScore = useEntropyStore((s) => s.updateEntropyScore);

  // timer session disturbance data
  const { screenBackgroundCount, resetBackgroundEvent } = useBackgroundEvent(
    timerSession ?? null,
  );
  const { scrollInteractionCount, handleScroll, resetScrollEvent } =
    useScrollEvent(isRunning);
  const { pauseEvent, resetPauseEvent } = usePauseEvent(
    isRunning,
    timerSession ?? null,
  );

  useEffect(() => {
    handleTimerEnd();

    resetBackgroundEvent();
    resetScrollEvent();
    resetPauseEvent();

    return () => {
      timerSession.current = null;
    };
  }, [time]);

  const handleTimerEnd = async () => {
    if (!timerSession.current) {
      return;
    }

    const snapShot = {
      timerSession: timerSession.current,
      endTs: Date.now(),
      screenBackgroundCount: [...screenBackgroundCount.current],
      scrollInteractionCount: [...scrollInteractionCount.current],
      pauseEvents: [...pauseEvent.current],
    };

    timerSession.current = null;

    try {
      const entropyScore = await timerService.calculateEntropy(snapShot);
      if (entropyScore) {
        updateEntropyScore(entropyScore);

        await sessionService.addTimerSession({
          sessionId: session.sessionId,
          timerSession: snapShot.timerSession,
        });
      }
    } catch (error) {
      console.error('entropy score 계산 중 오류 발생: ', error);
    }
  };

  const handleStartPauseToggle = async () => {
    if (!timerSession.current) {
      timerSession.current = await timerService.createTimerSession({
        sessionId: session.sessionId,
        startTs: Date.now(),
        targetDurationMs: time,
      });
      console.log('timerSession 생성');
    }

    setIsRunning(!isRunning);
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={styles.scrollView}
      onScroll={handleScroll}
      bounces={false}
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
        <View
          style={{
            marginVertical: baseTokens.spacing[5],
            marginBottom: baseTokens.spacing[7],
          }}
        >
          <TimerTrends session={session} t={t} theme={theme} />
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
    marginTop: baseTokens.spacing[4],
  },
});
