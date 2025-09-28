import ContentLayoutWithBack from '@/components/common/ContentLayoutWithBack';
import Typography from '@/components/common/Typography';
import { useTheme } from '@/contexts/ThemeContext';
import { appSettingsService } from '@/services/AppSettingsService';
import { baseTokens, ThemeName } from '@/styles';
import { hapticSettings } from '@/utils/haptics';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Pressable } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

function ThemeChangeScreen() {
  const { theme, setTheme, themeName } = useTheme();
  const { t } = useTranslation('settings');

  const modes = ['light', 'dark'];

  const handleChangeTheme = async (theme: ThemeName) => {
    hapticSettings();

    try {
      await appSettingsService.setAppTheme(theme);
      setTheme(theme);
    } catch (error) {
      setTheme(themeName);
      throw error;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ContentLayoutWithBack color={theme.colors.text.primary}>
        {modes.map((mode) => (
          <Pressable
            onPress={() => handleChangeTheme(mode as ThemeName)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: baseTokens.spacing[4],
              paddingVertical: baseTokens.spacing[2],
            }}
            key={mode}
          >
            <Typography
              variant="body1Regular"
              style={{
                color:
                  mode === themeName
                    ? theme.colors.text.primary
                    : theme.colors.text.secondary,
              }}
            >
              {mode === 'light' ? t('lightMode') : t('darkMode')}
            </Typography>
            <Ionicons
              name={mode === themeName ? 'radio-button-on' : 'radio-button-off'}
              size={baseTokens.iconSize.md}
              color={
                mode === themeName
                  ? theme.colors.pages.timer.slider.picker
                  : theme.colors.text.secondary
              }
            />
          </Pressable>
        ))}
      </ContentLayoutWithBack>
    </SafeAreaView>
  );
}

export default ThemeChangeScreen;
