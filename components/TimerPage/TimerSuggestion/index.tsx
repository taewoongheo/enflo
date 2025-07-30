import Typography from '@/components/common/Typography';
import { Theme } from '@/styles';
import { TFunction } from 'i18next';
import { Text, View } from 'react-native';
import { scale } from 'react-native-size-matters';

function TimerSuggestion({
  theme,
  time,
  t,
}: {
  theme: Theme;
  time: number;
  t: TFunction;
}) {
  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'baseline',
        }}
      >
        <Text
          style={{
            fontSize: scale(70),
            color: theme.colors.text.primary,
            fontFamily: 'Pretendard-Semibold',
          }}
        >
          {time}
        </Text>
        <Typography
          variant="body1Regular"
          style={{
            color: theme.colors.text.secondary,
          }}
        >
          {t('minutes')}
        </Typography>
      </View>
      <Typography
        variant="body1Regular"
        style={{
          color: theme.colors.text.secondary,
          textAlign: 'center',
        }}
      >
        {t('suggestions')}
      </Typography>
    </>
  );
}

export default TimerSuggestion;
