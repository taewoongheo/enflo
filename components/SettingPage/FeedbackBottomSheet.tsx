import EmailSentService from '@/services/EmailSentService';
import { baseTokens, Theme } from '@/styles';
import { hapticSettings } from '@/utils/haptics';
import { FontAwesome } from '@expo/vector-icons';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetTextInput,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Keyboard, Pressable, View } from 'react-native';
import { scale } from 'react-native-size-matters';
import Typography from '../common/Typography';

const isValidFeedback = async (
  rating: number,
  satisfiedItems: { id: number; nameKey: string; selected: boolean }[],
  feedback: string,
  t: (key: string) => string,
): Promise<{ isValid: boolean; errorMessage?: string }> => {
  if (rating === 0) {
    return {
      isValid: false,
      errorMessage: t('validation.ratingRequired'),
    };
  }

  if (satisfiedItems.filter((el) => el.selected).length === 0) {
    return {
      isValid: false,
      errorMessage: t('validation.satisfiedItemsRequired'),
    };
  }

  if (feedback.trim().length === 0) {
    return {
      isValid: false,
      errorMessage: t('validation.feedbackRequired'),
    };
  }

  if (feedback.length > 3000) {
    return {
      isValid: false,
      errorMessage: t('validation.feedbackTooLong'),
    };
  }

  return { isValid: true };
};

function FeedbackBottomSheet({
  feedbackBottomSheetRef,
  theme,
}: {
  feedbackBottomSheetRef: React.RefObject<BottomSheetMethods>;
  theme: Theme;
}) {
  const { t } = useTranslation('settings');

  const [feedback, setFeedback] = useState('');
  const [isError, setIsError] = useState<{
    isValid: boolean;
    errorMessage?: string;
  }>({
    isValid: true,
    errorMessage: '',
  });
  const [rating, setRating] = useState(0);

  const [initialError, setInitialError] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [satisfiedItems, setSatisfiedItems] = useState([
    {
      id: 0,
      nameKey: 'entropyVisualization',
      selected: false,
    },
    {
      id: 1,
      nameKey: 'focusAnalysisStats',
      selected: false,
    },
    {
      id: 2,
      nameKey: 'design',
      selected: false,
    },
    {
      id: 3,
      nameKey: 'functionConvenience',
      selected: false,
    },
    {
      id: 4,
      nameKey: 'motivation',
      selected: false,
    },
    {
      id: 5,
      nameKey: 'others',
      selected: false,
    },
  ]);

  const renderBackdrop = useCallback(
    (props: React.ComponentProps<typeof BottomSheetBackdrop>) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        enableTouchThrough={false}
        onPress={() => {
          Keyboard.dismiss();
          setFeedback('');
          setIsError({ isValid: true, errorMessage: '' });
          setInitialError(false);
          setSatisfiedItems(
            satisfiedItems.map((el) => ({ ...el, selected: false })),
          );
          setRating(0);
          setIsLoading(true);
        }}
      />
    ),
    [],
  );

  return (
    <BottomSheet
      ref={feedbackBottomSheetRef}
      index={-1}
      enablePanDownToClose={true}
      backdropComponent={renderBackdrop}
      handleStyle={{
        backgroundColor: theme.colors.bottomSheet.background,
        borderTopStartRadius: baseTokens.borderRadius.lg,
        borderTopEndRadius: baseTokens.borderRadius.lg,
      }}
      handleIndicatorStyle={{
        backgroundColor: theme.colors.bottomSheet.text.placeholder,
      }}
      keyboardBehavior="interactive"
      onChange={async (index) => {
        const check = await EmailSentService.checkEmailSentLimit('feedback');

        if (index === 0) {
          if (check) {
            setIsError({
              isValid: false,
              errorMessage: t('validation.emailSendLimitExceeded'),
            });
            setInitialError(true);
          }

          setIsLoading(false);
        }
      }}
    >
      <BottomSheetView
        style={{
          flex: 1,
        }}
      >
        <Pressable
          onPress={() => {
            feedbackBottomSheetRef.current?.snapToIndex(0);
            Keyboard.dismiss();
          }}
          style={{
            flex: 1,
            backgroundColor: theme.colors.bottomSheet.background,
            padding: baseTokens.spacing[4],
            paddingBottom: baseTokens.spacing[8],
            flexDirection: 'column',
            gap: baseTokens.spacing[3],
          }}
        >
          <ItemLayout>
            <Typography
              variant="body1Bold"
              style={{ color: theme.colors.bottomSheet.text.primary }}
            >
              {t('howWasTheApp')}
            </Typography>
            <View style={{ flexDirection: 'row', gap: baseTokens.spacing[3] }}>
              {Array.from({ length: 5 }).map((_, index) => (
                <Pressable
                  onPress={() => {
                    if (initialError) {
                      return;
                    }

                    setIsError({ isValid: true, errorMessage: '' });
                    setRating(index + 1);
                  }}
                  key={index}
                >
                  <FontAwesome
                    name={index < rating ? 'star' : 'star-o'}
                    size={24}
                    color={theme.colors.text.secondary}
                  />
                </Pressable>
              ))}
            </View>
          </ItemLayout>
          <ItemLayout>
            <Typography
              variant="body1Bold"
              style={{ color: theme.colors.bottomSheet.text.primary }}
            >
              {t('selectSatisfiedPoints')}
            </Typography>
            <View
              style={{
                flexDirection: 'row',
                gap: baseTokens.spacing[1],
                flexWrap: 'wrap',
              }}
            >
              {satisfiedItems.map((item) => (
                <Pressable
                  onPress={() => {
                    if (initialError) {
                      return;
                    }

                    setIsError({ isValid: true, errorMessage: '' });
                    setSatisfiedItems(
                      satisfiedItems.map((el) => {
                        if (el.id === item.id) {
                          return { ...el, selected: !el.selected };
                        }
                        return el;
                      }),
                    );
                  }}
                  key={item.nameKey}
                  style={{
                    backgroundColor: item.selected
                      ? theme.colors.bottomSheet.buttonBackground
                      : theme.colors.bottomSheet.background,
                    paddingHorizontal: baseTokens.spacing[2],
                    paddingVertical: baseTokens.spacing[1],
                    borderRadius: baseTokens.borderRadius.sm,
                    borderWidth: scale(1.3),
                    borderColor: item.selected
                      ? theme.colors.pages.main.sessionCard.border
                      : theme.colors.bottomSheet.border,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography
                    variant="body1Regular"
                    style={{
                      color: item.selected
                        ? theme.colors.background
                        : theme.colors.text.secondary,
                    }}
                  >
                    {t(item.nameKey)}
                  </Typography>
                </Pressable>
              ))}
            </View>
          </ItemLayout>

          <ItemLayout>
            <Typography
              variant="body1Bold"
              style={{ color: theme.colors.bottomSheet.text.primary }}
            >
              {t('improvementSuggestions')}
            </Typography>
            <View style={{ gap: baseTokens.spacing[1] }}>
              <BottomSheetTextInput
                onChangeText={(text) => {
                  setFeedback(text);
                  if (initialError) {
                    return;
                  }

                  setIsError({ isValid: true, errorMessage: '' });
                }}
                value={feedback}
                placeholder={t('sessionNamePlaceholder')}
                placeholderTextColor={theme.colors.bottomSheet.text.placeholder}
                multiline={true}
                textAlignVertical="top"
                style={{
                  borderWidth: scale(1.3),
                  borderColor: theme.colors.bottomSheet.border,
                  paddingHorizontal: baseTokens.spacing[3],
                  paddingVertical: baseTokens.spacing[3],
                  borderRadius: baseTokens.borderRadius.sm,
                  color: theme.colors.bottomSheet.text.primary,
                  fontSize: baseTokens.typography.body2Regular.fontSize,
                  fontFamily: baseTokens.typography.body2Regular.fontFamily,
                  height: scale(150),
                }}
              />
              {!isError.isValid && (
                <Typography
                  variant="label"
                  style={{ color: theme.colors.text.error }}
                >
                  {isError.errorMessage}
                </Typography>
              )}
            </View>
            <Pressable
              onPress={async (e) => {
                if (initialError) {
                  return;
                }

                const validation = await isValidFeedback(
                  rating,
                  satisfiedItems,
                  feedback,
                  t,
                );
                if (!validation.isValid) {
                  setIsError(validation);
                  return;
                }

                hapticSettings();

                try {
                  feedbackBottomSheetRef.current?.close();
                  Keyboard.dismiss();

                  const checked = satisfiedItems
                    .filter((el) => el.selected)
                    .map((el) => el.nameKey)
                    .join(' | ');

                  const rawBody = JSON.stringify({ feedback, checked, rating });
                  const timestamp = Math.floor(Date.now() / 1000).toString();

                  await EmailSentService.sendEmail(
                    'feedback',
                    timestamp,
                    rawBody,
                  );

                  setFeedback('');
                  setIsError({ isValid: true, errorMessage: '' });
                  setSatisfiedItems(
                    satisfiedItems.map((el) => ({ ...el, selected: false })),
                  );
                  setRating(0);
                  setIsLoading(true);
                } catch {
                  // Handle error silently
                }

                e.stopPropagation();
              }}
              style={{
                backgroundColor: theme.colors.bottomSheet.buttonBackground,
                borderWidth: scale(1.3),
                borderColor:
                  theme.colors.pages.main.sessionCard.addButtonBorder,
                paddingHorizontal: baseTokens.spacing[3],
                borderRadius: baseTokens.borderRadius.sm,
                alignItems: 'center',
                justifyContent: 'center',
                height: scale(50),
                opacity: !isError.isValid ? 0.3 : 1,
              }}
            >
              {isLoading ? (
                <ActivityIndicator
                  size="small"
                  color={theme.colors.background}
                />
              ) : (
                <Typography
                  variant="body1Bold"
                  style={{ color: theme.colors.background }}
                >
                  {t('submitButton')}
                </Typography>
              )}
            </Pressable>
          </ItemLayout>
        </Pressable>
      </BottomSheetView>
    </BottomSheet>
  );
}

function ItemLayout({ children }: { children: React.ReactNode }) {
  return (
    <View
      style={{
        marginBottom: baseTokens.spacing[2],
        gap: baseTokens.spacing[2],
      }}
    >
      {children}
    </View>
  );
}

export default FeedbackBottomSheet;
