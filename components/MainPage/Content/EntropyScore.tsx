import { requestPermissionsAsync } from '@/app/_layout';
import { ENTROPY_SYSTEM_GLOBAL_CONSTANTS } from '@/components/MainPage/constants/entropySystem/entropySystem';
import Typography from '@/components/common/Typography';
import { useBottomSheet } from '@/contexts/BottomSheetContext';
import { useTheme } from '@/contexts/ThemeContext';
import { entropyService } from '@/services/EntropyService';
import { notificationService } from '@/services/NotificationService';
import { useEntropyStore } from '@/store/entropyStore';
import { baseTokens } from '@/styles';
import { log } from '@/utils/log';
import { clamp } from '@/utils/math';
import { normalizeScoreToEntropy } from '@/utils/score';
import { AntDesign } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { Pressable } from 'react-native-gesture-handler';

const EntropyScore = () => {
  const { theme } = useTheme();
  const entropyScore = useEntropyStore((s) => s.entropyScore);
  const { captionBottomSheetRef } = useBottomSheet();
  const router = useRouter();

  const entropyStateSnapshot = useRef<{
    entropyScore: number;
    delta: number;
    updatedAt: number;
  } | null>(null);

  const updateDBRef = useRef<number | null>(null);

  useEffect(() => {
    entropyStateSnapshot.current = {
      entropyScore: entropyScore,
      delta: 0,
      updatedAt: Date.now(),
    };
  }, [entropyScore]);

  useFocusEffect(
    useCallback(() => {
      updateDBRef.current = setInterval(async () => {
        if (!entropyStateSnapshot.current) {
          return;
        }

        const now = Date.now();
        const { entropyScore, delta } = getNewEntropyScore(
          entropyStateSnapshot.current.entropyScore,
          entropyStateSnapshot.current.updatedAt,
          now,
        );

        try {
          await entropyService.updateEntropy(entropyScore, now);

          entropyStateSnapshot.current = {
            entropyScore: entropyScore,
            delta: delta,
            updatedAt: now,
          };
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(error);
        }
      }, ENTROPY_SYSTEM_GLOBAL_CONSTANTS.ENTROPY_SCORE_UPDATE_INTERVAL_MS);

      return () => {
        if (updateDBRef.current) {
          clearInterval(updateDBRef.current);
          updateDBRef.current = null;
        }

        if (!entropyStateSnapshot.current) {
          return;
        }

        entropyService.updateEntropy(
          entropyStateSnapshot.current.entropyScore,
          entropyStateSnapshot.current.updatedAt,
        );
      };
    }, []),
  );

  useEffect(() => {
    const updateGlobalEntropyStatus = async () => {
      const entropy = await entropyService.getEntropy();

      const now = Date.now();
      if (!entropy) {
        await entropyService.initializeEntropy(
          ENTROPY_SYSTEM_GLOBAL_CONSTANTS.INITIAL_ENTROPY_SCORE,
          now,
        );

        log(`entropy 초기화`);

        router.replace('/settings/intro');
        return;
      }

      log(`현재 entropy: ${entropy.entropyScore}`);

      try {
        // 알람 권한 요청 체크, undetermined 일 시 요청
        const permission = await Notifications.getPermissionsAsync();
        if (permission.status === Notifications.PermissionStatus.UNDETERMINED) {
          const res = await requestPermissionsAsync();
          notificationService.upsertNotificationSetting(
            res.status === Notifications.PermissionStatus.GRANTED,
          );
        }

        const { entropyScore, delta } = getNewEntropyScore(
          entropy.entropyScore,
          entropy.updatedAt,
          now,
        );

        await entropyService.updateEntropy(entropyScore, now);

        entropyStateSnapshot.current = {
          entropyScore: entropyScore,
          delta: delta,
          updatedAt: now,
        };
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    };

    updateGlobalEntropyStatus();
  }, []);

  return (
    <Pressable
      style={[styles.entropyScoreContainer]}
      onPress={() => {
        captionBottomSheetRef.current?.expand();
      }}
    >
      <Typography
        variant="title1Bold"
        style={{ color: theme.colors.text.primary }}
      >
        {normalizeScoreToEntropy(entropyScore)}
      </Typography>
      <AntDesign
        name="questioncircle"
        size={baseTokens.iconSize.xs}
        color={theme.colors.text.secondary}
        style={styles.iconSpacing}
      />
    </Pressable>
  );
};

function getNewEntropyScore(entropy: number, updatedAt: number, now: number) {
  const diffMin = (now - updatedAt) / 60000;
  const delta = diffMin * ENTROPY_SYSTEM_GLOBAL_CONSTANTS.DELTA_PER_MINUTE;
  return {
    entropyScore: clamp(
      entropy - delta,
      ENTROPY_SYSTEM_GLOBAL_CONSTANTS.MIN_ENTROPY_SCORE,
      ENTROPY_SYSTEM_GLOBAL_CONSTANTS.MAX_ENTROPY_SCORE,
    ),
    delta: delta,
  };
}

const styles = StyleSheet.create({
  entropyScoreContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
  },
  iconSpacing: {
    marginTop: baseTokens.spacing[2],
    marginLeft: baseTokens.spacing[1],
  },
});

export default EntropyScore;
