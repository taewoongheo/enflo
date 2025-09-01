import Typography from '@/components/common/Typography';
import { useTheme } from '@/contexts/ThemeContext';
import { useEntropyStore } from '@/store/entropyStore';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ENTROPY_SYSTEM_GLOBAL_CONSTANTS } from '../constants/entropySystem/entropySystem';
import { generateMainSuggestion } from '../utils/generateMainSuggestion';

const getEntropyRange = (entropyScore: number) => {
  if (entropyScore >= ENTROPY_SYSTEM_GLOBAL_CONSTANTS.ENTROPY_SCORE.HIGH_MAX)
    return 'VERY_HIGH';
  if (entropyScore >= ENTROPY_SYSTEM_GLOBAL_CONSTANTS.ENTROPY_SCORE.MEDIUM_MAX)
    return 'HIGH';
  if (entropyScore >= ENTROPY_SYSTEM_GLOBAL_CONSTANTS.ENTROPY_SCORE.LOW_MAX)
    return 'MEDIUM';
  if (
    entropyScore >= ENTROPY_SYSTEM_GLOBAL_CONSTANTS.ENTROPY_SCORE.VERY_LOW_MAX
  )
    return 'LOW';
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
