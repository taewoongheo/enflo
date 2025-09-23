import { ContentLayout } from '@/components/common/ContentLayout';
import Typography from '@/components/common/Typography';
import {
  InfoLayout,
  SectionHeader,
  SettingsItem,
  SettingsLayout,
} from '@/components/SettingPage';
import { useBottomSheet } from '@/contexts/BottomSheetContext';
import { useTheme } from '@/contexts/ThemeContext';
import { baseTokens } from '@/styles';
import { hapticSettings } from '@/utils/haptics';
import Constants from 'expo-constants';
import { RelativePathString, useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scale } from 'react-native-size-matters';

export default function SettingsScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation('settings');
  const router = useRouter();

  const { feedbackBottomSheetRef } = useBottomSheet();

  const handleSettingPress = (setting: string) => {
    hapticSettings();

    router.push(`/settings/${setting}` as RelativePathString);
  };

  return (
    <View
      style={{
        backgroundColor: theme.colors.background,
        flex: 1,
        paddingTop: insets.top,
      }}
    >
      <ContentLayout isTopMargin={scale(10)}>
        <View style={{ flex: 1 }}>
          {/* Header */}
          <InfoLayout>
            <Typography
              variant="title2Bold"
              style={{ color: theme.colors.text.primary }}
            >
              {t('settingsTitle')}
            </Typography>
          </InfoLayout>

          {/* General Section */}
          <InfoLayout>
            <SettingsLayout theme={theme}>
              <SectionHeader theme={theme} title={t('generalSection')} />
              <SettingsItem
                theme={theme}
                title={t('howToUseEnflo')}
                onPress={() => router.replace('/settings/howToUse')}
              />
              <SettingsItem
                theme={theme}
                title={t('language')}
                onPress={() => handleSettingPress('language')}
              />
              <SettingsItem
                theme={theme}
                title={t('themeChange')}
                onPress={() => handleSettingPress('themeChangeScreen')}
              />
              <SettingsItem
                theme={theme}
                title={t('notification')}
                onPress={() => handleSettingPress('notification')}
              />
              <SettingsItem
                theme={theme}
                title={t('feedbackInquiry')}
                onPress={() => {
                  hapticSettings();
                  feedbackBottomSheetRef.current?.expand();
                }}
              />
            </SettingsLayout>
          </InfoLayout>

          {/* Legal Section */}
          <InfoLayout>
            <SettingsLayout theme={theme}>
              <SectionHeader theme={theme} title={t('legalSection')} />
              <SettingsItem
                theme={theme}
                title={t('privacyPolicy')}
                onPress={() => handleSettingPress('privacy')}
              />
              <SettingsItem
                theme={theme}
                title={t('termsOfService')}
                onPress={() => handleSettingPress('terms')}
              />
              <SettingsItem
                theme={theme}
                title={t('licenseInfo')}
                onPress={() => handleSettingPress('license')}
              />
            </SettingsLayout>
          </InfoLayout>

          {/* App Version */}
          <InfoLayout>
            <View
              style={{
                alignItems: 'center',
                marginTop: baseTokens.spacing[4],
              }}
            >
              <Typography
                variant="body2Regular"
                style={{ color: theme.colors.text.secondary }}
              >
                {t('appVersion')} {Constants.expoConfig?.version || '1.0.0'}
              </Typography>
            </View>
          </InfoLayout>
        </View>
      </ContentLayout>
    </View>
  );
}
