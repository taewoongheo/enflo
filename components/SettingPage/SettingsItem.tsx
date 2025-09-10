import Typography from '@/components/common/Typography';
import { baseTokens, Theme } from '@/styles';
import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { Pressable } from 'react-native';

interface SettingsItemProps {
  theme: Theme;
  title: string;
  onPress: () => void;
}

export default function SettingsItem({
  theme,
  title,
  onPress,
}: SettingsItemProps) {
  return (
    <Pressable
      onPress={onPress}
      style={() => ({
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        // padding: baseTokens.spacing[3],
        // backgroundColor: pressed
        //   ? theme.colors.pages.main.sessionCard.border
        //   : 'transparent',
      })}
    >
      <Typography
        variant="body1Regular"
        style={{
          color: theme.colors.text.primary,
          flex: 1,
        }}
      >
        {title}
      </Typography>
      <AntDesign
        name="right"
        size={baseTokens.iconSize.sm}
        color={theme.colors.text.secondary}
      />
    </Pressable>
  );
}
