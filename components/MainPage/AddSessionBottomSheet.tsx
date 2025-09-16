import { sessionService } from '@/services/SessionService';
import { baseTokens, Theme } from '@/styles';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetTextInput,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Keyboard, Pressable } from 'react-native';
import { scale } from 'react-native-size-matters';
import Typography from '../common/Typography';

function AddSessionBottomSheet({
  addSessionBottomSheetRef,
  theme,
}: {
  addSessionBottomSheetRef: React.RefObject<BottomSheetMethods>;
  theme: Theme;
}) {
  const { t } = useTranslation('main');
  const [sessionName, setSessionName] = useState('');

  const renderBackdrop = useCallback(
    (props: React.ComponentProps<typeof BottomSheetBackdrop>) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        enableTouchThrough={false}
        onPress={() => {
          Keyboard.dismiss();
          setSessionName('');
        }}
      />
    ),
    [],
  );

  return (
    <BottomSheet
      ref={addSessionBottomSheetRef}
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
            addSessionBottomSheetRef.current?.snapToIndex(0);
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
          <Typography
            variant="body1Bold"
            style={{ color: theme.colors.bottomSheet.text.primary }}
          >
            {t('addNewSessionTitle')}
          </Typography>
          <BottomSheetTextInput
            onChangeText={(text) => {
              setSessionName(text);
            }}
            value={sessionName}
            placeholder={t('sessionNamePlaceholder')}
            placeholderTextColor={theme.colors.bottomSheet.text.placeholder}
            style={{
              borderWidth: scale(1.3),
              borderColor: theme.colors.bottomSheet.border,
              paddingHorizontal: baseTokens.spacing[3],
              borderRadius: baseTokens.borderRadius.sm,
              color: theme.colors.bottomSheet.text.primary,
              fontSize: baseTokens.typography.body2Regular.fontSize,
              fontFamily: baseTokens.typography.body2Regular.fontFamily,
              height: scale(50),
            }}
          />
          <Pressable
            onPress={async (e) => {
              try {
                await sessionService.addSession({
                  sessionName: sessionName,
                });
                setSessionName('');
                addSessionBottomSheetRef.current?.close();
                Keyboard.dismiss();
              } catch (error) {
                console.error(error);
              }

              e.stopPropagation();
            }}
            style={{
              backgroundColor: theme.colors.bottomSheet.buttonBackground,
              borderWidth: scale(1.3),
              borderColor: theme.colors.pages.main.sessionCard.addButtonBorder,
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
              {t('addButton')}
            </Typography>
          </Pressable>
        </Pressable>
      </BottomSheetView>
    </BottomSheet>
  );
}

export default AddSessionBottomSheet;
