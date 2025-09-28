import Typography from '@/components/common/Typography';
import { baseTokens, Theme } from '@/styles';
import { View } from 'react-native';
import { HighlightedText } from './OnboardingContent';

export const ONBOARDING_CONTENT_KO = [
  {
    // **엔트로피**는 무질서도를 나타냅니다.
    content: (theme: Theme) => (
      <View style={{ flexDirection: 'column', gap: baseTokens.spacing[1] }}>
        <View style={{ flexDirection: 'row', gap: baseTokens.spacing[1] }}>
          <HighlightedText variant="body1Bold" theme={theme}>
            엔트로피
          </HighlightedText>
          <Typography
            variant="body1Regular"
            style={{ color: theme.colors.text.primary }}
          >
            는 무질서도를 나타냅니다.
          </Typography>
        </View>
      </View>
    ),
  },
  {
    // 낮은 엔트로피 상태는 **안정된 상태**에요. 지금처럼 입자들이 **균형 있게** 움직이는 상태죠.
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
            낮은 엔트로피 상태는
          </Typography>
          <HighlightedText variant="body1Bold" theme={theme}>
            안정된 상태
          </HighlightedText>
          <Typography
            variant="body1Regular"
            style={{ color: theme.colors.text.primary }}
          >
            에요.
          </Typography>
        </View>
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
            지금처럼 입자들이
          </Typography>
          <HighlightedText variant="body1Bold" theme={theme}>
            균형 있게
          </HighlightedText>
          <Typography
            variant="body1Regular"
            style={{ color: theme.colors.text.primary }}
          >
            움직이는 상태죠.
          </Typography>
        </View>
      </View>
    ),
  },
  {
    // 하지만 엔트로피가 높아지면 입자들이 **무질서**해집니다. 흩어지고 제멋대로 움직이죠. 터치해서 직접 변화를 느껴보세요.
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
            하지만 엔트로피가 높아지면 입자들이
          </Typography>
          <HighlightedText variant="body1Bold" theme={theme}>
            무질서
          </HighlightedText>
          <Typography
            variant="body1Regular"
            style={{ color: theme.colors.text.primary }}
          >
            해집니다.
          </Typography>
          <Typography
            variant="body1Regular"
            style={{ color: theme.colors.text.primary }}
          >
            흩어지고 제멋대로 움직이죠.
          </Typography>
        </View>
        <Typography
          variant="body1Regular"
          style={{ color: theme.colors.text.primary }}
        >
          터치해서 직접 변화를 느껴보세요.
        </Typography>
      </View>
    ),
  },
  {
    // 예를 들어, **얼음**은 입자들이 **단단히 정렬된** 안정한 상태예요. 엔트로피가 낮은 상태죠. 하지만 얼음이 녹아 **물**이 되면 입자들이 **무질서하게 흩어지며** 엔트로피가 높아집니다.
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
            예를 들어,
          </Typography>
          <HighlightedText variant="body1Bold" theme={theme}>
            얼음
          </HighlightedText>
          <Typography
            variant="body1Regular"
            style={{ color: theme.colors.text.primary }}
          >
            은 입자들이
          </Typography>
          <HighlightedText variant="body1Bold" theme={theme}>
            단단히 정렬된
          </HighlightedText>
          <Typography
            variant="body1Regular"
            style={{ color: theme.colors.text.primary }}
          >
            상태예요. 엔트로피가 낮은 상태죠.
          </Typography>
        </View>
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
            하지만 얼음이 녹아
          </Typography>
          <HighlightedText variant="body1Bold" theme={theme}>
            물
          </HighlightedText>
          <Typography
            variant="body1Regular"
            style={{ color: theme.colors.text.primary }}
          >
            이 되면 입자들이
          </Typography>
          <HighlightedText variant="body1Bold" theme={theme}>
            제멋대로 흩어지며
          </HighlightedText>
          <Typography
            variant="body1Regular"
            style={{ color: theme.colors.text.primary }}
          >
            엔트로피가 높아집니다.
          </Typography>
        </View>
      </View>
    ),
  },
  {
    // 우리의 **집중력**도 마찬가지예요. 가만히 두면 정신적 엔트로피가 높아져 집중력을 잃습니다.
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
            우리의
          </Typography>
          <HighlightedText variant="body1Bold" theme={theme}>
            집중력
          </HighlightedText>
          <Typography
            variant="body1Regular"
            style={{ color: theme.colors.text.primary }}
          >
            도 마찬가지예요.
          </Typography>
        </View>
        <Typography
          variant="body1Regular"
          style={{ color: theme.colors.text.primary }}
        >
          가만히 두면 정신적 엔트로피가 높아져 집중력을 잃습니다.
        </Typography>
      </View>
    ),
  },
  {
    // 이유 제시: 그래서 몰입이 필요합니다.
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
    // 정의 + 효과: 몰입은 집중을 모으고 엔트로피를 낮게 유지합니다.
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
            몰입
          </HighlightedText>
          <Typography
            variant="body1Regular"
            style={{ color: theme.colors.text.primary }}
          >
            은 흩어진
          </Typography>
          <HighlightedText variant="body1Bold" theme={theme}>
            집중력
          </HighlightedText>
          <Typography
            variant="body1Regular"
            style={{ color: theme.colors.text.primary }}
          >
            을 다시 모아주며,
          </Typography>
        </View>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: baseTokens.spacing[1],
          }}
        >
          <HighlightedText variant="body1Bold" theme={theme}>
            엔트로피
          </HighlightedText>
          <Typography
            variant="body1Regular"
            style={{ color: theme.colors.text.primary }}
          >
            를 낮춰줘요.
          </Typography>
        </View>
      </View>
    ),
  },
  {
    // **enflo**는 이 과정을 **시각화**하여, **몰입**을 이어갈 수 있게 도와줍니다.
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
            는 이 과정을
          </Typography>
          <HighlightedText variant="body1Bold" theme={theme}>
            시각화
          </HighlightedText>
          <Typography
            variant="body1Regular"
            style={{ color: theme.colors.text.primary }}
          >
            하여,
          </Typography>
        </View>
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
            을 이어갈 수 있게 도와줍니다.
          </Typography>
        </View>
      </View>
    ),
  },
  {
    // **낮은 엔트로피, 높은 몰입** - 이것이 바로 **enflo**의 경험이에요.
    content: (theme: Theme) => (
      <View style={{ flexDirection: 'column', gap: baseTokens.spacing[1] }}>
        <HighlightedText variant="body1Bold" theme={theme}>
          낮은 엔트로피, 높은 몰입
        </HighlightedText>
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
            이것이 바로
          </Typography>
          <HighlightedText variant="body1Bold" theme={theme}>
            enflo
          </HighlightedText>
          <Typography
            variant="body1Regular"
            style={{ color: theme.colors.text.primary }}
          >
            의 경험이에요.
          </Typography>
        </View>
      </View>
    ),
  },
  {
    // 이제 **enflo**와 함께 **당신만의 몰입**을 시작해보세요.
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
        </View>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: baseTokens.spacing[1],
          }}
        >
          <HighlightedText variant="body1Bold" theme={theme}>
            당신만의 몰입
          </HighlightedText>
          <Typography
            variant="body1Regular"
            style={{ color: theme.colors.text.primary }}
          >
            을 시작해보세요.
          </Typography>
        </View>
      </View>
    ),
  },
];
