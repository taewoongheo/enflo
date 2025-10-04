import Typography from '@/components/common/Typography';
import { useTheme } from '@/contexts/ThemeContext';
import { baseTokens } from '@/styles';
import React from 'react';
import { View } from 'react-native';

export const SectionTitle = ({ children }: { children: string }) => {
  const { theme } = useTheme();

  return (
    <Typography
      variant="title3Bold"
      style={{
        color: theme.colors.text.primary,
        marginTop: baseTokens.spacing[5],
        marginBottom: baseTokens.spacing[3],
      }}
    >
      {children}
    </Typography>
  );
};

export const SectionContent = ({ children }: { children: string }) => {
  const { theme } = useTheme();

  return (
    <Typography
      variant="body1Regular"
      style={{
        color: theme.colors.text.secondary,
        marginBottom: baseTokens.spacing[2],
      }}
    >
      {children}
    </Typography>
  );
};

export const BulletPoint = ({ children }: { children: string }) => {
  const { theme } = useTheme();

  return (
    <View
      style={{
        flexDirection: 'row',
        marginBottom: baseTokens.spacing[2],
        paddingLeft: baseTokens.spacing[4],
      }}
    >
      <Typography
        variant="body1Regular"
        style={{
          color: theme.colors.text.secondary,
          marginRight: baseTokens.spacing[2],
        }}
      >
        •
      </Typography>
      <Typography
        variant="body1Regular"
        style={{
          color: theme.colors.text.secondary,
          flex: 1,
        }}
      >
        {children}
      </Typography>
    </View>
  );
};

export const SubBulletPoint = ({
  title,
  detail,
}: {
  title: string;
  detail: string;
}) => {
  const { theme } = useTheme();

  return (
    <View
      style={{
        marginBottom: baseTokens.spacing[3],
        paddingLeft: baseTokens.spacing[4],
      }}
    >
      <View
        style={{ flexDirection: 'row', marginBottom: baseTokens.spacing[1] }}
      >
        <Typography
          variant="body1Regular"
          style={{
            color: theme.colors.text.secondary,
            marginRight: baseTokens.spacing[2],
          }}
        >
          •
        </Typography>
        <Typography
          variant="body1Bold"
          style={{ color: theme.colors.text.primary, flex: 1 }}
        >
          {title}
        </Typography>
      </View>
      <Typography
        variant="body2Regular"
        style={{
          color: theme.colors.text.secondary,
          paddingLeft: baseTokens.spacing[4],
        }}
      >
        {detail}
      </Typography>
    </View>
  );
};

export const NumberedPoint = ({
  number,
  children,
}: {
  number: number;
  children: string;
}) => {
  const { theme } = useTheme();

  return (
    <View
      style={{
        flexDirection: 'row',
        marginBottom: baseTokens.spacing[2],
        paddingLeft: baseTokens.spacing[4],
      }}
    >
      <Typography
        variant="body1Regular"
        style={{
          color: theme.colors.text.secondary,
          marginRight: baseTokens.spacing[2],
          minWidth: baseTokens.spacing[4],
        }}
      >
        {number}.
      </Typography>
      <Typography
        variant="body1Regular"
        style={{
          color: theme.colors.text.secondary,
          flex: 1,
        }}
      >
        {children}
      </Typography>
    </View>
  );
};

export const Copyright = ({ children }: { children: string }) => {
  const { theme } = useTheme();

  return (
    <Typography
      variant="body2Regular"
      style={{
        color: theme.colors.text.secondary,
        textAlign: 'center',
        marginTop: baseTokens.spacing[6],
        fontStyle: 'italic',
      }}
    >
      {children}
    </Typography>
  );
};
