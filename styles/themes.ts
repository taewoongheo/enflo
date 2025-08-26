import { MainTheme } from '@/components/MainPage';
import { TimerTheme } from '@/components/TimerPage';
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
    pages: {
      main: MainTheme;
      timer: TimerTheme;
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
    components: {
      sessionCard: {
        background: palette.neutral[200],
        border: palette.neutral[200],
        edgeGradient: 'rgba(0, 0, 255, 0)',
        text: {
          name: palette.neutral[900],
          timer: palette.neutral[600],
          label: palette.neutral[500],
        },
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
    pages: {
      main: {
        sessionCard: {
          background: palette.neutral[750],
          border: palette.neutral[600],
          edgeGradient: 'rgba(30, 32, 34, 0)',
          text: {
            name: palette.neutral[200],
            timer: palette.neutral[100],
            label: palette.neutral[400],
          },
        },
      },
      timer: {
        slider: {
          background: palette.neutral[750],
          edgeGradient: 'rgba(39, 48, 63, 0.5)',
          picker: 'rgb(208, 255, 68)',
          button: {
            icon: palette.neutral[50],
            background: 'rgb(91, 104, 125)',
            border: 'rgb(138, 149, 165)',
          },
          cell: {
            primary: palette.neutral[400],
            secondary: palette.neutral[500],
          },
          text: {
            primary: palette.neutral[50],
            secondary: palette.neutral[400],
          },
        },
        info: {
          background: palette.neutral[800],
        },
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
