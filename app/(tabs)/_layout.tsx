import { useTheme } from '@/contexts/ThemeContext';
import { baseTokens } from '@/styles';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  const { theme } = useTheme();

  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.bottomSheet.border,
          paddingTop: baseTokens.spacing[2],
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="statistics"
        options={{
          title: 'Statistics',
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="bar-chart"
              size={baseTokens.iconSize.md}
              color={theme.colors.text.primary}
              style={{ opacity: focused ? 1 : 0.6 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Main',
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="home"
              size={baseTokens.iconSize.md}
              color={theme.colors.text.primary}
              style={{ opacity: focused ? 1 : 0.6 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="settings"
              size={baseTokens.iconSize.md}
              color={theme.colors.text.primary}
              style={{ opacity: focused ? 1 : 0.6 }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
