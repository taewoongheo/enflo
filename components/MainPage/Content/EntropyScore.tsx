import Typography from '@/components/common/Typography';
import { useTheme } from '@/contexts/ThemeContext';
import { baseTokens } from '@/styles';
import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Pressable } from 'react-native-gesture-handler';

const EntropyScore = () => {
  const { theme } = useTheme();
  return (
    <Pressable
      style={[styles.entropyScoreContainer]}
      onPress={() => {
        console.log('entropy score clicked');
      }}
    >
      <Typography
        variant="title1Bold"
        style={{ color: theme.colors.text.primary }}
      >
        0.23
      </Typography>
      <AntDesign
        name="questioncircle"
        size={baseTokens.iconSize.xs}
        color={theme.colors.text.secondary}
        style={styles.iconSpacing}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  entropyScoreContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
  },
  iconSpacing: {
    marginTop: baseTokens.spacing[2],
    marginLeft: baseTokens.spacing[1],
  },
});

export default EntropyScore;
