import { MainTheme } from '@/components/MainPage';
import { StatsTheme } from '@/components/StatsPage';
import { TimerTheme } from '@/components/TimerPage';
import { darkSemanticColors, lightSemanticColors } from './semanticColors';

export interface Theme {
  colors: {
    particles: {
      background: number;
      base: number;
      maxAlpha: number;
      minAlpha: number;
    };
    proPromotion: {
      background: string;
      errorText: string;
    };
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
      success: string;
      error: string;
    };
    pages: {
      main: MainTheme;
      timer: TimerTheme;
      stats: StatsTheme;
    };
  };
}

const lightTheme = {
  colors: {
    particles: {
      background: 0,
      base: 0,
      maxAlpha: 1,
      minAlpha: 0.5,
    },
    proPromotion: {
      background: lightSemanticColors.background.surfaceInverse,
      errorText: lightSemanticColors.text.errorInverse,
    },
    background: lightSemanticColors.background.surface,
    text: {
      primary: lightSemanticColors.text.primary,
      secondary: lightSemanticColors.text.secondary,
      success: lightSemanticColors.text.success,
      error: lightSemanticColors.text.error,
    },
    bottomSheet: {
      background: lightSemanticColors.background.overlay,
      buttonBackground: lightSemanticColors.background.surfaceInverse,
      text: {
        primary: lightSemanticColors.text.primary,
        placeholder: lightSemanticColors.text.secondary,
      },
      border: lightSemanticColors.border.primary,
    },
    pages: {
      main: {
        sessionCard: {
          background: lightSemanticColors.background.elevatedVariant,
          border: lightSemanticColors.border.primary,
          addButtonBorder: lightSemanticColors.border.inverse,
          addButtonBackground: lightSemanticColors.background.surfaceInverse,
          text: {
            name: lightSemanticColors.text.primary,
            timer: lightSemanticColors.text.primary,
            label: lightSemanticColors.text.secondary,
          },
        },
      },
      timer: {
        slider: {
          background: lightSemanticColors.background.elevatedVariant,
          picker: lightSemanticColors.timer.cell.picker,
          button: {
            icon: lightSemanticColors.timer.button.color,
            background: lightSemanticColors.timer.button.background,
            border: lightSemanticColors.timer.button.border,
          },
          cell: {
            primary: lightSemanticColors.timer.cell.primary,
            secondary: lightSemanticColors.timer.cell.secondary,
          },
          text: {
            primary: lightSemanticColors.text.primary,
            secondary: lightSemanticColors.text.secondary,
          },
        },
      },
      stats: {
        toggle: {
          selectedBackground:
            lightSemanticColors.stats.toggle.selectedBackground,
          border: lightSemanticColors.stats.toggle.border,
        },
      },
    },
  },
};

const darkTheme = {
  colors: {
    particles: {
      background: 255,
      base: 255,
      maxAlpha: 1,
      minAlpha: 0.6,
    },
    proPromotion: {
      background: darkSemanticColors.background.surfaceInverse,
      errorText: darkSemanticColors.text.errorInverse,
    },
    background: darkSemanticColors.background.surface,
    text: {
      primary: darkSemanticColors.text.primary,
      secondary: darkSemanticColors.text.secondary,
      success: darkSemanticColors.text.success,
      error: darkSemanticColors.text.error,
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
  light: lightTheme,
  dark: darkTheme,
} as const;

export type ThemeName = keyof typeof themes;
