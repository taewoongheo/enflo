import Typography from '@/components/common/Typography';
import { Theme } from '@/styles/themes';
import { TFunction } from 'i18next';
import { InfoLayout } from '.';

export default function UserMessage({
  theme,
  t,
  userMessage,
}: {
  theme: Theme;
  t: TFunction;
  userMessage: string;
}) {
  return (
    <InfoLayout>
      <Typography
        variant="body1Bold"
        style={{ color: theme.colors.pages.timer.slider.text.secondary }}
      >
        {t('focusSuggestion')}
      </Typography>
      <Typography
        variant="body1Regular"
        style={{ color: theme.colors.pages.timer.slider.text.primary }}
      >
        {userMessage}
      </Typography>
    </InfoLayout>
  );
}
