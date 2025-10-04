import { LegalPageHeader } from '@/components/SettingPage';
import Typography from '@/components/common/Typography';
import { useTheme } from '@/contexts/ThemeContext';
import { baseTokens } from '@/styles';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface LibraryItemProps {
  name: string;
  version: string;
  license: string;
}

function LicenseScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation('settings');

  const LibraryItem = ({ name, version, license }: LibraryItemProps) => (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: baseTokens.spacing[3],
        paddingBottom: baseTokens.spacing[2],
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.pages.main.sessionCard.border,
      }}
    >
      <View style={{ flex: 1 }}>
        <Typography
          variant="body1Regular"
          style={{
            color: theme.colors.text.primary,
          }}
        >
          {name}
        </Typography>
        <Typography
          variant="body2Regular"
          style={{
            color: theme.colors.text.secondary,
          }}
        >
          {version}
        </Typography>
      </View>
      <Typography
        variant="label"
        style={{
          color: theme.colors.text.secondary,
        }}
      >
        {license}
      </Typography>
    </View>
  );

  const libraries = [
    { name: 'React', version: '19.0.0', license: 'MIT' },
    { name: 'React Native', version: '0.79.5', license: 'MIT' },
    { name: 'Expo', version: '~53.0.23', license: 'MIT' },
    { name: '@expo/vector-icons', version: '^14.1.0', license: 'MIT' },
    { name: '@gorhom/bottom-sheet', version: '^5.2.6', license: 'MIT' },
    { name: '@react-navigation/*', version: '^7.x.x', license: 'MIT' },
    { name: '@sentry/react-native', version: '~6.14.0', license: 'MIT' },
    {
      name: '@shopify/react-native-skia',
      version: 'v2.0.0-next.4',
      license: 'MIT',
    },
    { name: 'drizzle-orm', version: '^0.44.4', license: 'Apache-2.0' },
    {
      name: 'react-native-gesture-handler',
      version: '~2.24.0',
      license: 'MIT',
    },
    { name: 'react-native-reanimated', version: '~3.17.4', license: 'MIT' },
    {
      name: 'react-native-safe-area-context',
      version: '5.4.0',
      license: 'MIT',
    },
    { name: 'react-native-size-matters', version: '^0.4.2', license: 'MIT' },
    { name: 'zustand', version: '^5.0.7', license: 'MIT' },
    { name: 'i18next', version: '^25.3.2', license: 'MIT' },
    { name: 'react-i18next', version: '^15.6.0', license: 'MIT' },
    { name: 'TypeScript', version: '~5.8.3', license: 'Apache-2.0' },
    { name: 'ESLint', version: '^9.25.0', license: 'MIT' },
    { name: 'Prettier', version: '^3.6.2', license: 'MIT' },
    { name: 'Jest', version: '~29.7.0', license: 'MIT' },
  ];

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
          <Typography
            variant="title2Bold"
            style={{
              color: theme.colors.text.primary,
              textAlign: 'center',
              marginBottom: baseTokens.spacing[2],
            }}
          >
            {t('license.title')}
          </Typography>

          {libraries.map((library, index) => (
            <LibraryItem
              key={index}
              name={library.name}
              version={library.version}
              license={library.license}
            />
          ))}

          <View style={{ marginTop: baseTokens.spacing[5] }}>
            <Typography
              variant="body2Regular"
              style={{
                color: theme.colors.text.secondary,
                textAlign: 'center',
                fontStyle: 'italic',
              }}
            >
              {`All libraries are used in accordance with their respective licenses.
모든 라이브러리는 각각의 라이선스에 따라 사용됩니다.`}
            </Typography>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default LicenseScreen;
