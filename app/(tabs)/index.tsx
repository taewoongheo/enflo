import { ContentLayout } from '@/components/common/ContentLayout';
import {
  EntropyCanvas,
  EntropyScore,
  EntropySuggestion,
  SessionList,
} from '@/components/MainPage';
import { useTheme } from '@/contexts/ThemeContext';
import React, { useEffect } from 'react';
import { AppState, StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

function MainScreen() {
  const { theme } = useTheme();

  useEffect(() => {
    const appStateSubscription = AppState.addEventListener(
      'change',
      (nextAppState) => {
        console.log('appState changed: ', nextAppState);
      },
    );

    const memoryWarningSubscription = AppState.addEventListener(
      'memoryWarning',
      (nextAppState) => {
        console.warn('memoryWarning: ', nextAppState);
      },
    );

    return () => {
      appStateSubscription.remove();
      memoryWarningSubscription.remove();
    };
  }, []);

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <EntropyCanvas />
        <ContentLayout>
          <EntropyScore />
          <EntropySuggestion />
          <SessionList />
        </ContentLayout>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default MainScreen;
