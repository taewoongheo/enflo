import ContentLayoutWithBack from '@/components/common/ContentLayoutWithBack';
import {
  ScrollColorBackground,
  TimerHeader,
  TimerPlayButton,
  TimerSuggestion,
  TimerTunerSlider,
} from '@/components/TimerPage';
import { useTheme } from '@/contexts/ThemeContext';
import { sessionMockData } from '@/data/sessionMockData';
import Session from '@/models/Session';
import { baseTokens, Theme } from '@/styles';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scale } from 'react-native-size-matters';

export default function Timer() {
  const { theme } = useTheme();
  const router = useRouter();
  const { sessionId } = useLocalSearchParams();
  const { t } = useTranslation('timer');

  const [session, setSession] = useState<Session | null>(null);
  const [time, setTime] = useState(5 * 60 * 1000);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const found = sessionMockData.find((el) => el.sessionId === sessionId);
    if (!found) {
      router.back();
    } else {
      setSession(found);
    }
  }, [router, sessionId]);

  if (!session) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>loading...</Text>
      </View>
    );
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
      >
        <TimerContainer theme={theme}>
          <ContentLayoutWithBack
            color={theme.colors.pages.timer.slider.text.primary}
          >
            <TimerHeader theme={theme} session={session} t={t} />

            <TimerContent>
              <TimerSuggestion
                theme={theme}
                time={time}
                t={t}
                isRunning={isRunning}
              />
              <TimerTunerSlider
                theme={theme}
                isRunning={isRunning}
                setTime={setTime}
              />
              <TimerPlayButton
                theme={theme}
                isRunning={isRunning}
                setIsRunning={setIsRunning}
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
