import Typography from '@/components/common/Typography';
import { baseTokens, Theme } from '@/styles';
import { View } from 'react-native';

export default function YValues({
  theme,
  textHeight,
  yValues,
}: {
  theme: Theme;
  textHeight: number;
  yValues: string[];
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
          <View key={`y-value-${value}`}>
            <Typography
              variant="label"
              style={{
                color: theme.colors.text.primary,
                marginRight: baseTokens.spacing[1],
              }}
            >
              {value}
            </Typography>
          </View>
        );
      })}
    </View>
  );
}
