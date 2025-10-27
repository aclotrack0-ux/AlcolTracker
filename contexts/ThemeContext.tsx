import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Theme } from '@/types/bac';
import { saveTheme, getTheme } from '@/services/storage';
import { colors } from '@/constants/colors';

interface ThemeContextType {
  theme: Theme;
  colors: typeof colors.light;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await getTheme();
      setThemeState(savedTheme);
    } catch (error) {
      console.error('Error loading theme:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setTheme = async (newTheme: Theme) => {
    try {
      setThemeState(newTheme);
      await saveTheme(newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const currentColors = theme === 'light' ? colors.light : colors.dark;

  if (isLoading) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, colors: currentColors, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}