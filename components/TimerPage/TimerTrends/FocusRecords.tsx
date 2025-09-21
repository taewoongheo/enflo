import Typography from '@/components/common/Typography';
import { Theme } from '@/styles/themes';
import { formatMsToMMSS } from '@/utils/time';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';

export type FocusRecordItem = {
  durationStr: string;
  dayOfWeek: string;
  dateStr: string;
  timestamp: number;
  durationMs: number;
};

type FocusRecordsProps = {
  items: FocusRecordItem[];
  remainingCount: number;
  onLoadMore: () => void;
  theme: Theme;
};

function FocusRecords({
  items,
  remainingCount,
  onLoadMore,
  theme,
}: FocusRecordsProps) {
  const { t } = useTranslation('timer');

  return (
    <View>
      {items.map((item, index) => (
        <View key={`${item.timestamp}-${index}`} style={{ marginVertical: 10 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography
              variant="body1Regular"
              style={{ color: theme.colors.pages.timer.slider.text.primary }}
            >
              {item.durationStr}
            </Typography>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Typography
                variant="body2Regular"
                style={{
                  color: theme.colors.pages.timer.slider.text.secondary,
                }}
              >
                {item.dateStr}
              </Typography>
              <Typography
                variant="body2Regular"
                style={{
                  color: theme.colors.pages.timer.slider.text.secondary,
                }}
              >
                {item.dayOfWeek}
              </Typography>
              <Typography
                variant="body2Regular"
                style={{
                  color: theme.colors.pages.timer.slider.text.secondary,
                }}
              >
                {formatMsToMMSS(item.durationMs)} {t('minutes')}
              </Typography>
            </View>
          </View>
          <View
            style={{
              height: 1,
              backgroundColor: theme.colors.pages.timer.slider.text.primary,
              opacity: 0.2,
            }}
          />
        </View>
      ))}
      {remainingCount > 0 && (
        <TouchableOpacity
          onPress={onLoadMore}
          style={{
            marginTop: 16,
            paddingVertical: 12,
            paddingHorizontal: 24,
            borderRadius: 8,
            alignItems: 'center',
          }}
        >
          <Typography
            variant="body1Bold"
            style={{
              color: theme.colors.text.primary,
            }}
          >
            {t('loadMoreButton', { count: remainingCount })}
          </Typography>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default FocusRecords;
