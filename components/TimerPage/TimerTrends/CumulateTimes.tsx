import Typography from '@/components/common/Typography';
import { Theme } from '@/styles/themes';
import { formatMsToTime } from '@/utils/time';
import { TFunction } from 'i18next';
import InfoLayout from './InfoLayout';

// TODO: 누적시간 계산 로직 문제 수정 => 초기에만 반영되고, 이후 동일한 타이머로 진행 시, 누적이 안됨

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
