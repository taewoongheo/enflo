import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '메인',
        }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
          title: '통계',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: '설정',
        }}
      />
    </Tabs>
  );
}
