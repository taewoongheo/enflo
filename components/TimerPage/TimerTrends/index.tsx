import Typography from '@/components/common/Typography';
import i18n from '@/i18n';
import Session from '@/models/Session';
import { baseTokens } from '@/styles/baseTokens';
import { Theme } from '@/styles/themes';
import { formatMsToTime, getToday } from '@/utils/time';
import { TFunction } from 'i18next';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { generateSuggestion } from '../utils/generateSuggestion';
import { toUserMessage } from '../utils/toUserMessage';

function TimerTrends({
  session,
  t,
  theme,
}: {
  session: Session;
  t: TFunction;
  theme: Theme;
}) {
  const { t: tTimer } = useTranslation('suggestion');

  const [userMessage, setUserMessage] = useState<string | null>(null);

  useEffect(() => {
    setUserMessage(
      toUserMessage(
        generateSuggestion(session),
        getToday(i18n.language),
        tTimer,
      ),
    );
  }, [session.totalNetFocusMs]);

  return (
    <>
      <InfoLayout>
        <Typography
          variant="title2Bold"
          style={{ color: theme.colors.pages.timer.slider.text.primary }}
        >
          {t('trends')}
        </Typography>
      </InfoLayout>
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
      <InfoLayout>
        <Typography
          variant="body1Bold"
          style={{ color: theme.colors.pages.timer.slider.text.secondary }}
        >
          {t('focusGraph')}
        </Typography>
        <View style={{ flex: 1, backgroundColor: 'red', height: 100 }}></View>
      </InfoLayout>
    </>
  );
}

const InfoLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <View
      style={{
        marginBottom: baseTokens.spacing[3],
      }}
    >
      {children}
    </View>
  );
};

export default TimerTrends;
