import Typography, { VariantKeys } from '@/components/common/Typography';
import { particleCanvasWidth } from '@/components/MainPage/constants/entropySystem/dimension';
import { useTheme } from '@/contexts/ThemeContext';
import { baseTokens, Theme } from '@/styles';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { FlatList, Pressable } from 'react-native-gesture-handler';
import { ONBOARDING_CONTENT_EN } from './OnboardingEn';
import { ONBOARDING_CONTENT_KO } from './OnboardingKo';

export const HighlightedText = ({
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

interface OnboardingContentProps {
  touchable: boolean;
  onNext: () => void;
}

function OnboardingContent({ touchable, onNext }: OnboardingContentProps) {
  const { theme } = useTheme();
  const listRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { i18n, t } = useTranslation('settings');

  const handleNext = () => {
    const nextIndex = Math.min(
      currentIndex + 1,
      ONBOARDING_CONTENT_KO.length - 1,
    );
    setCurrentIndex(nextIndex);
    listRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    onNext();
  };

  const getButtonText = (index: number) => {
    if (index === ONBOARDING_CONTENT_KO.length - 1) {
      return t('startButton');
    }

    if (!touchable) {
      return t('touchOrDragHint');
    }

    return t('nextButton');
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        ref={listRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        data={
          i18n.language === 'ko' ? ONBOARDING_CONTENT_KO : ONBOARDING_CONTENT_EN
        }
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

export default OnboardingContent;
