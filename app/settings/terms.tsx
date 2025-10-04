import Typography from '@/components/common/Typography';
import {
  BulletPoint,
  Copyright,
  LegalPageHeader,
  NumberedPoint,
  SectionContent,
  SectionTitle,
} from '@/components/SettingPage';
import { useTheme } from '@/contexts/ThemeContext';
import { baseTokens } from '@/styles';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function TermsScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation('settings');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <LegalPageHeader />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: baseTokens.spacing[6] }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            paddingHorizontal: baseTokens.spacing[4],
            paddingTop: baseTokens.spacing[4],
          }}
        >
          <View
            style={{
              paddingHorizontal: baseTokens.spacing[4],
              paddingTop: baseTokens.spacing[4],
            }}
          >
            <Typography
              variant="title2Bold"
              style={{
                color: theme.colors.text.primary,
                textAlign: 'center',
                marginBottom: baseTokens.spacing[2],
              }}
            >
              {t('terms.title')}
            </Typography>

            <Typography
              variant="body2Regular"
              style={{
                color: theme.colors.text.secondary,
                textAlign: 'center',
                marginBottom: baseTokens.spacing[1],
              }}
            >
              {t('terms.lastUpdated')}
            </Typography>
          </View>
          {/* Section 1 */}
          <SectionTitle>{t('terms.section1Title')}</SectionTitle>
          <SectionContent>{t('terms.section1Content')}</SectionContent>

          {/* Section 2 */}
          <SectionTitle>{t('terms.section2Title')}</SectionTitle>
          <NumberedPoint number={1}>{t('terms.section2Item0')}</NumberedPoint>
          <NumberedPoint number={2}>{t('terms.section2Content')}</NumberedPoint>

          <BulletPoint>{t('terms.section2Item1')}</BulletPoint>
          <BulletPoint>{t('terms.section2Item2')}</BulletPoint>
          <BulletPoint>{t('terms.section2Item3')}</BulletPoint>

          <NumberedPoint number={3}>{t('terms.section2Footer')}</NumberedPoint>

          {/* Section 3 */}
          <SectionTitle>{t('terms.section3Title')}</SectionTitle>
          <NumberedPoint number={1}>{t('terms.section3Item1')}</NumberedPoint>
          <NumberedPoint number={2}>{t('terms.section3Item2')}</NumberedPoint>
          <NumberedPoint number={3}>{t('terms.section3Item3')}</NumberedPoint>
          <NumberedPoint number={4}>{t('terms.section3Item4')}</NumberedPoint>

          {/* Section 4 */}
          <SectionTitle>{t('terms.section4Title')}</SectionTitle>
          <NumberedPoint number={1}>{t('terms.section4Item1')}</NumberedPoint>
          <NumberedPoint number={2}>{t('terms.section4Item2')}</NumberedPoint>
          <NumberedPoint number={3}>{t('terms.section4Item3')}</NumberedPoint>

          {/* Section 5 */}
          <SectionTitle>{t('terms.section5Title')}</SectionTitle>
          <NumberedPoint number={1}>{t('terms.section5Item1')}</NumberedPoint>
          <NumberedPoint number={2}>{t('terms.section5Item2')}</NumberedPoint>
          <NumberedPoint number={3}>{t('terms.section5Item3')}</NumberedPoint>

          {/* Section 6 */}
          <SectionTitle>{t('terms.section6Title')}</SectionTitle>
          <NumberedPoint number={1}>{t('terms.section6Item1')}</NumberedPoint>
          <NumberedPoint number={2}>{t('terms.section6Item2')}</NumberedPoint>

          {/* Section 7 */}
          <SectionTitle>{t('terms.section7Title')}</SectionTitle>
          <BulletPoint>{t('terms.section7Contact')}</BulletPoint>
          <BulletPoint>{t('terms.section7Email')}</BulletPoint>

          {/* Copyright */}
          <Copyright>{t('terms.copyright')}</Copyright>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default TermsScreen;
