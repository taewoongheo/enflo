import Typography from '@/components/common/Typography';
import { Theme } from '@/styles';
import { yyyymmddToMdSlash } from '@/utils/time';
import { View } from 'react-native';
import { PERIOD } from '../../constants/period';

const WEEKLY_DAYS_LABEL_DIVIDE = 5;
const WEEKLY_DAYS = 7;

export default function XValues({
  theme,
  period,
  datas,
  selectedPeriod,
  canvasWidth,
  setTextHeight,
}: {
  theme: Theme;
  period: {
    first: string;
    last: string;
    days: string[];
  };
  datas: { day: number; entropyScore: number }[];
  selectedPeriod: 'weekly' | 'monthly';
  canvasWidth: number;
  setTextHeight: (height: number) => void;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      {datas.map((day) => {
        if (
          selectedPeriod === PERIOD.MONTHLY &&
          day.day % WEEKLY_DAYS_LABEL_DIVIDE !== 0
        ) {
          return null;
        }

        return (
          <View
            key={day.day}
            style={{
              width:
                canvasWidth /
                (selectedPeriod === PERIOD.WEEKLY
                  ? WEEKLY_DAYS
                  : period.days.length / WEEKLY_DAYS_LABEL_DIVIDE),
              alignItems: 'center',
            }}
            onLayout={(e) => setTextHeight(e.nativeEvent.layout.height)}
          >
            <Typography
              variant="label"
              style={{
                color: theme.colors.text.primary,
              }}
            >
              {yyyymmddToMdSlash(String(day.day))}
            </Typography>
          </View>
        );
      })}
    </View>
  );
}
