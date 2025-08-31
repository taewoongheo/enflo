import { baseTokens, Theme } from '@/styles';
import Typography from '../common/Typography';

import { View } from 'react-native';
import { scale } from 'react-native-size-matters';

const cardGap = baseTokens.spacing[0];
const cardPadding = baseTokens.spacing[3];

export default function KeyMetricsSection({ theme }: { theme: Theme }) {
  return (
    <>
      <Typography
        variant="title3Bold"
        style={{ color: theme.colors.text.secondary }}
      >
        요약
      </Typography>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          gap: baseTokens.spacing[2],
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: theme.colors.pages.main.sessionCard.background,
            borderColor: theme.colors.pages.main.sessionCard.border,
            borderWidth: scale(1),
            borderRadius: baseTokens.borderRadius.sm,
            padding: cardPadding,
          }}
        >
          <Typography
            variant="body1Bold"
            style={{
              color: theme.colors.text.secondary,
            }}
          >
            총 몰입 시간
          </Typography>
          <Typography
            variant="body1Bold"
            style={{ color: theme.colors.text.primary }}
          >
            43:12:34
          </Typography>
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: theme.colors.pages.main.sessionCard.background,
            borderColor: theme.colors.pages.main.sessionCard.border,
            borderWidth: scale(1),
            borderRadius: baseTokens.borderRadius.sm,
            padding: cardPadding,
            gap: cardGap,
          }}
        >
          <Typography
            variant="body1Bold"
            style={{ color: theme.colors.text.secondary }}
          >
            연속일
          </Typography>
          <Typography
            variant="body1Bold"
            style={{ color: theme.colors.text.primary }}
          >
            98일
          </Typography>
        </View>
      </View>
    </>
  );
}
