import { ContentLayout } from '@/components/common/ContentLayout';
import Typography from '@/components/common/Typography';
import { useTheme } from '@/contexts/ThemeContext';
import { baseTokens } from '@/styles';
import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scale } from 'react-native-size-matters';

const contentGap = baseTokens.spacing[1];

const cardGap = baseTokens.spacing[0];
const cardPadding = baseTokens.spacing[3];

export default function StatisticsScreen() {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ContentLayout isTopMargin={scale(10)}>
        <Typography
          variant="title2Bold"
          style={{ color: theme.colors.text.primary }}
        >
          통계
        </Typography>
        <InfoLayout>
          <Typography
            variant="title2Bold"
            style={{ color: theme.colors.text.secondary }}
          >
            총 몰입 시간 & 연속일
          </Typography>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              gap: baseTokens.spacing[2],
            }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: theme.colors.pages.main.sessionCard.background,
                borderColor: theme.colors.pages.main.sessionCard.border,
                borderWidth: scale(1),
                borderRadius: baseTokens.borderRadius.md,
                padding: cardPadding,
              }}
            >
              <Typography
                variant="body1Bold"
                style={{
                  color: theme.colors.text.secondary,
                }}
              >
                총 몰입 시간
              </Typography>
              <Typography
                variant="body1Bold"
                style={{ color: theme.colors.text.primary }}
              >
                43:12:34
              </Typography>
            </View>
            <View
              style={{
                flex: 1,
                backgroundColor: theme.colors.pages.main.sessionCard.background,
                borderColor: theme.colors.pages.main.sessionCard.border,
                borderWidth: scale(1),
                borderRadius: baseTokens.borderRadius.md,
                padding: cardPadding,
                gap: cardGap,
              }}
            >
              <Typography
                variant="body1Bold"
                style={{ color: theme.colors.text.secondary }}
              >
                연속일
              </Typography>
              <Typography
                variant="body1Bold"
                style={{ color: theme.colors.text.primary }}
              >
                98일
              </Typography>
            </View>
          </View>
        </InfoLayout>
        <InfoLayout>
          <Typography
            variant="title2Bold"
            style={{ color: theme.colors.text.secondary }}
          >
            엔트로피 기록
          </Typography>
          <View
            style={{
              width: '100%',
              height: scale(150),
              backgroundColor: theme.colors.pages.main.sessionCard.background,
              borderColor: theme.colors.pages.main.sessionCard.border,
              borderWidth: scale(1),
              borderRadius: baseTokens.borderRadius.md,
            }}
          ></View>
        </InfoLayout>
        <InfoLayout>
          <Typography
            variant="title2Bold"
            style={{ color: theme.colors.text.secondary }}
          >
            몰입 기록
          </Typography>
          <View
            style={{
              width: '100%',
              height: scale(150),
              backgroundColor: theme.colors.pages.main.sessionCard.background,
              borderColor: theme.colors.pages.main.sessionCard.border,
              borderWidth: scale(1),
              borderRadius: baseTokens.borderRadius.md,
            }}
          ></View>
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
