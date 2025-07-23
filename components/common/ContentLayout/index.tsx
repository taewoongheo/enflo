import { baseTokens } from '@/styles';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export function ContentLayout({ children }: { children: React.ReactNode }) {
  return <View style={styles.container}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: baseTokens.spacing[5],
  },
});
