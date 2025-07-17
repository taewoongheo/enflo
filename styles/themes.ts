export interface Theme {
  name: string;
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

export const lightTheme: Theme = {
  name: 'light',
  colors: {
    primary: '#1E90FF',
    secondary: '#FF6347',
    background: '#FFFFFF',
    text: {
      primary: '#1A1A1A',
      secondary: '#6B7280',
    },
    border: '#E5E7EB',
  },
};

export const darkTheme: Theme = {
  name: 'dark',
  colors: {
    primary: '#3B82F6',
    secondary: '#F59E0B',
    background: '#111827',
    text: {
      primary: '#F9FAFB',
      secondary: '#D1D5DB',
    },
    border: '#374151',
  },
};

export const themes = {
  light: lightTheme,
  dark: darkTheme,
} as const;

export type ThemeName = keyof typeof themes;
