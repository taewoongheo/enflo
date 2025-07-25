import Typography from '@/components/common/Typography';
import { useTheme } from '@/contexts/ThemeContext';
import { baseTokens } from '@/styles';
import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

const EntropyScore = () => {
  const { theme } = useTheme();
  return (
    <TouchableOpacity
      style={styles.entropyScoreContainer}
      activeOpacity={0.7}
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
        size={14}
        color={theme.colors.text.secondary}
        style={{
          marginTop: baseTokens.spacing[2],
          marginLeft: baseTokens.spacing[1],
        }}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  entropyScoreContainer: {
    flexDirection: 'row',
  },
});

export default EntropyScore;
