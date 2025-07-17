import { useTheme } from '@/contexts/ThemeContext';
import { Tabs } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

interface ThemeLayoutProps {
  children: React.ReactNode;
}

export const ThemeLayout = ({ children }: ThemeLayoutProps) => {
  const { theme } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {children}
    </View>
  );
};

export default function TabLayout() {
  const { theme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
        },
      }}
    >
      <Tabs.Screen
        name="statistics"
        options={{
          title: 'Statistics',
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Main',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
        }}
      />
    </Tabs>
  );
}
