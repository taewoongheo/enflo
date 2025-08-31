import { baseTokens } from '@/styles';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export function ContentLayout({
  children,
  isTopMargin,
}: {
  children: React.ReactNode;
  isTopMargin?: number;
}) {
  return (
    <View
      style={[styles.container, { marginTop: isTopMargin ? isTopMargin : 0 }]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: baseTokens.spacing[5],
  },
});
