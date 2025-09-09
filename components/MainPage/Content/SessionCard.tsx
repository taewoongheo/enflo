import Typography from '@/components/common/Typography';
import { useBottomSheet } from '@/contexts/BottomSheetContext';
import { useTheme } from '@/contexts/ThemeContext';
import Session from '@/models/Session';
import { baseTokens } from '@/styles';
import { formatMsToTime } from '@/utils/time';
import { AntDesign, Fontisto } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Pressable } from 'react-native-gesture-handler';
import { scale } from 'react-native-size-matters';
import { ADD_SESSION_ID } from './SessionList';

// const IOS_GRADIENT_OFFSET = 0.15;
// const ANDROID_GRADIENT_OFFSET = 0.09;

// const gradientOffset =
//   Platform.OS === 'ios' ? IOS_GRADIENT_OFFSET : ANDROID_GRADIENT_OFFSET;

function SessionCard({ item }: { item: Session | { sessionId: string } }) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();

  const { addSessionBottomSheetRef } = useBottomSheet();

  const sessionCardStyle = theme.colors.pages.main.sessionCard;

  const handleSessionCardClick = () => {
    router.push({
      pathname: '/timer',
      params: {
        sessionId: item.sessionId,
      },
    });
  };

  const handleAddSessionClick = () => {
    addSessionBottomSheetRef.current?.expand();
  };

  return (
    <View>
      {item.sessionId === ADD_SESSION_ID ? (
        <Pressable
          onPress={handleAddSessionClick}
          style={[
            {
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: baseTokens.borderRadius.sm,
              borderWidth: 1,
              borderColor: sessionCardStyle.addButtonBorder,
              paddingHorizontal: baseTokens.spacing[3],
              backgroundColor: theme.colors.text.secondary,
            },
          ]}
        >
          <AntDesign name="plus" size={24} color={theme.colors.background} />
        </Pressable>
      ) : (
        <Pressable
          onPress={handleSessionCardClick}
          style={[
            styles.sessionCard,
            {
              borderColor: sessionCardStyle.border,
              backgroundColor: theme.colors.pages.main.sessionCard.background,
            },
          ]}
        >
          {/* <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: gradientOffset, y: 0 }}
        colors={[themeBackground, themeEdgeGradient]}
        style={styles.linearGradient}
      />

      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: gradientOffset }}
        colors={[themeBackground, themeEdgeGradient]}
        style={styles.linearGradient}
      />

      <LinearGradient
        start={{ x: 1, y: 1 }}
        end={{ x: 1, y: 1 - gradientOffset }}
        colors={[themeBackground, themeEdgeGradient]}
        style={styles.linearGradient}
      />

      <LinearGradient
        start={{ x: 1, y: 1 }}
        end={{ x: 1 - gradientOffset, y: 1 }}
        colors={[themeBackground, themeEdgeGradient]}
        style={[styles.linearGradient]}
      /> */}
          <Typography
            variant="body1Regular"
            style={{ color: sessionCardStyle.text.name }}
            numberOfLines={2}
          >
            {item instanceof Session ? item.sessionName : item.sessionId}
          </Typography>
          <View>
            <Typography
              variant="label"
              style={{ color: sessionCardStyle.text.label }}
            >
              {t('totalDuration')}
            </Typography>
            <View style={styles.sessionCardRow}>
              <Typography
                variant="title1Bold"
                style={{
                  color: sessionCardStyle.text.timer,
                }}
              >
                {formatMsToTime(
                  item instanceof Session ? item.totalNetFocusMs : 0,
                )}
              </Typography>
              <Fontisto
                name="play"
                size={baseTokens.iconSize.lg - scale(2)}
                color={sessionCardStyle.text.timer}
              />
            </View>
          </View>
        </Pressable>
      )}
    </View>
  );
}

export default SessionCard;

const styles = StyleSheet.create({
  sessionCard: {
    width: scale(200),
    height: scale(150),
    padding: baseTokens.spacing[4],
    borderRadius: baseTokens.borderRadius.sm,
    justifyContent: 'space-between',
    borderWidth: 1,
    // overflow: 'hidden',
  },
  sessionCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: baseTokens.spacing[2],
  },
  linearGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: baseTokens.borderRadius.md,
  },
});
