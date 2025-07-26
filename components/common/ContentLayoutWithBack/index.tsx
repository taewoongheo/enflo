import { useTheme } from '@/contexts/ThemeContext';
import { baseTokens } from '@/styles';
import { Entypo } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable } from 'react-native-gesture-handler';
import { scale } from 'react-native-size-matters';
import { ContentLayout } from '../ContentLayout';

function ContentLayoutWithBack({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { theme } = useTheme();

  return (
    <ContentLayout>
      <Pressable
        onPress={() => router.back()}
        style={{
          marginBottom: baseTokens.spacing[5],
          alignSelf: 'flex-start',
        }}
      >
        <Entypo
          name="chevron-thin-left"
          size={baseTokens.iconSize.lg - scale(2)}
          color={theme.colors.text.primary}
        />
      </Pressable>
      {children}
    </ContentLayout>
  );
}

export default ContentLayoutWithBack;
