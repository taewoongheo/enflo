import { baseTokens } from '@/styles';
import { Entypo } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { Pressable } from 'react-native-gesture-handler';
import { scale } from 'react-native-size-matters';
import { ContentLayout } from '../ContentLayout';

function ContentLayoutWithBack({
  children,
  color,
}: {
  children: React.ReactNode;
  color: string;
}) {
  const router = useRouter();

  return (
    <ContentLayout>
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
      {children}
    </ContentLayout>
  );
}

export default ContentLayoutWithBack;
