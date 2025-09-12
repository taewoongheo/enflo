import { MainTheme } from '@/components/MainPage';
import { StatsTheme } from '@/components/StatsPage';
import { TimerTheme } from '@/components/TimerPage';
import { darkSemanticColors } from './semanticColors';

export interface Theme {
  colors: {
    background: string;
    bottomSheet: {
      background: string;
      buttonBackground: string;
      text: {
        primary: string;
        placeholder: string;
      };
      border: string;
    };
    text: {
      primary: string;
      secondary: string;
    };
    pages: {
      main: MainTheme;
      timer: TimerTheme;
      stats: StatsTheme;
    };
  };
}

export const darkTheme = {
  colors: {
    background: darkSemanticColors.background.surface,
    text: {
      primary: darkSemanticColors.text.primary,
      secondary: darkSemanticColors.text.secondary,
    },
    bottomSheet: {
      background: darkSemanticColors.background.overlay,
      buttonBackground: darkSemanticColors.background.surfaceInverse,
      text: {
        primary: darkSemanticColors.text.primary,
        placeholder: darkSemanticColors.text.secondary,
      },
      border: darkSemanticColors.border.primary,
    },
    pages: {
      main: {
        sessionCard: {
          background: darkSemanticColors.background.elevatedVariant,
          border: darkSemanticColors.border.primary,
          addButtonBorder: darkSemanticColors.border.inverse,
          addButtonBackground: darkSemanticColors.background.surfaceInverse,
          text: {
            name: darkSemanticColors.text.primary,
            timer: darkSemanticColors.text.primary,
            label: darkSemanticColors.text.secondary,
          },
        },
      },
      timer: {
        slider: {
          background: darkSemanticColors.background.elevatedVariant,
          picker: darkSemanticColors.timer.cell.picker,
          button: {
            icon: darkSemanticColors.timer.button.color,
            background: darkSemanticColors.timer.button.background,
            border: darkSemanticColors.timer.button.border,
          },
          cell: {
            primary: darkSemanticColors.timer.cell.primary,
            secondary: darkSemanticColors.timer.cell.secondary,
          },
          text: {
            primary: darkSemanticColors.text.primary,
            secondary: darkSemanticColors.text.secondary,
          },
        },
      },
      stats: {
        toggle: {
          selectedBackground:
            darkSemanticColors.stats.toggle.selectedBackground,
          border: darkSemanticColors.stats.toggle.border,
        },
      },
    },
  },
};

export const themes = {
  dark: darkTheme,
} as const;

export type ThemeName = keyof typeof themes;
