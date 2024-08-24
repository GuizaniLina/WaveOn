import React, { createContext, useEffect, useState } from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';

export const ThemeContext = createContext();

const darkTheme = {
  $backgroundColor: '#333',
  $textColor: '#fff',
  $buttonTextColor: '#fff',
  $iconColor: '#333',
  $standard:'#444',
  $container : 'grey'
};

const lightTheme = {
  $backgroundColor: 'rgba(223, 220, 201, 0.8)',
  $textColor: '#333',
  $buttonTextColor: '#000',
  $iconColor: '#fff',
  $standard:'rgba(223, 220, 201, 0.8)',
  $container : '#E4E6D9'
};

export const ThemeProvider = ({ children, themeType: initialThemeType }) => {
  const [themeType, setThemeType] = useState(initialThemeType);
  const [themeKey, setThemeKey] = useState(0);

  useEffect(() => {
    const theme = themeType === 'dark' ? darkTheme : lightTheme;
    EStyleSheet.build(theme);
    setThemeKey((prevKey) => prevKey + 1); // Increment key to trigger re-render
  }, [themeType]);

  const setTheme = (newThemeType) => {
    setThemeType(newThemeType);
  };

  return (
    <ThemeContext.Provider value={{ theme: themeType === 'dark' ? darkTheme : lightTheme, setTheme, themeKey }}>
      {children}
    </ThemeContext.Provider>
  );
};