import { ContentLayout } from '@/components/common/ContentLayout';
import Typography from '@/components/common/Typography';
import {
  EntropyTrendSection,
  FocusTimeBySessionSection,
  FocusTimeByWeek,
  StreakSection,
} from '@/components/StatsPage';
import { useTheme } from '@/contexts/ThemeContext';
import { baseTokens } from '@/styles';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scale } from 'react-native-size-matters';

const contentGap = baseTokens.spacing[1];

export default function StatisticsScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingTop: insets.top,
      }}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <ContentLayout isTopMargin={scale(10)}>
          <InfoLayout>
            <Typography
              variant="title2Bold"
              style={{ color: theme.colors.text.primary }}
            >
              통계
            </Typography>
          </InfoLayout>
          <InfoLayout>
            <EntropyTrendSection theme={theme} />
          </InfoLayout>
          <InfoLayout>
            <FocusTimeByWeek theme={theme} />
          </InfoLayout>
          <InfoLayout>
            <FocusTimeBySessionSection theme={theme} />
          </InfoLayout>
          <InfoLayout>
            <StreakSection theme={theme} />
          </InfoLayout>
        </ContentLayout>
      </ScrollView>
    </View>
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
