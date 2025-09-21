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
          width: viewportWidth,
          flex: 1,
          paddingHorizontal: baseTokens.spacing[5],
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <View
          style={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'flex-start',

            flex: 1,

            marginBottom: baseTokens.spacing[6],
          }}
        >
          <Typography
            variant="title3Regular"
            style={{
              textAlign: 'left',
              color: theme.colors.text.primary,
            }}
          >
            안녕하세요 👋{'\n'}
            <View style={{ flexDirection: 'row', gap: baseTokens.spacing[1] }}>
              <View
                style={{
                  paddingInline: baseTokens.spacing[1],
                  backgroundColor: theme.colors.pages.timer.slider.picker,
                  borderRadius: baseTokens.borderRadius.xs,
                }}
              >
                <Typography
                  variant="title3Regular"
                  style={{
                    color: theme.colors.background,
                  }}
                >
                  enflo
                </Typography>
              </View>
              <Typography
                variant="title3Regular"
                style={{ color: theme.colors.text.primary }}
              >
                에 오신걸 환영합니다!
              </Typography>
            </View>
          </Typography>
        </View>

        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',

            width: '100%',
          }}
        >
          <Pressable
            onPress={() => router.push('/settings/howToUse')}
            style={{
              backgroundColor: theme.colors.text.primary,
              paddingVertical: baseTokens.spacing[3],
              borderRadius: baseTokens.borderRadius.sm,
              width: '100%',
            }}
          >
            <Typography
              variant="body2Bold"
              style={{
                color: theme.colors.background,
                textAlign: 'center',
              }}
            >
              시작하기
            </Typography>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default IntroScreen;
