import { baseTokens, Theme } from '@/styles';
import { View } from 'react-native';
import { scale } from 'react-native-size-matters';
import Typography from '../common/Typography';

export default function FocusTimeBySessionSection({ theme }: { theme: Theme }) {
  return (
    <View
      style={{
        width: '100%',
        height: scale(150),
        backgroundColor: theme.colors.pages.main.sessionCard.background,
        borderColor: theme.colors.pages.main.sessionCard.border,
        borderWidth: scale(1),
        borderRadius: baseTokens.borderRadius.sm,
        padding: baseTokens.spacing[3],
      }}
    >
      <Typography
        variant="body1Bold"
        style={{ color: theme.colors.text.primary }}
      >
        세션별 몰입 시간
      </Typography>
    </View>
  );
}
