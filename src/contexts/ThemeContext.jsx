import React, { createContext, useState, useEffect, useContext } from 'react';

// Create context
const ThemeContext = createContext();

// Custom hook for using the theme context
export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  // Check if user prefers dark mode in system
  const prefersDarkMode = window.matchMedia && 
    window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // State for theme
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem('themePreference');
    if (savedTheme !== null) {
      return savedTheme === 'dark';
    }
    // If no saved preference, use system preference
    return prefersDarkMode;
  });

  // Apply theme class to body element
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }
    
    // Save preference to localStorage
    localStorage.setItem('themePreference', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Watch for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      // Only update if user hasn't explicitly set a preference
      if (localStorage.getItem('themePreference') === null) {
        setIsDarkMode(e.matches);
      }
    };
    
    // Add listener for changes
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // For older browsers
      mediaQuery.addListener(handleChange);
    }
    
    // Cleanup
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        // For older browsers
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);
  
  // Toggle theme function
  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  // Set specific theme
  const setTheme = (theme) => {
    setIsDarkMode(theme === 'dark');
  };

  // Value to be provided by context
  const value = {
    isDarkMode,
    toggleTheme,
    setTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;