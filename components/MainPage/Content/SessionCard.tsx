import Typography from '@/components/common/Typography';
import { useTheme } from '@/contexts/ThemeContext';
import Session from '@/models/Session';
import { baseTokens } from '@/styles';
import { formatMsToTime } from '@/utils/time';
import { Fontisto } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { scale } from 'react-native-size-matters';

const IOS_GRADIENT_OFFSET = 0.15;
const ANDROID_GRADIENT_OFFSET = 0.09;

function SessionCard({ item }: { item: Session }) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();

  const sessionCardStyle = theme.colors.components.sessionCard;
  const themeBackground = sessionCardStyle.background;
  const themeEdgeGradient = sessionCardStyle.edgeGradient;

  const gradientOffset =
    Platform.OS === 'ios' ? IOS_GRADIENT_OFFSET : ANDROID_GRADIENT_OFFSET;

  return (
    <TouchableOpacity
      onPress={() => router.push('/timer')}
      style={[
        styles.sessionCard,
        {
          borderColor: sessionCardStyle.border,
        },
      ]}
    >
      <LinearGradient
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
      />
      <Typography
        variant="body1Regular"
        style={{ color: sessionCardStyle.text.name }}
        numberOfLines={2}
      >
        {item.sessionName}
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
            {formatMsToTime(item.totalNetFocusMs)}
          </Typography>
          <Fontisto
            name="play"
            size={scale(22)}
            color={sessionCardStyle.text.timer}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default SessionCard;

const styles = StyleSheet.create({
  sessionCard: {
    width: scale(200),
    height: scale(150),
    padding: baseTokens.spacing[4],
    borderRadius: baseTokens.borderRadius.lg,
    justifyContent: 'space-between',
    borderWidth: 1.3,
    overflow: 'hidden',
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
  },
});
