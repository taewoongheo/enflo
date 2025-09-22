import { useBottomSheet } from '@/contexts/BottomSheetContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useSessionCache } from '@/store/sessionCache';
import { baseTokens } from '@/styles';
import { hapticAddSession } from '@/utils/haptics';
import { AntDesign } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { FlatList, Pressable } from 'react-native-gesture-handler';
import SessionCard from './SessionCard';

export const ADD_SESSION_ID = 'add-session';

const SessionList = () => {
  const { theme } = useTheme();
  const sessionsRef = useSessionCache((s) => s.sessionCache);
  const sessions = useMemo(
    () => [...Object.values(sessionsRef), { sessionId: ADD_SESSION_ID }],
    [sessionsRef],
  );

  const { addSessionBottomSheetRef } = useBottomSheet();

  const handleAddSessionClick = () => {
    hapticAddSession();

    addSessionBottomSheetRef.current?.expand();
  };

  if (sessions.length === 1) {
    return (
      <Pressable
        onPress={handleAddSessionClick}
        style={[
          {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: baseTokens.borderRadius.sm,
            borderWidth: 1,
            borderColor: theme.colors.pages.main.sessionCard.addButtonBorder,
            marginTop: baseTokens.spacing[4],
            marginBottom: baseTokens.spacing[7],
            backgroundColor:
              theme.colors.pages.main.sessionCard.addButtonBackground,
          },
        ]}
      >
        <AntDesign
          name="plus"
          size={baseTokens.iconSize.lg}
          color={theme.colors.background}
        />
      </Pressable>
    );
  }

  return (
    <FlatList
      data={sessions}
      keyExtractor={(item) => item.sessionId}
      horizontal={true}
      scrollEnabled={sessions.length > 1}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.flatListContent}
      renderItem={({ item }) => (
        <SessionCard
          theme={theme}
          item={item}
          handleAddSessionClick={handleAddSessionClick}
        />
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
});
