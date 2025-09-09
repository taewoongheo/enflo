import Typography from '@/components/common/Typography';
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
import { baseTokens } from '@/styles';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetTextInput,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin/build/useDrizzleStudio';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { Suspense, useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  Pressable,
  Text,
  View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { scale } from 'react-native-size-matters';

const AppInit = ({ children }: { children: React.ReactNode }) => {
  const { success, error } = useMigrations(db, migrations);
  useDrizzleStudio(expoDb);

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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="body1Bold" style={{ color: 'red' }}>
          Migration error: {error.message}
        </Typography>
      </View>
    );
  }

  if (!success) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="body1Bold" style={{ color: 'green' }}>
          loading...
        </Typography>
      </View>
    );
  }

  return <>{children}</>;
};

function BottomSheetWrapper() {
  const { theme } = useTheme();
  const { addSessionBottomSheetRef, editSessionBottomSheetRef } =
    useBottomSheet();

  const [sessionName, setSessionName] = useState('');
  console.log(sessionName);

  const renderBackdrop = useCallback(
    (props: React.ComponentProps<typeof BottomSheetBackdrop>) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        enableTouchThrough={false}
        onPress={() => {
          Keyboard.dismiss();
        }}
      />
    ),
    [],
  );

  return (
    <>
      <BottomSheet
        ref={addSessionBottomSheetRef}
        // index={-1}
        enablePanDownToClose={true}
        backdropComponent={renderBackdrop}
        handleStyle={{
          backgroundColor: theme.colors.bottomSheet.background,
          borderTopStartRadius: baseTokens.borderRadius.lg,
          borderTopEndRadius: baseTokens.borderRadius.lg,
        }}
        handleIndicatorStyle={{
          backgroundColor: theme.colors.bottomSheet.text.placeholder,
        }}
        keyboardBehavior="interactive"
      >
        <BottomSheetView
          style={{
            flex: 1,
          }}
        >
          <Pressable
            onPress={() => {
              addSessionBottomSheetRef.current?.snapToIndex(0);
              Keyboard.dismiss();
            }}
            style={{
              flex: 1,
              backgroundColor: theme.colors.bottomSheet.background,
              padding: baseTokens.spacing[4],
              paddingBottom: baseTokens.spacing[8],
              flexDirection: 'column',
              gap: baseTokens.spacing[3],
            }}
          >
            <Typography
              variant="body1Bold"
              style={{ color: theme.colors.bottomSheet.text.primary }}
            >
              새로운 세션 추가
            </Typography>
            <BottomSheetTextInput
              onChangeText={(text) => {
                setSessionName(text);
              }}
              value={sessionName}
              placeholder="세션 이름"
              placeholderTextColor={theme.colors.bottomSheet.text.placeholder}
              style={{
                borderWidth: scale(1.3),
                borderColor: theme.colors.bottomSheet.border,
                paddingHorizontal: baseTokens.spacing[3],
                borderRadius: baseTokens.borderRadius.sm,
                color: theme.colors.bottomSheet.text.primary,
                fontSize: baseTokens.typography.body2Regular.fontSize,
                fontFamily: baseTokens.typography.body2Regular.fontFamily,
                height: scale(50),
              }}
            />
            <Pressable
              onPress={async (e) => {
                try {
                  await sessionService.addSession({
                    sessionName: sessionName,
                  });
                  setSessionName('');
                  addSessionBottomSheetRef.current?.close();
                  Keyboard.dismiss();
                } catch (error) {
                  console.error(error);
                }

                e.stopPropagation();
              }}
              style={{
                backgroundColor: theme.colors.text.secondary,
                borderWidth: scale(1.3),
                borderColor:
                  theme.colors.pages.main.sessionCard.addButtonBorder,
                paddingHorizontal: baseTokens.spacing[3],
                borderRadius: baseTokens.borderRadius.sm,
                alignItems: 'center',
                justifyContent: 'center',
                height: scale(50),
              }}
            >
              <Typography
                variant="body1Bold"
                style={{ color: theme.colors.background }}
              >
                추가
              </Typography>
            </Pressable>
          </Pressable>
        </BottomSheetView>
      </BottomSheet>
      <BottomSheet
        ref={editSessionBottomSheetRef}
        index={-1}
        enablePanDownToClose={true}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView style={{ flex: 1, backgroundColor: 'blue' }}>
          <Text>Edit Session</Text>
        </BottomSheetView>
      </BottomSheet>
    </>
  );
}

export default function RootLayout() {
  return (
    <AppInit>
      <Suspense fallback={<ActivityIndicator size="large" />}>
        <GestureHandlerRootView>
          <ThemeProvider>
            <BottomSheetProvider>
              <SafeAreaProvider>
                <Stack>
                  <Stack.Screen
                    name="(tabs)"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="timer/index"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen name="+not-found" />
                </Stack>
                <StatusBar style="light" />
              </SafeAreaProvider>

              <BottomSheetWrapper />
            </BottomSheetProvider>
          </ThemeProvider>
        </GestureHandlerRootView>
      </Suspense>
    </AppInit>
  );
}
