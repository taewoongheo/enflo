import Typography from '@/components/common/Typography';
import { baseTokens, Theme } from '@/styles';
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

interface FlowPatternBottomSheetProps {
  flowPatternBottomSheetRef: React.RefObject<BottomSheetMethods>;
  feedbackBottomSheetRef: React.RefObject<BottomSheetMethods>;
  theme: Theme;
}

function FlowPatternBottomSheet({
  flowPatternBottomSheetRef,
  feedbackBottomSheetRef,
  theme,
}: FlowPatternBottomSheetProps) {
  const router = useRouter();
  const { t } = useTranslation('timer');

  const renderBackdrop = useCallback(
    (props: React.ComponentProps<typeof BottomSheetBackdrop>) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        enableTouchThrough={false}
        onPress={() => {
          Keyboard.dismiss();
          flowPatternBottomSheetRef.current?.close();
        }}
      />
    ),
    [flowPatternBottomSheetRef],
  );

  return (
    <BottomSheet
      bottomInset={baseTokens.spacing[7]}
      detached={true}
      ref={flowPatternBottomSheetRef}
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
          <Typography
            variant="title3Bold"
            style={{
              color: theme.colors.text.primary,
            }}
          >
            {t('focusSuggestion')}
          </Typography>
          <Typography
            variant="body1Regular"
            style={{
              color: theme.colors.text.primary,
            }}
          >
            {t('flowPatternAnalysis')}
          </Typography>
          <Typography
            variant="body1Regular"
            style={{
              color: theme.colors.text.primary,
            }}
          >
            {t('flowPatternAnalysis2')}
          </Typography>
          <Pressable
            onPress={() => {
              flowPatternBottomSheetRef.current?.close();
              feedbackBottomSheetRef.current?.expand();
              router.replace('/settings');
            }}
          >
            <Typography
              variant="body1Regular"
              style={{
                color: theme.colors.pages.timer.slider.picker,
                lineHeight: baseTokens.typography.body1Regular.fontSize * 1.5,
              }}
            >
              {t('flowPatternAnalysisFeedback')}
            </Typography>
          </Pressable>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
}

export default FlowPatternBottomSheet;
