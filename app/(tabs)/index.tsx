import { ContentLayout } from '@/components/common/ContentLayout';
import Typography from '@/components/common/Typography';
import EntropyCanvas from '@/components/MainPage/EntropyCanvas';
import { useTheme } from '@/contexts/ThemeContext';
import { sessionMockData } from '@/data/sessionMockData';
import Session from '@/models/Session';
import { baseTokens } from '@/styles';
import { AntDesign, Fontisto } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { scale } from 'react-native-size-matters';

export function formatMsToTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number) => String(n).padStart(2, '0');

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

function MainScreen() {
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    setSessions(sessionMockData);
  }, []);

  const { theme } = useTheme();
  const { t } = useTranslation('main');

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <EntropyCanvas />
        <ContentLayout>
          <TouchableOpacity
            style={styles.entropyScoreContainer}
            activeOpacity={0.7}
            onPress={() => {
              console.log('entropy score clicked');
            }}
          >
            <Typography
              variant="title1Bold"
              style={{ color: theme.colors.text.primary }}
            >
              0.23
            </Typography>
            <AntDesign
              name="questioncircle"
              size={14}
              color={theme.colors.text.secondary}
              style={{
                marginTop: baseTokens.spacing[2],
                marginLeft: baseTokens.spacing[1],
              }}
            />
          </TouchableOpacity>
          <Typography
            variant="body1Regular"
            style={{ color: theme.colors.text.secondary }}
          >
            {t('entropySuggestion')}
          </Typography>
          <FlatList
            data={sessions}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              gap: baseTokens.spacing[2],
              marginVertical: baseTokens.spacing[4],
            }}
            renderItem={({ item }) => (
              <View
                style={{
                  width: scale(200),
                  height: scale(120),
                  backgroundColor: theme.colors.text.secondary,
                  padding: baseTokens.spacing[3],
                  borderRadius: baseTokens.borderRadius.sm,
                  justifyContent: 'space-between',
                }}
              >
                <Typography
                  variant="body1Regular"
                  style={{ color: theme.colors.background }}
                >
                  {item.sessionName}
                </Typography>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: baseTokens.spacing[2],
                  }}
                >
                  <Typography
                    variant="title1Bold"
                    style={{ color: theme.colors.background }}
                  >
                    {formatMsToTime(item.totalNetFocusMs)}
                  </Typography>
                  <Fontisto
                    name="play"
                    size={scale(22)}
                    color={theme.colors.background}
                  />
                </View>
              </View>
            )}
          />
        </ContentLayout>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  entropyScoreContainer: {
    flexDirection: 'row',
  },
});

export default MainScreen;
