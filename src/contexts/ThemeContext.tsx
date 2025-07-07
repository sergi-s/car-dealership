import React, { useEffect, useState } from 'react';
import { themes, getCurrentTheme, setCurrentTheme, generateThemeCSS } from '../config/theme';
import { ThemeContext, type ThemeContextType } from './ThemeContextDef';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentTheme, setCurrentThemeState] = useState<string>(getCurrentTheme());

  const setTheme = (themeName: string) => {
    if (themes[themeName]) {
      setCurrentThemeState(themeName);
      setCurrentTheme(themeName);
      
      // Apply theme CSS to document
      const themeCSS = generateThemeCSS(themes[themeName]);
      applyThemeCSS(themeCSS);
    }
  };

  const applyThemeCSS = (css: string) => {
    // Remove existing theme style tag
    const existingStyle = document.getElementById('theme-styles');
    if (existingStyle) {
      existingStyle.remove();
    }

    // Create new style tag with theme CSS
    const style = document.createElement('style');
    style.id = 'theme-styles';
    style.textContent = css;
    document.head.appendChild(style);
  };

  useEffect(() => {
    // Apply initial theme
    const theme = themes[currentTheme];
    if (theme) {
      const themeCSS = generateThemeCSS(theme);
      applyThemeCSS(themeCSS);
    }
  }, [currentTheme]);

  const value: ThemeContextType = {
    currentTheme,
    theme: themes[currentTheme] || themes.default,
    setTheme,
    availableThemes: Object.keys(themes),
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}; 