import React, { createContext, useContext } from 'react';
import { useUserProgress } from './UserProgressContext';

const PreferencesContext = createContext();

export const usePreferences = () => useContext(PreferencesContext);

export const PreferencesProvider = ({ children }) => {
  const { progress, updatePreferences } = useUserProgress();
  
  // Get current preferences from UserProgress
  const preferences = progress.preferences || {
    notationPreference: 'piano',
    audioEnabled: true,
    showTips: true,
  };
  
  // Set notation preference (piano, guitar, standard)
  const setNotationPreference = (preference) => {
    if (['piano', 'guitar', 'standard'].includes(preference)) {
      updatePreferences({ notationPreference: preference });
    }
  };
  
  // Toggle audio
  const toggleAudio = () => {
    updatePreferences({ audioEnabled: !preferences.audioEnabled });
  };
  
  // Toggle showing tips
  const toggleTips = () => {
    updatePreferences({ showTips: !preferences.showTips });
  };
  
  // Set multiple preferences at once
  const setMultiplePreferences = (newPreferences) => {
    updatePreferences(newPreferences);
  };
  
  // Value to be provided by context
  const value = {
    preferences,
    setNotationPreference,
    toggleAudio,
    toggleTips,
    setMultiplePreferences
  };
  
  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
};

export default PreferencesProvider;
