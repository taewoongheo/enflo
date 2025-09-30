import Typography from '@/components/common/Typography';
import { baseTokens, Theme } from '@/styles';
import { signRequest } from '@/utils/auth';
import { hapticSettings } from '@/utils/haptics';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetTextInput,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import Constants from 'expo-constants';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Keyboard, Pressable, View } from 'react-native';
import { scale } from 'react-native-size-matters';
import ProTitleHighlight from './ProTitleHighlight';

const EMAIL_API_URL = Constants.expoConfig?.extra?.EMAIL_API_URL;

const isValidEmail = (
  email: string,
  t: (key: string) => string,
): { isValid: boolean; errorMessage?: string } => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (email.length === 0) {
    return {
      isValid: false,
      errorMessage: t('validation.emailRequired'),
    };
  }

  if (email.length > 255) {
    return {
      isValid: false,
      errorMessage: t('validation.emailTooLong'),
    };
  }

  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      errorMessage: t('validation.emailInvalid'),
    };
  }

  return { isValid: true };
};

interface ProInfoBottomSheetProps {
  proInfoBottomSheetRef: React.RefObject<BottomSheetMethods>;
  theme: Theme;
}

function ProInfoBottomSheet({
  proInfoBottomSheetRef,
  theme,
}: ProInfoBottomSheetProps) {
  const { t } = useTranslation('proinfo');
  const [email, setEmail] = useState('');
  const [isError, setIsError] = useState<{
    isValid: boolean;
    errorMessage?: string;
  }>({
    isValid: true,
    errorMessage: '',
  });

  const renderBackdrop = useCallback(
    (props: React.ComponentProps<typeof BottomSheetBackdrop>) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        enableTouchThrough={false}
        onPress={() => {
          Keyboard.dismiss();
          setIsError({ isValid: true, errorMessage: '' });
          setEmail('');
          proInfoBottomSheetRef.current?.close();
        }}
      />
    ),
    [proInfoBottomSheetRef],
  );

  return (
    <BottomSheet
      bottomInset={baseTokens.spacing[6]}
      detached={true}
      ref={proInfoBottomSheetRef}
      index={-1}
      enablePanDownToClose={true}
      backdropComponent={renderBackdrop}
      style={{
        marginHorizontal: baseTokens.spacing[2],
      }}
      backgroundStyle={{
        backgroundColor: theme.colors.bottomSheet.background,
        borderRadius: baseTokens.borderRadius.lg,
      }}
      handleStyle={{
        backgroundColor: 'transparent',
        borderTopStartRadius: baseTokens.borderRadius.lg,
        borderTopEndRadius: baseTokens.borderRadius.lg,
      }}
      handleIndicatorStyle={{
        height: scale(0),
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
            proInfoBottomSheetRef.current?.snapToIndex(0);
            Keyboard.dismiss();
          }}
          style={{
            flex: 1,
            backgroundColor: theme.colors.bottomSheet.background,
            borderRadius: baseTokens.borderRadius.lg,
            paddingHorizontal: baseTokens.spacing[4],
            paddingVertical: baseTokens.spacing[3],
            paddingBottom: baseTokens.spacing[6],
            gap: baseTokens.spacing[6],
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ProTitleHighlight theme={theme} />
          <View style={{ width: '100%', gap: baseTokens.spacing[11] }}>
            <View style={{ gap: baseTokens.spacing[4] }}>
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: baseTokens.spacing[1],
                  }}
                >
                  <Ionicons
                    name="sparkles"
                    size={baseTokens.iconSize.md}
                    color={theme.colors.text.primary}
                  />
                  <Typography
                    variant="title3Bold"
                    style={{
                      color: theme.colors.text.primary,
                    }}
                  >
                    {t('features.analysis.title')}
                  </Typography>
                </View>
                <Typography
                  variant="body1Regular"
                  style={{ color: theme.colors.text.secondary }}
                >
                  {t('features.analysis.description')}
                </Typography>
              </View>
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: baseTokens.spacing[1],
                  }}
                >
                  <Ionicons
                    name="color-palette-sharp"
                    size={baseTokens.iconSize.md}
                    color={theme.colors.text.primary}
                  />
                  <Typography
                    variant="title3Bold"
                    style={{
                      color: theme.colors.text.primary,
                    }}
                  >
                    {t('features.themes.title')}
                  </Typography>
                </View>
                <Typography
                  variant="body1Regular"
                  style={{ color: theme.colors.text.secondary }}
                >
                  {t('features.themes.description')}
                </Typography>
              </View>
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: baseTokens.spacing[1],
                  }}
                >
                  <Ionicons
                    name="stats-chart"
                    size={baseTokens.iconSize.md}
                    color={theme.colors.text.primary}
                  />
                  <Typography
                    variant="title3Bold"
                    style={{
                      color: theme.colors.text.primary,
                    }}
                  >
                    {t('features.insights.title')}
                  </Typography>
                </View>
                <Typography
                  variant="body1Regular"
                  style={{ color: theme.colors.text.secondary }}
                >
                  {t('features.insights.description')}
                </Typography>
              </View>
            </View>
          </View>
        </Pressable>
        <View
          style={{
            gap: baseTokens.spacing[4],
            backgroundColor: theme.colors.proPromotion.background,
            paddingHorizontal: baseTokens.spacing[4],
            paddingVertical: baseTokens.spacing[5],
            paddingBottom: baseTokens.spacing[6],
            borderRadius: baseTokens.borderRadius.lg,
          }}
        >
          <Typography
            variant="body1Bold"
            style={{
              color: theme.colors.background,
            }}
          >
            {t('emailNotificationText')}
          </Typography>
          <View style={{ gap: baseTokens.spacing[1] }}>
            <BottomSheetTextInput
              onChangeText={(text) => {
                setEmail(text);
              }}
              value={email}
              placeholder={t('emailPlaceholder')}
              placeholderTextColor={theme.colors.proPromotion.placeholderText}
              multiline={false}
              textAlignVertical="center"
              style={{
                borderWidth: scale(1.3),
                borderColor: theme.colors.text.secondary,
                paddingHorizontal: baseTokens.spacing[3],
                paddingVertical: baseTokens.spacing[3],
                borderRadius: baseTokens.borderRadius.sm,
                color: theme.colors.background,
                fontSize: baseTokens.typography.body2Regular.fontSize,
                fontFamily: baseTokens.typography.body2Regular.fontFamily,
                height: scale(50),
              }}
            />
            {!isError.isValid && (
              <Typography
                variant="label"
                style={{ color: theme.colors.proPromotion.errorText }}
              >
                {isError.errorMessage}
              </Typography>
            )}
          </View>
          <Pressable
            onPress={async (e) => {
              const validation = isValidEmail(email, t);
              if (!validation.isValid) {
                setIsError(validation);
                return;
              }

              hapticSettings();

              try {
                proInfoBottomSheetRef.current?.close();
                Keyboard.dismiss();

                const rawBody = JSON.stringify({
                  feedback: 'pro 출시 알림',
                  checked: email,
                  rating: -1,
                });
                const timestamp = Math.floor(Date.now() / 1000).toString();

                await fetch(`${EMAIL_API_URL}/feedback`, {
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

                setEmail('');
                setIsError({ isValid: true, errorMessage: '' });
              } catch {
                // Handle error silently
              }

              e.stopPropagation();
            }}
            style={{
              backgroundColor: theme.colors.background,
              borderWidth: scale(1.3),
              borderColor: theme.colors.proPromotion.placeholderText,
              paddingHorizontal: baseTokens.spacing[3],
              borderRadius: baseTokens.borderRadius.sm,
              alignItems: 'center',
              justifyContent: 'center',
              height: scale(50),
            }}
          >
            <Typography
              variant="body1Bold"
              style={{ color: theme.colors.text.primary }}
            >
              {t('submitButton')}
            </Typography>
          </Pressable>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
}

export default ProInfoBottomSheet;
