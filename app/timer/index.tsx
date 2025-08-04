import ContentLayoutWithBack from '@/components/common/ContentLayoutWithBack';
import {
  ScrollColorBackground,
  TimerHeader,
  TimerPlayButton,
  TimerSuggestion,
  TimerTunerSlider,
} from '@/components/TimerPage';
import useBackgroundEvents from '@/components/TimerPage/hooks/useBackgroundEvents';
import useSession from '@/components/TimerPage/hooks/useSession';
import { useTheme } from '@/contexts/ThemeContext';
import { baseTokens, Theme } from '@/styles';
import { ScrollInteractionEvent } from '@/types/interruptEvent';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scale } from 'react-native-size-matters';

export default function Timer() {
  const { theme } = useTheme();
  const { sessionId } = useLocalSearchParams();
  const router = useRouter();
  const { t } = useTranslation('timer');

  const [time, setTime] = useState(5 * 60 * 1000);
  const [isRunning, setIsRunning] = useState(false);

  const { session, isLoading } = useSession(sessionId as string);

  // timer session disturbance data
  const { screenBackgroundCount } = useBackgroundEvents(isRunning);
  const scrollInteractionCount = useRef<ScrollInteractionEvent[]>([]);
  const scrollDebounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  useEffect(() => {
    return () => {
      if (scrollDebounceTimeoutRef.current) {
        clearTimeout(scrollDebounceTimeoutRef.current);
      }
    };
  }, []);

  const handlePauseTimer = () => {
    setIsRunning(!isRunning);
    console.log('screenBackgroundCount: ', screenBackgroundCount.current);
    console.log('scrollInteractionCount: ', scrollInteractionCount.current);
  };

  if (!isLoading && !session) {
    router.back();
    return null;
  }

  return (
    <SafeAreaView
      edges={['top']}
      style={{ flex: 1, backgroundColor: theme.colors.background }}
    >
      <ScrollColorBackground theme={theme} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          flex: 1,
        }}
        onScroll={() => {
          if (!isRunning) {
            return;
          }

          if (scrollDebounceTimeoutRef.current) {
            clearTimeout(scrollDebounceTimeoutRef.current);
          }

          scrollDebounceTimeoutRef.current = setTimeout(() => {
            scrollInteractionCount.current.push({
              timestamp: Date.now(),
            });
          }, 1000);
        }}
      >
        <TimerContainer theme={theme}>
          <ContentLayoutWithBack
            color={theme.colors.pages.timer.slider.text.primary}
          >
            <TimerHeader theme={theme} session={session!} t={t} />

            <TimerContent>
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
            </TimerContent>
          </ContentLayoutWithBack>
        </TimerContainer>
        <View style={{ flex: 1 }}></View>
      </ScrollView>
    </SafeAreaView>
  );
}

function TimerContainer({
  children,
  theme,
}: {
  children: React.ReactNode;
  theme: Theme;
}) {
  return (
    <View
      style={{
        flex: 1,
        paddingBottom: scale(10),
        backgroundColor: theme.colors.pages.timer.slider.background,
        borderRadius: baseTokens.borderRadius.xl,
      }}
    >
      {children}
    </View>
  );
}

function TimerContent({ children }: { children: React.ReactNode }) {
  return (
    <View
      style={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: baseTokens.spacing[2],
        marginTop: baseTokens.spacing[6],
      }}
    >
      {children}
    </View>
  );
}
