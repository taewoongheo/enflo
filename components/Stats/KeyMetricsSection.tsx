import { baseTokens, Theme } from '@/styles';
import Typography from '../common/Typography';

import Session from '@/models/Session';
import { useSessionCache } from '@/store/sessionCache';
import { formatMsToTime } from '@/utils/time';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { scale } from 'react-native-size-matters';

const cardPadding = baseTokens.spacing[3];

export default function KeyMetricsSection({ theme }: { theme: Theme }) {
  const [totalSessionsNetFocusMs, setTotalSessionsNetFocusMs] = useState(0);

  const sessions = useSessionCache((s) => s.sessionCache);

  useEffect(() => {
    const totalTime = Object.values(sessions).reduce(
      (acc: number, session: Session) => acc + session.totalNetFocusMs,
      0,
    );

    setTotalSessionsNetFocusMs(totalTime);
  }, [sessions]);

  //   useEffect(() => {
  //     const fetchStreakStartedAt = async () => {
  //       try {
  //         const streakStartedAt = await entropyService.getStreakStartedAt();
  //         if (!streakStartedAt) {
  //           throw new Error('Streak started at not found');
  //         }

  //         const today = Date.now();
  //         const diff = today - streakStartedAt;
  //         const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));

  //         console.log('diffDays: ', diffDays);
  //       } catch (error) {
  //         console.error(error);
  //       }
  //     };

  //     fetchStreakStartedAt();
  //   }, [entropyScore]);

  return (
    <>
      <Typography
        variant="title3Bold"
        style={{ color: theme.colors.text.secondary }}
      >
        총 몰입 시간
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
            style={{ color: theme.colors.text.primary }}
          >
            {formatMsToTime(totalSessionsNetFocusMs)}
          </Typography>
        </View>
      </View>
    </>
  );
}
