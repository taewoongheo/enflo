import Typography from '@/components/common/Typography';
import { viewportWidth } from '@/components/MainPage/constants/entropySystem/dimension';
import { useTheme } from '@/contexts/ThemeContext';
import { baseTokens } from '@/styles';
import { useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function IntroScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
      }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: 'space-between',
          alignItems: 'center',

          width: viewportWidth,

          paddingHorizontal: baseTokens.spacing[2],
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: baseTokens.spacing[10],
          }}
        >
          <Typography
            variant="title2Bold"
            style={{ color: theme.colors.text.primary }}
          >
            안녕하세요 👋 {'\n'}enflo에 오신걸 환영합니다
          </Typography>
        </View>
        <Pressable
          onPress={() => router.push('/settings/howToUse')}
          style={{
            backgroundColor: theme.colors.text.primary,
            paddingVertical: baseTokens.spacing[3],
            borderRadius: baseTokens.borderRadius.sm,
            width: '90%',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography
            variant="body1Regular"
            style={{ color: theme.colors.background }}
          >
            시작하기
          </Typography>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

export default IntroScreen;
