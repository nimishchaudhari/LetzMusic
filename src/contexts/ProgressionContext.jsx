import React, { createContext, useState, useContext, useEffect } from 'react';
import { getDiatonicChords } from '../utils/music-theory';

// Create context
const ProgressionContext = createContext();

// Custom hook to use the progression context
export const useProgression = () => useContext(ProgressionContext);

// Provider component
export const ProgressionProvider = ({ children }) => {
  // State for current chord progression
  const [currentProgression, setCurrentProgression] = useState([]);
  const [currentKey, setCurrentKey] = useState({ root: 'C', type: 'major' });
  const [diatonicChords, setDiatonicChords] = useState([]);
  const [savedProgressions, setSavedProgressions] = useState([]);
  
  // Load saved progressions from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('savedProgressions');
    if (saved) {
      try {
        setSavedProgressions(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading saved progressions:', e);
      }
    }
  }, []);
  
  // Save progressions to localStorage when they change
  useEffect(() => {
    localStorage.setItem('savedProgressions', JSON.stringify(savedProgressions));
  }, [savedProgressions]);
  
  // Update diatonic chords when key changes
  useEffect(() => {
    const chords = getDiatonicChords(currentKey.root, currentKey.type);
    setDiatonicChords(chords);
  }, [currentKey]);
  
  // Add a chord to the progression
  const addChord = (chord) => {
    setCurrentProgression(prev => [...prev, chord]);
  };
  
  // Remove a chord from the progression at a specific index
  const removeChord = (index) => {
    setCurrentProgression(prev => prev.filter((_, i) => i !== index));
  };
  
  // Update a chord at a specific index
  const updateChord = (index, newChord) => {
    setCurrentProgression(prev => {
      const updated = [...prev];
      updated[index] = newChord;
      return updated;
    });
  };
  
  // Clear the entire progression
  const clearProgression = () => {
    setCurrentProgression([]);
  };
  
  // Save the current progression
  const saveProgression = (name) => {
    const newSavedProgression = {
      id: Date.now().toString(),
      name: name || `Progression ${savedProgressions.length + 1}`,
      key: currentKey,
      chords: currentProgression,
      createdAt: new Date().toISOString()
    };
    
    setSavedProgressions(prev => [...prev, newSavedProgression]);
    return newSavedProgression.id;
  };
  
  // Load a saved progression
  const loadProgression = (id) => {
    const progression = savedProgressions.find(p => p.id === id);
    if (progression) {
      setCurrentKey(progression.key);
      setCurrentProgression(progression.chords);
      return true;
    }
    return false;
  };
  
  // Delete a saved progression
  const deleteProgression = (id) => {
    setSavedProgressions(prev => prev.filter(p => p.id !== id));
  };
  
  // Generate a common chord progression in the current key
  const generateProgression = (type = 'basic') => {
    // Patterns defined by roman numerals (array indices of diatonicChords)
    const progressionPatterns = {
      basic: [0, 3, 4, 0], // I-IV-V-I
      pop: [0, 4, 5, 3], // I-V-vi-IV
      fifties: [0, 5, 3, 4], // I-vi-IV-V
      jazz: [1, 4, 0, 5], // ii-V-I-vi
      blues: [0, 0, 0, 0, 3, 3, 0, 0, 4, 3, 0, 0] // I-I-I-I-IV-IV-I-I-V-IV-I-I
    };
    
    const pattern = progressionPatterns[type] || progressionPatterns.basic;
    
    if (diatonicChords.length === 0) {
      return; // No chords available
    }
    
    // Create progression based on pattern
    const newProgression = pattern.map(index => {
      if (index < diatonicChords.length) {
        return diatonicChords[index];
      }
      return diatonicChords[0]; // Default to tonic if index is out of bounds
    });
    
    setCurrentProgression(newProgression);
    return newProgression;
  };
  
  // Value to be provided by the context
  const value = {
    currentProgression,
    currentKey,
    setCurrentKey,
    diatonicChords,
    addChord,
    removeChord,
    updateChord,
    clearProgression,
    saveProgression,
    loadProgression,
    deleteProgression,
    savedProgressions,
    generateProgression
  };

  return (
    <ProgressionContext.Provider value={value}>
      {children}
    </ProgressionContext.Provider>
  );
};

// Export the provider component instead of the context
export default ProgressionProvider;