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
    success: string;
    error: string;
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
    surface: palette.light[100],
    surfaceInverse: palette.light[700],
    elevatedVariant: palette.light[150],
    overlay: palette.light[150],
  },
  text: {
    primary: palette.light[700],
    secondary: palette.light[550],
    success: palette.green[700],
    error: palette.red[700],
  },
  border: {
    primary: palette.light[400],
    inverse: palette.light[700],
  },
  timer: {
    button: {
      background: palette.light[700],
      border: palette.light[1000],
      color: palette.light[100],
    },
    cell: {
      primary: palette.light[650],
      secondary: palette.light[600],
      picker: 'rgb(221, 85, 35)',
    },
  },
  stats: {
    toggle: {
      selectedBackground: palette.light[600],
      border: palette.light[500],
    },
  },
};

export const darkSemanticColors: SemanticColors = {
  background: {
    surface: palette.dark[900],
    surfaceInverse: palette.dark[350],
    elevatedVariant: palette.dark[750],
    overlay: palette.dark[900],
  },
  text: {
    primary: palette.dark[50],
    secondary: palette.dark[400],
    success: palette.green[400],
    error: palette.red[400],
  },
  border: {
    primary: palette.dark[600],
    inverse: palette.dark[250],
  },
  timer: {
    button: {
      background: palette.dark[400],
      border: palette.dark[350],
      color: palette.dark[50],
    },
    cell: {
      primary: palette.dark[400],
      secondary: palette.dark[500],
      picker: 'rgb(208, 255, 68)',
    },
  },
  stats: {
    toggle: {
      selectedBackground: palette.dark[200],
      border: palette.dark[700],
    },
  },
};
