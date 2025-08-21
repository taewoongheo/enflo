import { baseTokens } from '@/styles/baseTokens';
import React from 'react';
import { View } from 'react-native';

export default function InfoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <View
      style={{
        marginBottom: baseTokens.spacing[4],
      }}
    >
      {children}
    </View>
  );
}
