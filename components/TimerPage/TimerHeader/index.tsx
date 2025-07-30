import Typography from '@/components/common/Typography';
import Session from '@/models/Session';
import { Theme } from '@/styles/themes';
import { TFunction } from 'i18next';

function TimerHeader({
  theme,
  session,
  t,
}: {
  theme: Theme;
  session: Session;
  t: TFunction;
}) {
  return (
    <>
      <Typography
        variant="title2Bold"
        style={{ color: theme.colors.text.primary }}
      >
        {session?.sessionName}
      </Typography>
      <Typography
        variant="title2Bold"
        style={{ color: theme.colors.text.secondary }}
      >
        {t('timer')}
      </Typography>
    </>
  );
}

export default TimerHeader;
