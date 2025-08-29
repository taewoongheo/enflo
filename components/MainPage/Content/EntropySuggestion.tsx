import Typography from '@/components/common/Typography';
import { useTheme } from '@/contexts/ThemeContext';
import { useEntropyStore } from '@/store/entropyStore';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { generateMainSuggestion } from '../utils/generateMainSuggestion';

const getEntropyRange = (entropyScore: number) => {
  if (entropyScore >= 80) return 'VERY_HIGH';
  if (entropyScore >= 60) return 'HIGH';
  if (entropyScore >= 40) return 'MEDIUM';
  if (entropyScore >= 20) return 'LOW';
  return 'VERY_LOW';
};

const EntropySuggestion = () => {
  const { theme } = useTheme();
  const { t } = useTranslation('main');
  const { entropyScore } = useEntropyStore();

  const [message, setMessage] = useState<string | null>(null);
  const [range, setRange] = useState<string | null>(null);

  useEffect(() => {
    const newRange = getEntropyRange(entropyScore);
    if (newRange !== range) {
      setRange(newRange);
      setMessage(generateMainSuggestion(entropyScore, t));
    }
  }, [entropyScore]);

  return (
    <Typography
      variant="body1Regular"
      style={{ color: theme.colors.text.secondary }}
    >
      {message}
    </Typography>
  );
};

export default EntropySuggestion;
