import { ContentLayout } from '@/components/common/ContentLayout';
import {
  EntropyCanvas,
  EntropyScore,
  EntropySuggestion,
  SessionList,
} from '@/components/MainPage';
import { useTheme } from '@/contexts/ThemeContext';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

function MainScreen() {
  const { theme } = useTheme();

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <EntropyCanvas />
        <ContentLayout>
          <EntropyScore />
          <EntropySuggestion />
          <SessionList />
        </ContentLayout>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default MainScreen;
