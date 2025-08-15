import { createAllMockSessions } from '@/data/sessionMockData';
import { INSERT_MOCK_DATA } from '@/environment.config';
import Session from '@/models/Session';
import { sessionService } from '@/services/SessionService';
import { timerService } from '@/services/TimerService';
import { baseTokens } from '@/styles';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import SessionCard from './SessionCard';

const SessionList = () => {
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    const insertMockSessions = async () => {
      try {
        await sessionService.clear();
        await timerService.clear();

        const sessions = await createAllMockSessions();
        setSessions([...sessions]);
      } catch (error) {
        console.error(error);
      }
    };

    if (INSERT_MOCK_DATA) {
      insertMockSessions();
    }
  }, []);

  return (
    <FlatList
      data={sessions}
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
