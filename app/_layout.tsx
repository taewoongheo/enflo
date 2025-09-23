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
import '@/i18n';
import { entropyService } from '@/services/EntropyService';
import { sessionService } from '@/services/SessionService';
import { timerService } from '@/services/TimerService';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin/build/useDrizzleStudio';
import * as Notifications from 'expo-notifications';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { Suspense, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

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

export function requestPermissionsAsync() {
  return Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: true,
      allowSound: true,
    },
  });
}

const AppInit = ({ children }: { children: React.ReactNode }) => {
  const { success, error } = useMigrations(db, migrations);
  useDrizzleStudio(expoDb);
  const { theme } = useTheme();

  useEffect(() => {
    const initializeSessions = async () => {
      try {
        if (INSERT_MOCK_DATA) {
          await sessionService.clear();
          await timerService.clear();
          await entropyService.clear();
          await createAllMockSessions();
        }

        await sessionService.hydrateSessions();
      } catch (error) {
        throw error;
      }
    };

    initializeSessions();
  }, []);

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

  if (!success) {
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

  return <>{children}</>;
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

export default function RootLayout() {
  return (
    <Suspense fallback={<ActivityIndicator size="large" />}>
      <GestureHandlerRootView>
        <ThemeProvider>
          <AppInit>
            <BottomSheetProvider>
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
            </BottomSheetProvider>
          </AppInit>
        </ThemeProvider>
      </GestureHandlerRootView>
    </Suspense>
  );
}
