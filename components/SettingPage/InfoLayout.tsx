import { baseTokens } from '@/styles';
import React from 'react';
import { View } from 'react-native';

interface InfoLayoutProps {
  children: React.ReactNode;
}

export default function InfoLayout({ children }: InfoLayoutProps) {
  return (
    <View
      style={{
        marginBottom: baseTokens.spacing[3],
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: baseTokens.spacing[1],
      }}
    >
      {children}
    </View>
  );
}
