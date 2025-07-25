import { palette } from './palette';

export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: {
      primary: string;
      secondary: string;
    };
    sessionCard: {
      background: string;
      edgeGradient: string;
      border: string;
      text: {
        name: string;
        timer: string;
        label: string;
      };
    };
    border: string;
  };
}

export const lightTheme = {
  colors: {
    primary: palette.neutral[600],
    secondary: palette.neutral[500],
    background: palette.neutral[50],
    text: {
      primary: palette.neutral[900],
      secondary: palette.neutral[500],
    },
    sessionCard: {
      background: palette.neutral[200],
      edgeGradient: 'rgba(0, 0, 255, 0)',
      text: {
        name: palette.neutral[900],
        timer: palette.neutral[600],
        label: palette.neutral[500],
      },
    },
    border: palette.neutral[200],
  },
};

export const darkTheme = {
  colors: {
    primary: palette.neutral[500],
    secondary: palette.neutral[500],
    background: palette.neutral[900],
    text: {
      primary: palette.neutral[50],
      secondary: palette.neutral[400],
    },
    sessionCard: {
      background: 'rgba(130, 134, 138, 0.5)',
      border: 'rgb(120, 125, 130)',
      edgeGradient: 'rgba(30, 32, 34, 0)',
      text: {
        name: palette.neutral[200],
        timer: palette.neutral[100],
        label: palette.neutral[400],
      },
    },
    border: palette.neutral[700],
  },
};

export const themes = {
  light: lightTheme,
  dark: darkTheme,
} as const;

export type ThemeName = keyof typeof themes;
