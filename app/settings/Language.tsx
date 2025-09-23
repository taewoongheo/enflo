import ContentLayoutWithBack from '@/components/common/ContentLayoutWithBack';
import Typography from '@/components/common/Typography';
import { useTheme } from '@/contexts/ThemeContext';
import { baseTokens } from '@/styles';
import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// 처음에 렌더링되면 현재 설정된 언어를 우선순위로 정렬
// 변경 시, 우선순위가 변하지 않음
// 다음에 접속 시, 우선수위로 정렬

function LanguageScreen() {
  const { theme } = useTheme();

  const { i18n } = useTranslation();

  const languages = useMemo(() => {
    return i18n.language === 'ko' ? ['ko', 'en'] : ['en', 'ko'];
  }, []);

  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

  const handleSwitchLanguage = (language: string) => {
    setSelectedLanguage(language);
    i18n.changeLanguage(language);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ContentLayoutWithBack color={theme.colors.text.primary}>
        {languages.map((language) => (
          <Pressable
            onPress={() => handleSwitchLanguage(language)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: baseTokens.spacing[4],
              paddingVertical: baseTokens.spacing[2],
            }}
            key={language}
          >
            <Typography
              variant="body1Regular"
              style={{ color: theme.colors.text.primary }}
            >
              {language === 'ko' ? '한국어' : 'English'}
            </Typography>
            <Ionicons
              name={
                language === selectedLanguage
                  ? 'radio-button-on'
                  : 'radio-button-off'
              }
              size={baseTokens.iconSize.md}
              color={theme.colors.text.primary}
            />
          </Pressable>
        ))}
      </ContentLayoutWithBack>
    </SafeAreaView>
  );
}

export default LanguageScreen;
