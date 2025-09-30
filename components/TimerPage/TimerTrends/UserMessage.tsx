import Typography from '@/components/common/Typography';
import { useBottomSheet } from '@/contexts/BottomSheetContext';
import { baseTokens } from '@/styles/baseTokens';
import { Theme } from '@/styles/themes';
import { AntDesign } from '@expo/vector-icons';
import { TFunction } from 'i18next';
import { Pressable, View } from 'react-native';
import InfoLayout from './InfoLayout';

export default function UserMessage({
  theme,
  t,
  userMessage,
}: {
  theme: Theme;
  t: TFunction;
  userMessage: string;
}) {
  const { flowPatternBottomSheetRef, proInfoBottomSheetRef } = useBottomSheet();

  return (
    <InfoLayout>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: baseTokens.spacing[1],
        }}
      >
        <Pressable
          style={{ flex: 1 }}
          onPress={() => flowPatternBottomSheetRef.current?.expand()}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: baseTokens.spacing[1],
              alignSelf: 'flex-start',
            }}
          >
            <Typography
              variant="body1Bold"
              style={{ color: theme.colors.pages.timer.slider.text.secondary }}
            >
              {t('focusSuggestion')}
            </Typography>
            <AntDesign
              name="questioncircle"
              size={baseTokens.iconSize.xs}
              color={theme.colors.text.secondary}
            />
          </View>
        </Pressable>
        <Pressable
          onPress={() => {
            proInfoBottomSheetRef.current?.expand();
          }}
          style={{
            backgroundColor: theme.colors.pages.stats.toggle.selectedBackground,
            paddingHorizontal: baseTokens.spacing[2],
            paddingVertical: baseTokens.spacing[0],
            borderRadius: baseTokens.borderRadius.sm,
          }}
        >
          <Typography
            variant="label"
            style={{ color: theme.colors.background }}
          >
            Pro
          </Typography>
        </Pressable>
      </View>
      <Pressable
        style={{ flex: 1 }}
        onPress={() => flowPatternBottomSheetRef.current?.expand()}
      >
        <Typography
          variant="body1Regular"
          style={{ color: theme.colors.pages.timer.slider.text.primary }}
        >
          {userMessage}
        </Typography>
      </Pressable>
    </InfoLayout>
  );
}
