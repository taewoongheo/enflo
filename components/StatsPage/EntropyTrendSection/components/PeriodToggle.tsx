import { baseTokens, Theme } from '@/styles';
import { View } from 'react-native';
import { Pressable } from 'react-native-gesture-handler';
import Typography from '../../../common/Typography';
import { PERIOD } from '../constants/period';

interface PeriodToggleProps {
  theme: Theme;
  selectedPeriod: (typeof PERIOD)[keyof typeof PERIOD];
  onToggle: (period: (typeof PERIOD)[keyof typeof PERIOD]) => void;
}

export default function PeriodToggle({
  theme,
  selectedPeriod,
  onToggle,
}: PeriodToggleProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: baseTokens.borderRadius.sm,
      }}
    >
      <Pressable
        onPress={() => onToggle(PERIOD.WEEKLY)}
        style={{
          backgroundColor:
            selectedPeriod === PERIOD.WEEKLY
              ? theme.colors.pages.stats.toggle.selectedBackground
              : 'transparent',
          paddingHorizontal: baseTokens.spacing[2],
          paddingVertical: baseTokens.spacing[1],
          borderTopLeftRadius: baseTokens.borderRadius.sm,
          borderBottomLeftRadius: baseTokens.borderRadius.sm,
        }}
      >
        <Typography
          variant="label"
          style={{ color: theme.colors.text.primary }}
        >
          주간
        </Typography>
      </Pressable>

      <Pressable
        onPress={() => onToggle(PERIOD.MONTHLY)}
        style={{
          backgroundColor:
            selectedPeriod === PERIOD.MONTHLY
              ? theme.colors.pages.stats.toggle.selectedBackground
              : 'transparent',
          paddingHorizontal: baseTokens.spacing[2],
          paddingVertical: baseTokens.spacing[1],
          borderTopRightRadius: baseTokens.borderRadius.sm,
          borderBottomRightRadius: baseTokens.borderRadius.sm,
        }}
      >
        <Typography
          variant="label"
          style={{ color: theme.colors.text.primary }}
        >
          월간
        </Typography>
      </Pressable>
    </View>
  );
}
