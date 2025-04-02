import React, { createContext, useState, useContext } from 'react';

// Create the context
const ProgressionContext = createContext();

// Custom hook to use the progression context
export const useProgression = () => useContext(ProgressionContext);

// Common chord progressions with their degrees and names
const commonProgressions = {
  'I-IV-V-I': {
    name: 'Basic (I-IV-V-I)',
    degrees: [0, 3, 4, 0],
    description: 'The most fundamental chord progression in Western music.'
  },
  'I-V-vi-IV': {
    name: 'Pop (I-V-vi-IV)',
    degrees: [0, 4, 5, 3],
    description: 'Used in countless pop, rock, and country songs.'
  },
  'ii-V-I': {
    name: 'Jazz (ii-V-I)',
    degrees: [1, 4, 0],
    description: 'The foundation of jazz harmony.'
  },
  'I-vi-IV-V': {
    name: '50s (I-vi-IV-V)',
    degrees: [0, 5, 3, 4],
    description: 'Common in 50s doo-wop and early rock and roll.'
  },
  'vi-IV-I-V': {
    name: 'Emotional (vi-IV-I-V)',
    degrees: [5, 3, 0, 4],
    description: 'Creates a more emotional, introspective feeling.'
  }
};

// Provider component
export const ProgressionProvider = ({ children }) => {
  const [selectedProgression, setSelectedProgression] = useState('I-IV-V-I');
  const [customProgression, setCustomProgression] = useState([]);
  
  // Get the current progression (either common or custom)
  const getCurrentProgression = () => {
    if (customProgression.length > 0) {
      return {
        name: 'Custom',
        degrees: customProgression,
        description: 'Your custom chord progression'
      };
    }
    
    return commonProgressions[selectedProgression] || commonProgressions['I-IV-V-I'];
  };
  
  // Value to be provided by the context
  const value = {
    selectedProgression,
    setSelectedProgression,
    customProgression,
    setCustomProgression,
    getCurrentProgression,
    commonProgressions
  };

  return (
    <ProgressionContext.Provider value={value}>
      {children}
    </ProgressionContext.Provider>
  );
};
