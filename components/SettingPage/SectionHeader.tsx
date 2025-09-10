import Typography from '@/components/common/Typography';
import { Theme } from '@/styles';
import React from 'react';

interface SectionHeaderProps {
  theme: Theme;
  title: string;
}

export default function SectionHeader({ theme, title }: SectionHeaderProps) {
  return (
    <Typography
      variant="body1Bold"
      style={{
        color: theme.colors.text.secondary,
      }}
    >
      {title}
    </Typography>
  );
}
