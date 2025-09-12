import { Stack } from 'expo-router';
import React from 'react';

export default function SettingsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="feedback" />
      <Stack.Screen name="howToUse" />
      <Stack.Screen name="language" />
      <Stack.Screen name="license" />
      <Stack.Screen name="privacy" />
      <Stack.Screen name="terms" />
      <Stack.Screen name="themeChangeScreen" />
    </Stack>
  );
}
