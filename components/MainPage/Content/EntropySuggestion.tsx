import Typography from '@/components/common/Typography';
import { useTheme } from '@/contexts/ThemeContext';
import React from 'react';
import { useTranslation } from 'react-i18next';

const EntropySuggestion = () => {
  const { theme } = useTheme();
  const { t } = useTranslation('main');

  return (
    <Typography
      variant="body1Regular"
      style={{ color: theme.colors.text.secondary }}
    >
      {t('entropySuggestion')}
    </Typography>
  );
};

export default EntropySuggestion;
