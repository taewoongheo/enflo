import Typography from '@/components/common/Typography';
import { baseTokens, Theme } from '@/styles';
import { View } from 'react-native';
import { HighlightedText } from './OnboardingContent';

export const ONBOARDING_CONTENT_KO = [
  {
    // **엔트로피**는 무질서도를 나타냅니다.
    content: (theme: Theme) => (
      <View style={{ flexDirection: 'row', gap: baseTokens.spacing[1] }}>
        <HighlightedText variant="body1Bold" theme={theme}>
          엔트로피
        </HighlightedText>
        <Typography
          variant="body1Regular"
          style={{ color: theme.colors.text.primary }}
        >
          는 무질서도를 나타내요.
        </Typography>
      </View>
    ),
  },
  {
    // **enflo**는 이를 **0에서 1 사이** 값으로 표현해요. 0에 가까울수록 **몰입도**가 높습니다.
    content: (theme: Theme) => (
      <View style={{ flexDirection: 'column', gap: baseTokens.spacing[1] }}>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: baseTokens.spacing[1],
          }}
        >
          <HighlightedText variant="body1Bold" theme={theme}>
            enflo
          </HighlightedText>
          <Typography
            variant="body1Regular"
            style={{ color: theme.colors.text.primary }}
          >
            는 이를
          </Typography>
          <HighlightedText variant="body1Bold" theme={theme}>
            0에서 1 사이
          </HighlightedText>
          <Typography
            variant="body1Regular"
            style={{ color: theme.colors.text.primary }}
          >
            값으로 표현해요.
          </Typography>
        </View>
        <View style={{ flexDirection: 'row', gap: baseTokens.spacing[1] }}>
          <HighlightedText variant="body1Bold" theme={theme}>
            0에 가까울수록 몰입도
          </HighlightedText>
          <Typography
            variant="body1Regular"
            style={{ color: theme.colors.text.primary }}
          >
            가 높습니다.
          </Typography>
        </View>
      </View>
    ),
  },
  {
    // 엔트로피가 높아지면 **집중이 무너집니다**. 터치해서 입자의 변화를 느껴보세요.
    content: (theme: Theme) => (
      <View style={{ flexDirection: 'column', gap: baseTokens.spacing[1] }}>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: baseTokens.spacing[1],
          }}
        >
          <Typography
            variant="body1Regular"
            style={{ color: theme.colors.text.primary }}
          >
            엔트로피가 높아지면
          </Typography>
          <HighlightedText variant="body1Bold" theme={theme}>
            집중이 무너집니다.
          </HighlightedText>
        </View>
        <Typography
          variant="body1Regular"
          style={{ color: theme.colors.text.primary }}
        >
          터치해서 입자의 변화를 느껴보세요.
        </Typography>
      </View>
    ),
  },
  {
    // 자연스러운 상태에서는 **엔트로피가 계속 증가**합니다.
    content: (theme: Theme) => (
      <View
        style={{
          flexDirection: 'row',
          gap: baseTokens.spacing[1],
          flexWrap: 'wrap',
        }}
      >
        <Typography
          variant="body1Regular"
          style={{ color: theme.colors.text.primary }}
        >
          자연적인 상태에서는
        </Typography>
        <HighlightedText variant="body1Bold" theme={theme}>
          엔트로피가 계속 증가
        </HighlightedText>
        <Typography
          variant="body1Regular"
          style={{ color: theme.colors.text.primary }}
        >
          해요.
        </Typography>
      </View>
    ),
  },
  {
    // 그래서 **몰입**이 필요합니다.
    content: (theme: Theme) => (
      <View style={{ flexDirection: 'row', gap: baseTokens.spacing[1] }}>
        <Typography
          variant="body1Regular"
          style={{ color: theme.colors.text.primary }}
        >
          그래서
        </Typography>
        <HighlightedText variant="body1Bold" theme={theme}>
          몰입
        </HighlightedText>
        <Typography
          variant="body1Regular"
          style={{ color: theme.colors.text.primary }}
        >
          이 필요합니다.
        </Typography>
      </View>
    ),
  },
  {
    // **몰입**은 집중을 다시 모아주고 **엔트로피를 낮춰줍니다**.
    content: (theme: Theme) => (
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: baseTokens.spacing[1],
        }}
      >
        <HighlightedText variant="body1Bold" theme={theme}>
          몰입
        </HighlightedText>
        <Typography
          variant="body1Regular"
          style={{ color: theme.colors.text.primary }}
        >
          은 집중력을 다시 모아주고
        </Typography>
        <HighlightedText variant="body1Bold" theme={theme}>
          엔트로피를 낮춰줍니다.
        </HighlightedText>
      </View>
    ),
  },
  {
    // **enflo**는 이 과정을 **시각화**해 몰입을 **지속**할 수 있게 도와줍니다.
    content: (theme: Theme) => (
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: baseTokens.spacing[1],
        }}
      >
        <HighlightedText variant="body1Bold" theme={theme}>
          enflo
        </HighlightedText>
        <Typography
          variant="body1Regular"
          style={{ color: theme.colors.text.primary }}
        >
          는 이 과정을
        </Typography>
        <HighlightedText variant="body1Bold" theme={theme}>
          시각화
        </HighlightedText>
        <Typography
          variant="body1Regular"
          style={{ color: theme.colors.text.primary }}
        >
          해 몰입을
        </Typography>
        <HighlightedText variant="body1Bold" theme={theme}>
          지속
        </HighlightedText>
        <Typography
          variant="body1Regular"
          style={{ color: theme.colors.text.primary }}
        >
          할 수 있게 도와줍니다.
        </Typography>
      </View>
    ),
  },
  {
    // 이제 **enflo**와 함께 **당신만의 몰입**을 시작하세요.
    content: (theme: Theme) => (
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: baseTokens.spacing[1],
        }}
      >
        <Typography
          variant="body1Regular"
          style={{ color: theme.colors.text.primary }}
        >
          이제
        </Typography>
        <HighlightedText variant="body1Bold" theme={theme}>
          enflo
        </HighlightedText>
        <Typography
          variant="body1Regular"
          style={{ color: theme.colors.text.primary }}
        >
          와 함께
        </Typography>
        <HighlightedText variant="body1Bold" theme={theme}>
          당신만의 몰입
        </HighlightedText>
        <Typography
          variant="body1Regular"
          style={{ color: theme.colors.text.primary }}
        >
          을 시작하세요.
        </Typography>
      </View>
    ),
  },
];
