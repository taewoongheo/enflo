import { baseTokens, Theme } from '@/styles';
import { Fontisto } from '@expo/vector-icons';
import { useState } from 'react';
import { View } from 'react-native';
import { Pressable } from 'react-native-gesture-handler';

/* TODO: gradient style */
function TimerPlayButton({ theme }: { theme: Theme }) {
  const [isRunning, setIsRunning] = useState(false);

  return (
    <View
      style={{
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.text.secondary,
        borderRadius: baseTokens.borderRadius.sm,
        padding: baseTokens.spacing[2],
        paddingVertical: baseTokens.spacing[3],
      }}
    >
      <Pressable onPress={() => setIsRunning((prev) => !prev)}>
        <Fontisto
          name={isRunning ? 'pause' : 'play'}
          size={baseTokens.iconSize.lg}
          color={theme.colors.text.primary}
        />
      </Pressable>
    </View>
  );
}

export default TimerPlayButton;
