import Typography from '@/components/common/Typography';
import { Theme } from '@/styles/themes';
import { formatMsToTime } from '@/utils/time';
import { TFunction } from 'i18next';
import InfoLayout from './InfoLayout';

export default function CumulateTimes({
  totalNetFocusMs,
  theme,
  t,
}: {
  totalNetFocusMs: number;
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
        {formatMsToTime(totalNetFocusMs)}
      </Typography>
    </InfoLayout>
  );
}
