import { createAllMockSessions } from '@/data/sessionMockData';
import { INSERT_MOCK_DATA } from '@/environment.config';
import { sessionService } from '@/services/SessionService';
import { timerService } from '@/services/TimerService';
import { useSessionCache } from '@/store/sessionCache';
import { baseTokens } from '@/styles';
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import SessionCard from './SessionCard';

const SessionList = () => {
  const sessions = useSessionCache((s) => Object.values(s.sessionCache));

  useEffect(() => {
    const insertMockSessions = async () => {
      try {
        await sessionService.clear();
        await timerService.clear();

        const sessions = await createAllMockSessions();
        useSessionCache.getState().setSessions(sessions);
      } catch (error) {
        throw error;
      }
    };

    if (INSERT_MOCK_DATA) {
      insertMockSessions();
    }
  }, []);

  return (
    <FlatList
      data={sessions}
      keyExtractor={(item) => item.sessionId}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.flatListContent}
      renderItem={({ item }) => <SessionCard item={item} />}
    />
  );
};

export default SessionList;

const styles = StyleSheet.create({
  flatListContent: {
    gap: baseTokens.spacing[2],
    marginVertical: baseTokens.spacing[4],
  },
});
