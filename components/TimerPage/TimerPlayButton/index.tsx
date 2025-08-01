import { baseTokens, Theme } from '@/styles';
import { Fontisto } from '@expo/vector-icons';
import { View } from 'react-native';
import { Pressable } from 'react-native-gesture-handler';

function TimerPlayButton({
  theme,
  isRunning,
  setIsRunning,
}: {
  theme: Theme;
  isRunning: boolean;
  setIsRunning: (isRunning: boolean) => void;
}) {
  return (
    <View
      style={{
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.pages.timer.slider.button.background,
        borderRadius: baseTokens.borderRadius.sm,
        padding: baseTokens.spacing[2],
        paddingVertical: baseTokens.spacing[3],
      }}
    >
      <Pressable onPress={() => setIsRunning(!isRunning)}>
        <Fontisto
          name={isRunning ? 'pause' : 'play'}
          size={baseTokens.iconSize.lg}
          color={theme.colors.pages.timer.slider.button.icon}
        />
      </Pressable>
    </View>
  );
}

export default TimerPlayButton;
