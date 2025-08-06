import { baseTokens, Theme } from '@/styles';
import { Fontisto } from '@expo/vector-icons';
import { Pressable } from 'react-native-gesture-handler';

function TimerPlayButton({
  theme,
  isRunning,
  handleStartPauseToggle,
}: {
  theme: Theme;
  isRunning: boolean;
  handleStartPauseToggle: () => void;
}) {
  return (
    <Pressable
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
      onPress={handleStartPauseToggle}
    >
      <Fontisto
        name={isRunning ? 'pause' : 'play'}
        size={baseTokens.iconSize.lg}
        color={theme.colors.pages.timer.slider.button.icon}
      />
    </Pressable>
  );
}

export default TimerPlayButton;
