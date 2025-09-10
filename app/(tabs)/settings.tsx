import { ContentLayout } from '@/components/common/ContentLayout';
import Typography from '@/components/common/Typography';
import { useTheme } from '@/contexts/ThemeContext';
import { baseTokens, Theme } from '@/styles';
import { AntDesign } from '@expo/vector-icons';
import Constants from 'expo-constants';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scale } from 'react-native-size-matters';

export default function SettingsScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation('settings');

  const handleSettingPress = (setting: string) => {
    // TODO: Implement navigation to specific setting pages
    console.log(`Navigate to ${setting}`);
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
                onPress={() => handleSettingPress('howToUse')}
              />
              <SettingsItem
                theme={theme}
                title={t('language')}
                onPress={() => handleSettingPress('language')}
              />
              <SettingsItem
                theme={theme}
                title={t('themeChange')}
                onPress={() => handleSettingPress('theme')}
              />
              <SettingsItem
                theme={theme}
                title={t('feedbackInquiry')}
                onPress={() => handleSettingPress('feedback')}
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

function SectionHeader({ theme, title }: { theme: Theme; title: string }) {
  return (
    <Typography
      variant="body1Bold"
      style={{
        color: theme.colors.text.secondary,
      }}
    >
      {title}
    </Typography>
  );
}

function SettingsLayout({
  children,
  theme,
}: {
  children: React.ReactNode;
  theme: Theme;
}) {
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

function SettingsItem({
  theme,
  title,
  onPress,
}: {
  theme: Theme;
  title: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={() => ({
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        // padding: baseTokens.spacing[3],
        // backgroundColor: pressed
        //   ? theme.colors.pages.main.sessionCard.border
        //   : 'transparent',
      })}
    >
      <Typography
        variant="body1Regular"
        style={{
          color: theme.colors.text.primary,
          flex: 1,
        }}
      >
        {title}
      </Typography>
      <AntDesign
        name="right"
        size={baseTokens.iconSize.sm}
        color={theme.colors.text.secondary}
      />
    </Pressable>
  );
}

function InfoLayout({ children }: { children: React.ReactNode }) {
  return (
    <View
      style={{
        marginBottom: baseTokens.spacing[3],
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: baseTokens.spacing[1],
      }}
    >
      {children}
    </View>
  );
}
