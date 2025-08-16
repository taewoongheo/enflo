import { ThemeProvider } from '@/contexts/ThemeContext';
import { createAllMockSessions } from '@/data/sessionMockData';
import { db, expoDb } from '@/db/db';
import migrations from '@/drizzle/migrations';
import { INSERT_MOCK_DATA } from '@/environment.config';
import '@/i18n';
import { sessionService } from '@/services/SessionService';
import { timerService } from '@/services/TimerService';
import { useSessionCache } from '@/store/sessionCache';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin/build/useDrizzleStudio';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { Suspense, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const AppInit = ({ children }: { children: React.ReactNode }) => {
  useMigrations(db, migrations);
  useDrizzleStudio(expoDb);

  useEffect(() => {
    const insertMockSessions = async () => {
      try {
        await sessionService.clear();
        await timerService.clear();

        const sessions = await createAllMockSessions();
        useSessionCache.getState().setSessions(sessions);
      } catch (error) {
        throw error;
      }
    };

    if (INSERT_MOCK_DATA) {
      insertMockSessions();
    }

    sessionService.hydrateSessions();
  }, []);

  return <>{children}</>;
};

export default function RootLayout() {
  return (
    <AppInit>
      <Suspense fallback={<ActivityIndicator size="large" />}>
        <GestureHandlerRootView>
          <SafeAreaProvider>
            <ThemeProvider>
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen
                  name="timer/index"
                  options={{ headerShown: false }}
                />
                <Stack.Screen name="+not-found" />
              </Stack>
              <StatusBar style="light" />
            </ThemeProvider>
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </Suspense>
    </AppInit>
  );
}
