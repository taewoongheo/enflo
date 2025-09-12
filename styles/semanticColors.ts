import { palette } from './palette';

interface SemanticColors {
  background: {
    surface: string;
    surfaceInverse: string;
    elevatedVariant: string;
    overlay: string;
  };
  text: {
    primary: string;
    secondary: string;
  };
  border: {
    primary: string;
    inverse: string;
  };
  timer: {
    button: {
      background: string;
      border: string;
      color: string;
    };
    cell: {
      primary: string;
      secondary: string;
      picker: string;
    };
  };
  stats: {
    toggle: {
      selectedBackground: string;
      border: string;
    };
  };
}

export const lightSemanticColors: SemanticColors = {
  background: {
    surface: palette.neutral[300],
    surfaceInverse: palette.neutral[350],
    elevatedVariant: palette.neutral[750],
    overlay: palette.neutral[900],
  },
  text: {
    primary: palette.neutral[50],
    secondary: palette.neutral[400],
  },
  border: {
    primary: palette.neutral[600],
    inverse: palette.neutral[250],
  },
  timer: {
    button: {
      background: palette.neutral[400],
      border: palette.neutral[350],
      color: palette.neutral[50],
    },
    cell: {
      primary: palette.neutral[400],
      secondary: palette.neutral[500],
      picker: 'rgb(208, 255, 68)',
    },
  },
  stats: {
    toggle: {
      selectedBackground: palette.neutral[600],
      border: palette.neutral[700],
    },
  },
};

export const darkSemanticColors: SemanticColors = {
  background: {
    surface: palette.neutral[900],
    surfaceInverse: palette.neutral[350],
    elevatedVariant: palette.neutral[750],
    overlay: palette.neutral[900],
  },
  text: {
    primary: palette.neutral[50],
    secondary: palette.neutral[400],
  },
  border: {
    primary: palette.neutral[600],
    inverse: palette.neutral[250],
  },
  timer: {
    button: {
      background: palette.neutral[400],
      border: palette.neutral[350],
      color: palette.neutral[50],
    },
    cell: {
      primary: palette.neutral[400],
      secondary: palette.neutral[500],
      picker: 'rgb(208, 255, 68)',
    },
  },
  stats: {
    toggle: {
      selectedBackground: palette.neutral[600],
      border: palette.neutral[700],
    },
  },
};
