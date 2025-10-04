import { useTheme } from '@/contexts/ThemeContext';
import { baseTokens } from '@/styles';
import { Entypo } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, Pressable, View } from 'react-native';
import { scale } from 'react-native-size-matters';

function LegalPageHeader() {
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <>
      <View
        style={{
          paddingHorizontal: baseTokens.spacing[3],
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.pages.main.sessionCard.border,
        }}
      >
        <Pressable
          onPress={() => router.back()}
          style={{
            marginTop: Platform.OS === 'ios' ? 0 : baseTokens.spacing[5],
            marginBottom: baseTokens.spacing[4],
            alignSelf: 'flex-start',
          }}
        >
          <Entypo
            name="chevron-thin-left"
            size={baseTokens.iconSize.lg - scale(2)}
            color={theme.colors.text.primary}
          />
        </Pressable>
      </View>
    </>
  );
}

export default LegalPageHeader;
