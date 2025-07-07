import { createContext } from 'react';
import type { Theme } from '../config/theme';

export interface ThemeContextType {
  currentTheme: string;
  theme: Theme;
  setTheme: (themeName: string) => void;
  availableThemes: string[];
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined); 