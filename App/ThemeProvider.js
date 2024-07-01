import React, { createContext, useState } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children, themeType }) => {
 

  const darkTheme = {
    backgroundColor: 'rgba(34, 34, 34, 0.8)',
    textColor: '#fff',
    buttonTextColor: '#fff',
    // Define other dark theme properties as needed
  };

  const lightTheme = {
    backgroundColor: 'rgba(214, 164, 126,0.3)',
    textColor: '#000',
    buttonTextColor: '#000',
    // Define other light theme properties as needed
  };

  const initialTheme = themeType === 'dark' ? darkTheme : lightTheme;
  const [theme, setTheme] = useState(initialTheme);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};