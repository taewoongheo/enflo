import { baseTokens, Theme } from '@/styles';
import { useState } from 'react';
import { View } from 'react-native';
import { Pressable } from 'react-native-gesture-handler';
import { scale } from 'react-native-size-matters';
import Typography from '../common/Typography';

export default function EntropyTrendSection({ theme }: { theme: Theme }) {
  const [selectedPeriod, setSelectedPeriod] = useState<'weekly' | 'monthly'>(
    'weekly',
  );

  return (
    <>
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.pages.main.sessionCard.background,
          borderColor: theme.colors.pages.main.sessionCard.border,
          borderWidth: scale(1),
          borderRadius: baseTokens.borderRadius.sm,
          padding: baseTokens.spacing[3],
        }}
      >
        <View
          style={{
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
          }}
        >
          <Typography
            variant="body1Bold"
            style={{ color: theme.colors.text.primary }}
          >
            엔트로피 변화
          </Typography>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: scale(1),
              borderColor: theme.colors.border,
              borderRadius: baseTokens.borderRadius.sm,
            }}
          >
            <Pressable
              onPress={() => setSelectedPeriod('weekly')}
              style={{
                backgroundColor:
                  selectedPeriod === 'weekly'
                    ? theme.colors.pages.stats.toggle.selectedBackground
                    : 'transparent',
                paddingHorizontal: baseTokens.spacing[2],
                paddingVertical: baseTokens.spacing[1],
                borderTopLeftRadius: baseTokens.borderRadius.sm,
                borderBottomLeftRadius: baseTokens.borderRadius.sm,
              }}
            >
              <Typography
                variant="label"
                style={{ color: theme.colors.text.primary }}
              >
                주간
              </Typography>
            </Pressable>
            <Pressable
              onPress={() => setSelectedPeriod('monthly')}
              style={{
                backgroundColor:
                  selectedPeriod === 'monthly'
                    ? theme.colors.pages.stats.toggle.selectedBackground
                    : 'transparent',
                paddingHorizontal: baseTokens.spacing[2],
                paddingVertical: baseTokens.spacing[1],
                borderTopRightRadius: baseTokens.borderRadius.sm,
                borderBottomRightRadius: baseTokens.borderRadius.sm,
              }}
            >
              <Typography
                variant="label"
                style={{ color: theme.colors.text.primary }}
              >
                월간
              </Typography>
            </Pressable>
          </View>
        </View>
        <View></View>
      </View>
    </>
  );
}
