import { useEntropyStore } from '@/store/entropyStore';
import { baseTokens, Theme } from '@/styles';
import { normalizeScoreToEntropy } from '@/utils/score';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Keyboard, Pressable, View } from 'react-native';
import { scale } from 'react-native-size-matters';
import Typography from '../common/Typography';

interface CaptionBottomSheetProps {
  captionBottomSheetRef: React.RefObject<BottomSheetMethods>;
  theme: Theme;
}

function CaptionBottomSheet({
  captionBottomSheetRef,
  theme,
}: CaptionBottomSheetProps) {
  const router = useRouter();
  const entropyScore = useEntropyStore((state) => state.entropyScore);
  const { t } = useTranslation('settings');

  const renderBackdrop = useCallback(
    (props: React.ComponentProps<typeof BottomSheetBackdrop>) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        enableTouchThrough={false}
        onPress={() => {
          Keyboard.dismiss();
          captionBottomSheetRef.current?.close();
        }}
      />
    ),
    [captionBottomSheetRef],
  );

  return (
    <BottomSheet
      bottomInset={baseTokens.spacing[7]}
      detached={true}
      ref={captionBottomSheetRef}
      index={-1}
      enablePanDownToClose={true}
      backdropComponent={renderBackdrop}
      style={{
        marginHorizontal: baseTokens.spacing[4],
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
        backgroundColor: theme.colors.bottomSheet.text.placeholder,
        width: scale(40),
        height: scale(4),
      }}
      keyboardBehavior="interactive"
    >
      <BottomSheetView
        style={{
          flex: 1,
          backgroundColor: theme.colors.bottomSheet.background,
          borderRadius: baseTokens.borderRadius.lg,
          paddingHorizontal: baseTokens.spacing[4],
          paddingVertical: baseTokens.spacing[3],
          paddingBottom: baseTokens.spacing[6],
        }}
      >
        <View style={{ gap: baseTokens.spacing[3] }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'baseline',
              gap: baseTokens.spacing[1],
            }}
          >
            <Typography
              variant="title1Bold"
              style={{
                color: theme.colors.text.primary,
                textAlign: 'left',
              }}
            >
              {normalizeScoreToEntropy(entropyScore)}
            </Typography>
            <Typography
              variant="label"
              style={{
                color: theme.colors.text.secondary,
                textAlign: 'left',
              }}
            >
              {t('entropy')}
            </Typography>
          </View>

          <Typography
            variant="body1Regular"
            style={{
              color: theme.colors.text.primary,
            }}
          >
            {t('entropyDescription')}
          </Typography>
          <Typography
            variant="body1Bold"
            style={{
              color: theme.colors.text.primary,
            }}
          >
            {t('entropyOverTime')}
          </Typography>
          <Pressable
            onPress={() => {
              captionBottomSheetRef.current?.close();
              router.push('/settings/howToUse');
            }}
          >
            <Typography
              variant="body1Regular"
              style={{
                color: theme.colors.pages.timer.slider.picker,
                lineHeight: baseTokens.typography.body1Regular.fontSize * 1.5,
              }}
            >
              {t('wantToDiveDeeper')}
            </Typography>
          </Pressable>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
}

export default CaptionBottomSheet;
