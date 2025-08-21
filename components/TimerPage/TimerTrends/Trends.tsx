import Typography from '@/components/common/Typography';
import { Theme } from '@/styles/themes';
import { TFunction } from 'i18next';
import InfoLayout from './InfoLayout';

export default function Trends({ theme, t }: { theme: Theme; t: TFunction }) {
  return (
    <InfoLayout>
      <Typography
        variant="title2Bold"
        style={{ color: theme.colors.pages.timer.slider.text.primary }}
      >
        {t('trends')}
      </Typography>
    </InfoLayout>
  );
}
