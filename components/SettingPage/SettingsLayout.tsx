import { baseTokens, Theme } from '@/styles';
import React from 'react';
import { View } from 'react-native';
import { scale } from 'react-native-size-matters';

interface SettingsLayoutProps {
  children: React.ReactNode;
  theme: Theme;
}

export default function SettingsLayout({
  children,
  theme,
}: SettingsLayoutProps) {
  return (
    <View
      style={{
        backgroundColor: theme.colors.pages.main.sessionCard.background,
        borderColor: theme.colors.pages.main.sessionCard.border,
        borderWidth: scale(1),
        borderRadius: baseTokens.borderRadius.sm,
        padding: baseTokens.spacing[3],
        gap: baseTokens.spacing[4],
        overflow: 'hidden',
      }}
    >
      {children}
    </View>
  );
}
