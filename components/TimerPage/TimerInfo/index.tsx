import Typography from '@/components/common/Typography';
import i18n from '@/i18n';
import Session from '@/models/Session';
import { baseTokens } from '@/styles/baseTokens';
import { Theme } from '@/styles/themes';
import { getToday } from '@/utils/time';
import { TFunction } from 'i18next';
import React from 'react';
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
          30:23:10
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
          {toUserMessage(generateSuggestion(session), getToday(i18n.language))}
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
