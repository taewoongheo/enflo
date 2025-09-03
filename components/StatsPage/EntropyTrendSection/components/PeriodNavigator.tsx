import { baseTokens, Theme } from '@/styles';
import { Entypo } from '@expo/vector-icons';
import { View } from 'react-native';
import { Pressable } from 'react-native-gesture-handler';
import { scale } from 'react-native-size-matters';
import Typography from '../../../common/Typography';

interface PeriodNavigatorProps {
  theme: Theme;
  periodStr: string;
  isNextAvailable: boolean;
  onPrev: () => void;
  onNext: () => void;
}

export default function PeriodNavigator({
  theme,
  periodStr,
  isNextAvailable,
  onPrev,
  onNext,
}: PeriodNavigatorProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: baseTokens.spacing[2],
        marginTop: baseTokens.spacing[2],
      }}
    >
      <Pressable onPress={onPrev}>
        <Entypo
          name="chevron-thin-left"
          size={scale(15)}
          color={theme.colors.text.primary}
        />
      </Pressable>

      <Typography
        variant="body1Bold"
        style={{ color: theme.colors.text.primary }}
      >
        {periodStr}
      </Typography>

      {isNextAvailable && (
        <Pressable onPress={onNext}>
          <Entypo
            name="chevron-thin-right"
            size={scale(15)}
            color={theme.colors.text.primary}
          />
        </Pressable>
      )}
    </View>
  );
}
