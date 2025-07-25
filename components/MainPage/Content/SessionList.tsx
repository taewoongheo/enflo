import { sessionMockData } from '@/data/sessionMockData';
import Session from '@/models/Session';
import { baseTokens } from '@/styles';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import SessionCard from './SessionCard';

const SessionList = () => {
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    setSessions(sessionMockData);
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
