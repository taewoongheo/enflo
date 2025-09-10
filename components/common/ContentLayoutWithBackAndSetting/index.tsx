import { useBottomSheet } from '@/contexts/BottomSheetContext';
import { baseTokens } from '@/styles';
import { Entypo } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, View } from 'react-native';
import { Pressable } from 'react-native-gesture-handler';
import { scale } from 'react-native-size-matters';
import { ContentLayout } from '../ContentLayout';

function ContentLayoutWithBackAndSetting({
  children,
  color,
}: {
  children: React.ReactNode;
  color: string;
}) {
  const router = useRouter();
  const { editSessionBottomSheetRef } = useBottomSheet();

  const handleSettingPress = () => {
    editSessionBottomSheetRef.current?.expand();
  };

  return (
    <ContentLayout>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: baseTokens.spacing[3],
        }}
      >
        <Pressable
          onPress={() => router.back()}
          style={{
            marginTop: Platform.OS === 'ios' ? 0 : baseTokens.spacing[5],
            marginBottom: baseTokens.spacing[5],
            alignSelf: 'flex-start',
          }}
        >
          <Entypo
            name="chevron-thin-left"
            size={baseTokens.iconSize.lg - scale(2)}
            color={color}
          />
        </Pressable>
        <Pressable
          onPress={handleSettingPress}
          style={{
            marginTop: Platform.OS === 'ios' ? 0 : baseTokens.spacing[5],
            marginBottom: baseTokens.spacing[5],
            alignSelf: 'flex-start',
          }}
        >
          <Entypo
            name="dots-three-horizontal"
            size={baseTokens.iconSize.md}
            color={color}
          />
        </Pressable>
      </View>
      {children}
    </ContentLayout>
  );
}

export default ContentLayoutWithBackAndSetting;
