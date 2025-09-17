import { baseTokens, Theme } from '@/styles';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Pressable } from 'react-native-gesture-handler';
import Typography from '../../../common/Typography';
import { PERIOD } from '../../constants/period';

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
  const { t } = useTranslation('stats');
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.pages.stats.toggle.border,
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
          style={{
            color:
              selectedPeriod === PERIOD.WEEKLY
                ? theme.colors.background
                : theme.colors.text.secondary,
          }}
        >
          {t('weeklyPeriod')}
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
          style={{
            color:
              selectedPeriod === PERIOD.MONTHLY
                ? theme.colors.background
                : theme.colors.text.secondary,
          }}
        >
          {t('monthlyPeriod')}
        </Typography>
      </Pressable>
    </View>
  );
}
