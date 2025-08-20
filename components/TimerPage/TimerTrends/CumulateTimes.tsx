import Typography from '@/components/common/Typography';
import Session from '@/models/Session';
import { Theme } from '@/styles/themes';
import { formatMsToTime } from '@/utils/time';
import { TFunction } from 'i18next';
import { InfoLayout } from '.';

export default function CumulateTimes({
  session,
  theme,
  t,
}: {
  session: Session;
  theme: Theme;
  t: TFunction;
}) {
  return (
    <InfoLayout>
      <Typography
        variant="body1Bold"
        style={{ color: theme.colors.pages.timer.slider.text.secondary }}
      >
        {t('totalFocusTime')}
      </Typography>
      <Typography
        variant="body1Regular"
        style={{ color: theme.colors.pages.timer.slider.text.primary }}
      >
        {formatMsToTime(session.totalNetFocusMs)}
      </Typography>
    </InfoLayout>
  );
}
