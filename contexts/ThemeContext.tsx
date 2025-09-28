import { Theme, ThemeName, themes } from '@/styles/themes';
import React, { createContext, ReactNode, useContext, useState } from 'react';

interface ThemeContextType {
  themeName: ThemeName;
  setTheme: (themeName: ThemeName) => void;
  theme: Theme;
}

export const INITIAL_THEME_NAME = 'dark';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [themeName, setTheme] = useState<ThemeName>(INITIAL_THEME_NAME);

  const value: ThemeContextType = {
    themeName,
    setTheme: (themeName: ThemeName) => {
      setTheme(themeName);
    },
    theme: themes[themeName] as Theme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
