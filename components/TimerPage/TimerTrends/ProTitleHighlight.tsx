import Typography from '@/components/common/Typography';
import { baseTokens, Theme } from '@/styles';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

interface ProTitleHighlightProps {
  theme: Theme;
}

function ProTitleHighlight({ theme }: ProTitleHighlightProps) {
  const { t, i18n } = useTranslation('proinfo');

  if (i18n.language === 'ko') {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'baseline',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="title2Bold"
          style={{
            color: theme.colors.text.primary,
          }}
        >
          {t('title')}
        </Typography>

        <View
          style={{
            backgroundColor: theme.colors.pages.main.sessionCard.background,
            paddingHorizontal: baseTokens.spacing[2],
            paddingVertical: 1,
            borderRadius: baseTokens.borderRadius.sm,
            marginHorizontal: baseTokens.spacing[1],
          }}
        >
          <Typography
            variant="title2Bold"
            style={{
              color: theme.colors.text.primary,
            }}
          >
            {t('proLabel')}
          </Typography>
        </View>

        <Typography
          variant="title2Bold"
          style={{
            color: theme.colors.text.primary,
          }}
        >
          {t('subtitle')}
        </Typography>
      </View>
    );
  }

  // English layout
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'baseline',
        justifyContent: 'center',
      }}
    >
      <Typography
        variant="title2Bold"
        style={{
          color: theme.colors.text.primary,
        }}
      >
        {t('title')}
      </Typography>

      <View
        style={{
          backgroundColor: theme.colors.pages.main.sessionCard.background,
          paddingHorizontal: baseTokens.spacing[2],
          paddingVertical: 1,
          borderRadius: baseTokens.borderRadius.sm,
          marginHorizontal: baseTokens.spacing[1],
        }}
      >
        <Typography
          variant="title2Bold"
          style={{
            color: theme.colors.text.primary,
          }}
        >
          {t('proLabel')}
        </Typography>
      </View>

      <Typography
        variant="title2Bold"
        style={{
          color: theme.colors.text.primary,
        }}
      >
        {t('subtitle')}
      </Typography>
    </View>
  );
}

export default ProTitleHighlight;
