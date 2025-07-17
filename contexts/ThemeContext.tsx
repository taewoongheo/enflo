import { darkTheme, Theme, ThemeName, themes } from '@/styles/themes';
import React, { createContext, ReactNode, useContext, useState } from 'react';

interface ThemeContextType {
  theme: Theme;
  setTheme: (themeName: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(darkTheme);

  const value: ThemeContextType = {
    theme,
    setTheme: (themeName: ThemeName) => {
      setTheme(themes[themeName]);
    },
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
