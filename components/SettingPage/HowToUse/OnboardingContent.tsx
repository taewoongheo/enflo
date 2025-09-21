import Typography, { VariantKeys } from '@/components/common/Typography';
import { particleCanvasWidth } from '@/components/MainPage/constants/entropySystem/dimension';
import { useTheme } from '@/contexts/ThemeContext';
import { baseTokens, Theme } from '@/styles';
import React, { useRef, useState } from 'react';
import { View } from 'react-native';
import { FlatList, Pressable } from 'react-native-gesture-handler';

const HighlightedText = ({
  children,
  variant,
  theme,
}: {
  children: React.ReactNode;
  variant: VariantKeys;
  theme: Theme;
}) => {
  return (
    <Typography
      variant={variant}
      style={{
        paddingInline: baseTokens.spacing[1],
        backgroundColor: theme.colors.pages.timer.slider.picker,
        borderRadius: baseTokens.borderRadius.xs,
        color: theme.colors.background,
        alignSelf: 'baseline',
      }}
    >
      {children}
    </Typography>
  );
};

const ONBOARDING_CONTENT = [
  {
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
    // "정돈된 상태", "차분히"
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
    // "산만", "불규칙"
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
    // "얼음은 입자가 단단히 묶여 정돈된 상태", "물이 되면 입자들이 자유롭게 흩어져 무질서도가 커져요"
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
            안정한 상태예요. 엔트로피가 낮은 상태죠.
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
            무질서하게 흩어지며
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
    // "집중력", "정신적 엔트로피가 높아져 집중력을 잃습니다.",
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
    // "몰입", "엔트로피를 낮게 유지"
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
            이때
          </Typography>
          <HighlightedText variant="body1Bold" theme={theme}>
            몰입
          </HighlightedText>
          <Typography
            variant="body1Regular"
            style={{ color: theme.colors.text.primary }}
          >
            은 흩어지는 집중력을 붙잡아,
          </Typography>
        </View>
        <Typography
          variant="body1Regular"
          style={{ color: theme.colors.text.primary }}
        >
          엔트로피를 낮게 유지해줍니다.
        </Typography>
      </View>
    ),
  },
  {
    // "enflo", "시각화", "몰입"
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
    // "낮은 엔트로피, 높은 몰입"
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
    // "enflo", "당신만의 몰입"
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

interface OnboardingContentProps {
  touchable: boolean;
  onNext: () => void;
}

function OnboardingContent({ touchable, onNext }: OnboardingContentProps) {
  const { theme } = useTheme();
  const listRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    const nextIndex = Math.min(currentIndex + 1, ONBOARDING_CONTENT.length - 1);
    setCurrentIndex(nextIndex);
    listRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    onNext();
  };

  const getButtonText = (index: number) => {
    if (index === ONBOARDING_CONTENT.length - 1) {
      return '시작하기';
    }

    if (!touchable) {
      return '화면을 터치하거나 드래그해보세요';
    }

    return '다음';
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        ref={listRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        data={ONBOARDING_CONTENT}
        keyExtractor={(item, index) => index.toString()}
        getItemLayout={(data, index) => ({
          length: particleCanvasWidth,
          offset: particleCanvasWidth * index,
          index,
        })}
        renderItem={({ item, index }) => (
          <View
            style={{
              width: particleCanvasWidth,
              flex: 1,
              paddingHorizontal: baseTokens.spacing[5],
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              paddingVertical: baseTokens.spacing[6],
            }}
          >
            <View
              style={{
                width: '100%',
                justifyContent: 'center',
                alignItems: 'flex-start',
              }}
            >
              <Typography
                variant="body1Regular"
                style={{
                  textAlign: 'left',
                  color: theme.colors.text.primary,
                }}
              >
                {item.content(theme)}
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
                onPress={handleNext}
                disabled={!touchable}
                style={{
                  backgroundColor: theme.colors.text.primary,
                  paddingVertical: baseTokens.spacing[3],
                  borderRadius: baseTokens.borderRadius.sm,
                  opacity: touchable ? 1 : 0.5,
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
                  {getButtonText(index)}
                </Typography>
              </Pressable>
            </View>
          </View>
        )}
      />
    </View>
  );
}

export { ONBOARDING_CONTENT };
export default OnboardingContent;
