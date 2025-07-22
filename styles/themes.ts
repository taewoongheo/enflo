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
    border: palette.neutral[700],
  },
};

export const themes = {
  light: lightTheme,
  dark: darkTheme,
} as const;

export type ThemeName = keyof typeof themes;
