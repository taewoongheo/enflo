import Typography from '@/components/common/Typography';
import AddSessionBottomSheet from '@/components/MainPage/AddSessionBottomSheet';
import { FeedbackBottomSheet } from '@/components/SettingPage';
import CaptionBottomSheet from '@/components/SettingPage/CaptionBottomSheet';
import EditSessionBottomSheet from '@/components/TimerPage/EditSessionBottomSheet';
import {
  BottomSheetProvider,
  useBottomSheet,
} from '@/contexts/BottomSheetContext';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { createAllMockSessions } from '@/data/sessionMockData';
import { db, expoDb } from '@/db/db';
import migrations from '@/drizzle/migrations';
import { INSERT_MOCK_DATA } from '@/environment.config';
import i18n from '@/i18n';
import { appSettingsService } from '@/services/AppSettingsService';
import { entropyService } from '@/services/EntropyService';
import { notificationService } from '@/services/NotificationService';
import { sessionService } from '@/services/SessionService';
import { timerService } from '@/services/TimerService';
import { log } from '@/utils/log';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import * as Sentry from '@sentry/react-native';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';
import * as Notifications from 'expo-notifications';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { Suspense, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

Sentry.init({
  dsn: 'https://3467223d593c22a65255d1baa175c02e@o4510090058792960.ingest.us.sentry.io/4510090733748224',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [
    Sentry.mobileReplayIntegration(),
    Sentry.feedbackIntegration(),
  ],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function allowsNotificationsAsync() {
  const settings = await Notifications.getPermissionsAsync();
  return settings.granted;
}

export async function requestPermissionsAsync() {
  return Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: true,
      allowSound: true,
    },
  });
}

export async function scheduleNotificationAsync({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  const notificationSettings = (
    await notificationService.getNotificationSettings()
  )[0];

  if (!notificationSettings.enabled) {
    return;
  }

  return Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
    },
    trigger: null,
  });
}

const AppInit = ({ children }: { children: React.ReactNode }) => {
  const { success, error } = useMigrations(db, migrations);
  const { theme, setTheme } = useTheme();
  const [isAppSettingLoading, setIsAppSettingLoading] = useState(true);

  log('appinit');

  useEffect(() => {
    const initializeSessions = async () => {
      try {
        if (INSERT_MOCK_DATA) {
          await sessionService.clear();
          await timerService.clear();
          await entropyService.clear();
          await createAllMockSessions();
        }

        log(`하이드레이션 시작`);
        await sessionService.hydrateSessions();
        const { lang, theme } =
          await appSettingsService.initializeAppSettings();
        log(`최종 앱 설정: ${JSON.stringify({ lang, theme })}`);
        setTheme(theme as 'light' | 'dark');
        i18n.changeLanguage(lang);
        setIsAppSettingLoading(false);
      } catch (error) {
        throw error;
      }
    };

    if (success) {
      initializeSessions();
    }
  }, [success]);

  if (error) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.colors.background,
        }}
      >
        <Typography
          variant="body1Bold"
          style={{ color: theme.colors.text.error }}
        >
          Migration error: {error.message}
        </Typography>
      </View>
    );
  }

  if (!success || isAppSettingLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.colors.background,
        }}
      >
        <ActivityIndicator size="large" color={theme.colors.text.primary} />
      </View>
    );
  }

  return (
    <>
      {children}
      {__DEV__ && <DrizzleStudio />}
    </>
  );
};

function BottomSheetWrapper() {
  const { theme } = useTheme();

  const {
    addSessionBottomSheetRef,
    editSessionBottomSheetRef,
    feedbackBottomSheetRef,
    captionBottomSheetRef,
  } = useBottomSheet();

  return (
    <>
      <AddSessionBottomSheet
        addSessionBottomSheetRef={
          addSessionBottomSheetRef as React.RefObject<BottomSheetMethods>
        }
        theme={theme}
      />
      <EditSessionBottomSheet
        editSessionBottomSheetRef={
          editSessionBottomSheetRef as React.RefObject<BottomSheetMethods>
        }
        theme={theme}
      />
      <FeedbackBottomSheet
        feedbackBottomSheetRef={
          feedbackBottomSheetRef as React.RefObject<BottomSheetMethods>
        }
        theme={theme}
      />
      <CaptionBottomSheet
        captionBottomSheetRef={
          captionBottomSheetRef as React.RefObject<BottomSheetMethods>
        }
        theme={theme}
      />
    </>
  );
}

export default Sentry.wrap(function RootLayout() {
  return (
    <Suspense fallback={<ActivityIndicator size="large" />}>
      <GestureHandlerRootView>
        <ThemeProvider>
          <BottomSheetProvider>
            <AppInit>
              <SafeAreaProvider>
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="(tabs)" />
                  <Stack.Screen name="timer/index" />
                  <Stack.Screen name="settings" />
                  <Stack.Screen name="+not-found" />
                </Stack>
                <StatusBar style="light" />
              </SafeAreaProvider>

              <BottomSheetWrapper />
            </AppInit>
          </BottomSheetProvider>
        </ThemeProvider>
      </GestureHandlerRootView>
    </Suspense>
  );
});

const DrizzleStudio = () => {
  useDrizzleStudio(expoDb);

  return null;
};
