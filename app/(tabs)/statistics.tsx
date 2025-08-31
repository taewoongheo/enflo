import { ContentLayout } from '@/components/common/ContentLayout';
import Typography from '@/components/common/Typography';
import EntropyTrendSection from '@/components/Stats/EntropyTrendSection';
import FocusTimeBySessionSection from '@/components/Stats/FocusTimeBySessionSection';
import KeyMetricsSection from '@/components/Stats/KeyMetricsSection';
import { useTheme } from '@/contexts/ThemeContext';
import { baseTokens } from '@/styles';
import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scale } from 'react-native-size-matters';

const contentGap = baseTokens.spacing[1];

export default function StatisticsScreen() {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ContentLayout isTopMargin={scale(10)}>
        <Typography
          variant="title3Bold"
          style={{ color: theme.colors.text.primary }}
        >
          통계
        </Typography>
        <InfoLayout>
          <KeyMetricsSection theme={theme} />
        </InfoLayout>
        <InfoLayout>
          <EntropyTrendSection theme={theme} />
        </InfoLayout>
        <InfoLayout>
          <FocusTimeBySessionSection theme={theme} />
        </InfoLayout>
      </ContentLayout>
    </SafeAreaView>
  );
}

function InfoLayout({ children }: { children: React.ReactNode }) {
  return (
    <View
      style={{
        marginBottom: baseTokens.spacing[3],
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: contentGap,
      }}
    >
      {children}
    </View>
  );
}
