import { sessionService } from '@/services/SessionService';
import { useSessionCache } from '@/store/sessionCache';
import { baseTokens, Theme } from '@/styles';
import BottomSheet, {
  BottomSheetBackdropProps,
  BottomSheetTextInput,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { useGlobalSearchParams, useRouter, useSegments } from 'expo-router';
import React, { FC, useEffect, useState } from 'react';
import { Keyboard, Pressable } from 'react-native';
import { scale } from 'react-native-size-matters';
import Typography from '../common/Typography';

function EditSessionBottomSheet({
  theme,
  editSessionBottomSheetRef,
  renderBackdrop,
}: {
  theme: Theme;
  editSessionBottomSheetRef: React.RefObject<BottomSheetMethods>;
  renderBackdrop: FC<BottomSheetBackdropProps>;
}) {
  const router = useRouter();

  const segment = useSegments();
  const globalParams = useGlobalSearchParams();
  const sessionId = globalParams.sessionId as string;
  const [sessionName, setSessionName] = useState('');

  const sessions = useSessionCache((s) => s.sessionCache);

  useEffect(() => {
    if (segment[0] !== 'timer') {
      return;
    }
    const session = sessions[sessionId];
    if (!session) {
      return;
    }
    setSessionName(session.sessionName);
  }, [sessionId, sessions]);

  return (
    <BottomSheet
      ref={editSessionBottomSheetRef}
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
            editSessionBottomSheetRef.current?.snapToIndex(0);
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
            세션 이름 수정
          </Typography>
          <BottomSheetTextInput
            onChangeText={(text) => {
              setSessionName(text);
            }}
            value={sessionName}
            placeholder="세션 이름"
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
                await sessionService.updateSessionName({
                  sessionId: sessionId,
                  sessionName: sessionName,
                });

                editSessionBottomSheetRef.current?.close();
                Keyboard.dismiss();
              } catch (error) {
                console.error(error);
              }

              e.stopPropagation();
            }}
            style={{
              backgroundColor: theme.colors.text.secondary,
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
              수정
            </Typography>
          </Pressable>
          <Pressable
            onPress={async (e) => {
              try {
                await sessionService.deleteSession({
                  sessionId: sessionId,
                });
                editSessionBottomSheetRef.current?.close();
                router.back();

                Keyboard.dismiss();
              } catch (error) {
                console.error(error);
              }

              e.stopPropagation();
            }}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              height: scale(50),
            }}
          >
            <Typography variant="body1Regular" style={{ color: 'tomato' }}>
              세션 삭제
            </Typography>
          </Pressable>
        </Pressable>
      </BottomSheetView>
    </BottomSheet>
  );
}

export default EditSessionBottomSheet;
