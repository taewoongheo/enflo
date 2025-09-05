import Typography from '@/components/common/Typography';
import { baseTokens, Theme } from '@/styles';
import { normalizeScoreToEntropy } from '@/utils/score';
import { View } from 'react-native';

export default function YValues({
  theme,
  textHeight,
  yValues,
}: {
  theme: Theme;
  textHeight: number;
  yValues: number[];
}) {
  return (
    <View
      style={{
        justifyContent: 'space-between',
        marginBottom: textHeight,
      }}
    >
      {yValues.map((value) => {
        return (
          <View key={value}>
            <Typography
              variant="label"
              style={{
                color: theme.colors.text.primary,
                marginRight: baseTokens.spacing[1],
              }}
            >
              {normalizeScoreToEntropy(value)}
            </Typography>
          </View>
        );
      })}
    </View>
  );
}
