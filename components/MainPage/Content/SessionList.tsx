import { mockSessionData } from '@/data/sessionMockData';
import { sessions as sessionsTable } from '@/db/schema';
import { INSERT_MOCK_DATA } from '@/environment.config';
import Session from '@/models/Session';
import SessionService from '@/services/SessionService';
import { baseTokens } from '@/styles';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import SessionCard from './SessionCard';

const SessionList = () => {
  const [sessions, setSessions] = useState<Session[]>([]);

  const db = useSQLiteContext();
  const drizzleDb = drizzle(db);

  useEffect(() => {
    const sessionService = new SessionService(drizzleDb);

    const insertMockSessions = async () => {
      await drizzleDb.delete(sessionsTable);

      mockSessionData.forEach((sessionName) =>
        sessionService.createSession(sessionName),
      );
      const sessions = await sessionService.getSessions();
      setSessions(sessions);
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
