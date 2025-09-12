import ContentLayoutWithBack from '@/components/common/ContentLayoutWithBack';
import { useTheme } from '@/contexts/ThemeContext';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

function SettingsLayout({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ContentLayoutWithBack color={theme.colors.text.primary}>
        {children}
      </ContentLayoutWithBack>
    </SafeAreaView>
  );
}

export default SettingsLayout;
