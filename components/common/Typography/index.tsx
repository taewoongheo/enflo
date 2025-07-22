import { baseTokens } from '@/styles';
import React from 'react';
import { StyleProp, Text, TextProps, TextStyle } from 'react-native';

type VariantKeys = keyof typeof baseTokens.typography;

interface TypographyProps extends TextProps {
  children: React.ReactNode;
  variant?: VariantKeys;
  style?: StyleProp<TextStyle>;
}

function Typography({
  children,
  variant = 'body1Regular',
  style,
  ...rest
}: TypographyProps) {
  const { fontSize, fontWeight, lineHeight } = baseTokens.typography[variant];

  return (
    <Text
      {...rest}
      style={[
        {
          fontSize,
          fontWeight,
          lineHeight,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

export default Typography;
