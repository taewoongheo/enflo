import Typography from '@/components/common/Typography';
import { useTheme } from '@/contexts/ThemeContext';
import { sessionMockData } from '@/data/sessionMockData';
import Session from '@/models/Session';
import { baseTokens } from '@/styles';
import { formatMsToTime } from '@/utils/time';
import { Fontisto } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { scale } from 'react-native-size-matters';

const SessionList = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const { theme } = useTheme();

  useEffect(() => {
    setSessions(sessionMockData);
  }, []);

  return (
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
  );
};

export default SessionList;
