import Typography from '@/components/common/Typography';
import { particleCanvasWidth } from '@/components/MainPage/constants/entropySystem/dimension';
import { useTheme } from '@/contexts/ThemeContext';
import { baseTokens } from '@/styles';
import React, { useRef, useState } from 'react';
import { View } from 'react-native';
import { FlatList, Pressable } from 'react-native-gesture-handler';

const ONBOARDING_CONTENT = [
  {
    content:
      '엔트로피는 무질서도를 나타내요.\n무질서도가 높을수록 입자는 더 불규칙하게 움직입니다',
  },
  {
    content:
      '얼음과 물로 예시를 들어볼게요.\n얼음은 엔트로피가 낮은 상태, 즉 무질서도가 낮고 정돈된 상태에요',
  },
  {
    content:
      '그러다 얼음이 녹아 물이 되면 엔트로피가 높은 상태가 됩니다.\n자연적인 상태에서 엔트로피는 계속해서 높아져요.',
  },
  {
    content:
      '우리의 집중도 마찬가지예요.\n가만히 두면 정신적 엔트로피가 높아져 집중을 잃습니다.',
  },
  {
    content:
      '하지만 몰입은 엔트로피를 낮추고 집중을 붙잡아 줍니다. \nenflo와 함께 낮은 엔트로피를 유지해보세요',
  },
  {
    content:
      'enflo는 엔트로피를 낮추고 집중을 붙잡아 줍니다. \nenflo와 함께 낮은 엔트로피를 유지해보세요',
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
              paddingHorizontal: baseTokens.spacing[2],
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingVertical: baseTokens.spacing[6],
            }}
          >
            <Typography
              variant="body1Regular"
              style={{
                textAlign: 'center',
                color: theme.colors.text.primary,
              }}
            >
              {item.content}
            </Typography>

            <Pressable
              onPress={handleNext}
              disabled={!touchable}
              style={{
                backgroundColor: theme.colors.text.primary,
                paddingVertical: baseTokens.spacing[3],
                borderRadius: baseTokens.borderRadius.sm,
                opacity: touchable ? 1 : 0.5,
                width: '90%',
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
        )}
      />
    </View>
  );
}

export { ONBOARDING_CONTENT };
export default OnboardingContent;
