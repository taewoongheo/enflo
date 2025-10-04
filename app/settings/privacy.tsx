import {
  BulletPoint,
  Copyright,
  LegalPageHeader,
  SectionContent,
  SectionTitle,
  SubBulletPoint,
} from '@/components/SettingPage';
import Typography from '@/components/common/Typography';
import { useTheme } from '@/contexts/ThemeContext';
import { baseTokens } from '@/styles';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function PrivacyScreen() {
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
              {t('privacy.title')}
            </Typography>

            <Typography
              variant="body2Regular"
              style={{
                color: theme.colors.text.secondary,
                textAlign: 'center',
                marginBottom: baseTokens.spacing[1],
              }}
            >
              {t('privacy.lastUpdated')}
            </Typography>
          </View>
          {/* <Typography
            variant="body2Regular"
            style={{
              color: theme.colors.text.secondary,
              textAlign: 'center',
              marginBottom: baseTokens.spacing[5],
            }}
          >
            {t('privacy.platform')}
          </Typography> */}

          {/* Section 1 */}
          <SectionTitle>{t('privacy.section1Title')}</SectionTitle>
          <SectionContent>{t('privacy.section1Content')}</SectionContent>

          <SubBulletPoint
            title={t('privacy.section1Item1')}
            detail={t('privacy.section1Item1Detail')}
          />
          <SubBulletPoint
            title={t('privacy.section1Item2')}
            detail={t('privacy.section1Item2Detail')}
          />

          <Typography
            variant="body2Regular"
            style={{
              color: theme.colors.text.secondary,
              fontStyle: 'italic',
              marginBottom: baseTokens.spacing[4],
            }}
          >
            {t('privacy.section1Footer')}
          </Typography>

          {/* Section 2 */}
          <SectionTitle>{t('privacy.section2Title')}</SectionTitle>
          <SectionContent>{t('privacy.section2Content')}</SectionContent>

          <BulletPoint>{t('privacy.section2Item1')}</BulletPoint>
          <BulletPoint>{t('privacy.section2Item2')}</BulletPoint>
          <BulletPoint>{t('privacy.section2Item3')}</BulletPoint>

          {/* Section 3 */}
          <SectionTitle>{t('privacy.section3Title')}</SectionTitle>
          <BulletPoint>{t('privacy.section3Item1')}</BulletPoint>
          <BulletPoint>{t('privacy.section3Item2')}</BulletPoint>

          {/* Section 4 */}
          <SectionTitle>{t('privacy.section4Title')}</SectionTitle>
          <SectionContent>{t('privacy.section4Content')}</SectionContent>

          {/* Section 5 */}
          <SectionTitle>{t('privacy.section5Title')}</SectionTitle>
          <BulletPoint>{t('privacy.section5Item1')}</BulletPoint>
          <BulletPoint>{t('privacy.section5Item2')}</BulletPoint>
          <BulletPoint>{t('privacy.section5Item3')}</BulletPoint>

          {/* Section 6 */}
          <SectionTitle>{t('privacy.section6Title')}</SectionTitle>
          <SectionContent>{t('privacy.section6Content')}</SectionContent>

          {/* Section 7 */}
          <SectionTitle>{t('privacy.section7Title')}</SectionTitle>
          <BulletPoint>{t('privacy.section7Contact')}</BulletPoint>
          <BulletPoint>{t('privacy.section7Email')}</BulletPoint>

          {/* Copyright */}
          <Copyright>{t('privacy.copyright')}</Copyright>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default PrivacyScreen;
