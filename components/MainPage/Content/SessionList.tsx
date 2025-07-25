import Typography from '@/components/common/Typography';
import { useTheme } from '@/contexts/ThemeContext';
import { sessionMockData } from '@/data/sessionMockData';
import Session from '@/models/Session';
import { baseTokens } from '@/styles';
import { formatMsToTime } from '@/utils/time';
import { Fontisto } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { scale } from 'react-native-size-matters';

const SessionList = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const { theme } = useTheme();
  const { t } = useTranslation();

  const themeBackground = theme.colors.sessionCard.background;
  const themeEdgeGradient = theme.colors.sessionCard.edgeGradient;
  const gradientOffset = Platform.OS === 'ios' ? 0.15 : 0.1;

  useEffect(() => {
    setSessions(sessionMockData);
  }, []);

  return (
    <FlatList
      data={sessions}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.flatListContent}
      renderItem={({ item }) => (
        <View
          style={[
            styles.sessionCard,
            {
              borderColor: theme.colors.sessionCard.border,
            },
          ]}
        >
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: gradientOffset, y: 0 }}
            colors={[themeBackground, themeEdgeGradient]}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />

          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: gradientOffset }}
            colors={[themeBackground, themeEdgeGradient]}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />

          <LinearGradient
            start={{ x: 1, y: 1 }}
            end={{ x: 1, y: 1 - gradientOffset }}
            colors={[themeBackground, themeEdgeGradient]}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />

          <LinearGradient
            start={{ x: 1, y: 1 }}
            end={{ x: 1 - gradientOffset, y: 1 }}
            colors={[themeBackground, themeEdgeGradient]}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: baseTokens.borderRadius.lg,
            }}
          />
          <Typography
            variant="body1Regular"
            style={{ color: theme.colors.sessionCard.text.name }}
          >
            {item.sessionName}
          </Typography>
          <View>
            <Typography
              variant="label"
              style={{ color: theme.colors.sessionCard.text.label }}
            >
              {t('totalDuration')}
            </Typography>
            <View style={styles.sessionCardRow}>
              <Typography
                variant="title1Bold"
                style={{ color: theme.colors.sessionCard.text.timer }}
              >
                {formatMsToTime(item.totalNetFocusMs)}
              </Typography>
              <Fontisto
                name="play"
                size={scale(22)}
                color={theme.colors.sessionCard.text.timer}
              />
            </View>
          </View>
        </View>
      )}
    />
  );
};

export default SessionList;

const styles = StyleSheet.create({
  flatListContent: {
    gap: baseTokens.spacing[2],
    marginVertical: baseTokens.spacing[4],
  },
  sessionCard: {
    width: scale(200),
    height: scale(150),
    padding: baseTokens.spacing[4],
    borderRadius: baseTokens.borderRadius.lg,
    justifyContent: 'space-between',
    borderWidth: 1.4,
    overflow: 'hidden',
  },
  sessionCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: baseTokens.spacing[2],
  },
});
