import { useSessionCache } from '@/store/sessionCache';
import { baseTokens } from '@/styles';
import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import SessionCard from './SessionCard';

export const ADD_SESSION_ID = 'add-session';

const SessionList = () => {
  const sessionsRef = useSessionCache((s) => s.sessionCache);
  const sessions = useMemo(
    () => [...Object.values(sessionsRef), { sessionId: ADD_SESSION_ID }],
    [sessionsRef],
  );

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
