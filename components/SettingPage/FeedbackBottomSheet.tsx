import { baseTokens, Theme } from '@/styles';
import { signRequest } from '@/utils/auth';
import { FontAwesome } from '@expo/vector-icons';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetTextInput,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Keyboard, Pressable, View } from 'react-native';
import { scale } from 'react-native-size-matters';
import Typography from '../common/Typography';

function FeedbackBottomSheet({
  feedbackBottomSheetRef,
  theme,
}: {
  feedbackBottomSheetRef: React.RefObject<BottomSheetMethods>;
  theme: Theme;
}) {
  const { t } = useTranslation('settings');

  const [feedback, setFeedback] = useState('');

  const [rating, setRating] = useState(0);

  const [satisfiedItems, setSatisfiedItems] = useState([
    {
      id: 0,
      name: '엔트로피 시각화',
      selected: false,
    },
    {
      id: 1,
      name: '집중 분석/통계',
      selected: false,
    },
    {
      id: 2,
      name: '디자인',
      selected: false,
    },
    {
      id: 3,
      name: '기능 편리함',
      selected: false,
    },
    {
      id: 4,
      name: '동기 부여',
      selected: false,
    },
    {
      id: 5,
      name: '기타',
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
          setSatisfiedItems(
            satisfiedItems.map((el) => ({ ...el, selected: false })),
          );
          setRating(0);
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
              {t('앱은 어떠셨나요?')}
            </Typography>
            <View style={{ flexDirection: 'row', gap: baseTokens.spacing[3] }}>
              {Array.from({ length: 5 }).map((_, index) => (
                <Pressable onPress={() => setRating(index + 1)} key={index}>
                  <FontAwesome
                    name={index < rating ? 'star' : 'star-o'}
                    size={24}
                    color={theme.colors.bottomSheet.text.primary}
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
              {t('만족스러웠던 점을 선택해주세요(중복)')}
            </Typography>
            <View
              style={{
                flexDirection: 'row',
                gap: baseTokens.spacing[3],
                flexWrap: 'wrap',
              }}
            >
              {satisfiedItems.map((item) => (
                <Pressable
                  onPress={() => {
                    setSatisfiedItems(
                      satisfiedItems.map((el) => {
                        if (el.id === item.id) {
                          return { ...el, selected: !el.selected };
                        }
                        return el;
                      }),
                    );
                  }}
                  key={item.name}
                  style={{
                    backgroundColor: item.selected
                      ? theme.colors.bottomSheet.buttonBackground
                      : theme.colors.bottomSheet.background,
                    paddingHorizontal: baseTokens.spacing[2],
                    paddingVertical: baseTokens.spacing[1],
                    borderRadius: baseTokens.borderRadius.sm,
                    borderWidth: scale(1.3),
                    borderColor: theme.colors.bottomSheet.border,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography
                    variant="body1Regular"
                    style={{
                      color: item.selected
                        ? theme.colors.background
                        : theme.colors.bottomSheet.text.primary,
                    }}
                  >
                    {item.name}
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
              {t('개선되었으면 하는 부분이 있다면 알려주세요')}
            </Typography>
            <BottomSheetTextInput
              onChangeText={(text) => {
                setFeedback(text);
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
            <Pressable
              onPress={async (e) => {
                try {
                  feedbackBottomSheetRef.current?.close();
                  Keyboard.dismiss();

                  const checked = satisfiedItems
                    .filter((el) => el.selected)
                    .map((el) => el.name)
                    .join(' | ');

                  const rawBody = JSON.stringify({ feedback, checked, rating });
                  const timestamp = Math.floor(Date.now() / 1000).toString();

                  await fetch(`${process.env.EXPO_PUBLIC_API_URL}/feedback`, {
                    method: 'POST',
                    body: rawBody,
                    headers: {
                      'Content-Type': 'application/json',
                      'x-timestamp': timestamp,
                      'x-signature': signRequest(
                        'POST',
                        '/feedback',
                        timestamp,
                        rawBody,
                      ),
                    },
                  });

                  setFeedback('');
                  setSatisfiedItems(
                    satisfiedItems.map((el) => ({ ...el, selected: false })),
                  );
                  setRating(0);
                } catch (error) {
                  console.error(error);
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
              }}
            >
              <Typography
                variant="body1Bold"
                style={{ color: theme.colors.background }}
              >
                {t('submitButton')}
              </Typography>
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
