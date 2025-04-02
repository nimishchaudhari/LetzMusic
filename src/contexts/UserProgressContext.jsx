import React, { createContext, useState, useEffect, useContext } from 'react';

// Create context
const UserProgressContext = createContext();

// Custom hook for using the progress context
export const useUserProgress = () => useContext(UserProgressContext);

export const UserProgressProvider = ({ children }) => {
  // State for user progress
  const [progress, setProgress] = useState({
    userLevel: null, // 'beginner', 'instrument-player', 'theory-basics'
    completedLessons: {},
    preferences: {
      notationPreference: 'piano', // 'piano', 'guitar', 'standard'
      audioEnabled: true,
      showTips: true,
    },
    conceptMastery: {},
    lastVisited: null,
    bookmarks: [],
    creations: [] // user-created progressions, scales, etc.
  });

  // Load progress from localStorage on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('musicTheoryProgress');
    if (savedProgress) {
      try {
        setProgress(JSON.parse(savedProgress));
      } catch (e) {
        console.error('Error parsing saved progress:', e);
      }
    }
  }, []);

  // Save progress to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('musicTheoryProgress', JSON.stringify(progress));
  }, [progress]);

  // Set user experience level
  const setUserLevel = (level) => {
    setProgress(prev => ({
      ...prev,
      userLevel: level
    }));
  };

  // Mark a lesson as completed
  const markLessonCompleted = (lessonId, completionData = {}) => {
    setProgress(prev => ({
      ...prev,
      completedLessons: {
        ...prev.completedLessons,
        [lessonId]: {
          completedAt: new Date().toISOString(),
          ...completionData
        }
      }
    }));
  };

  // Update concept mastery level
  const updateConceptMastery = (conceptId, level) => {
    setProgress(prev => ({
      ...prev,
      conceptMastery: {
        ...prev.conceptMastery,
        [conceptId]: {
          level,
          updatedAt: new Date().toISOString(),
          reviewDue: calculateNextReviewDate(level)
        }
      }
    }));
  };

  // Calculate next review date based on spaced repetition algorithm
  const calculateNextReviewDate = (masteryLevel) => {
    // Simple spaced repetition algorithm
    // Level 1: Review after 1 day
    // Level 2: Review after 3 days
    // Level 3: Review after 7 days
    // Level 4: Review after 14 days
    // Level 5: Review after 30 days
    const daysUntilReview = {
      1: 1,
      2: 3,
      3: 7,
      4: 14,
      5: 30
    };

    const today = new Date();
    const nextReview = new Date(today);
    nextReview.setDate(today.getDate() + (daysUntilReview[masteryLevel] || 1));
    
    return nextReview.toISOString();
  };

  // Update user preferences
  const updatePreferences = (newPreferences) => {
    setProgress(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        ...newPreferences
      }
    }));
  };

  // Track last visited page
  const updateLastVisited = (pageId) => {
    setProgress(prev => ({
      ...prev,
      lastVisited: pageId
    }));
  };

  // Add or remove a bookmark
  const toggleBookmark = (itemId) => {
    setProgress(prev => {
      const exists = prev.bookmarks.includes(itemId);
      const bookmarks = exists
        ? prev.bookmarks.filter(id => id !== itemId)
        : [...prev.bookmarks, itemId];

      return {
        ...prev,
        bookmarks
      };
    });
  };

  // Save a user creation
  const saveCreation = (creation) => {
    setProgress(prev => ({
      ...prev,
      creations: [
        ...prev.creations,
        {
          id: `creation-${Date.now()}`,
          createdAt: new Date().toISOString(),
          ...creation
        }
      ]
    }));
  };

  // Reset all progress
  const resetProgress = () => {
    setProgress({
      userLevel: null,
      completedLessons: {},
      preferences: {
        notationPreference: 'piano',
        audioEnabled: true,
        showTips: true,
      },
      conceptMastery: {},
      lastVisited: null,
      bookmarks: [],
      creations: []
    });
  };

  // Get concepts due for review based on spaced repetition
  const getConceptsDueForReview = () => {
    const now = new Date();
    return Object.entries(progress.conceptMastery)
      .filter(([_, data]) => new Date(data.reviewDue) <= now)
      .map(([conceptId]) => conceptId);
  };

  // Export all progress as JSON
  const exportProgress = () => {
    return JSON.stringify(progress);
  };

  // Import progress from JSON
  const importProgress = (jsonString) => {
    try {
      const importedProgress = JSON.parse(jsonString);
      setProgress(importedProgress);
      return true;
    } catch (e) {
      console.error('Error importing progress:', e);
      return false;
    }
  };

  // Value to be provided by context
  const value = {
    progress,
    setUserLevel,
    markLessonCompleted,
    updateConceptMastery,
    updatePreferences,
    updateLastVisited,
    toggleBookmark,
    saveCreation,
    resetProgress,
    getConceptsDueForReview,
    exportProgress,
    importProgress
  };

  return (
    <UserProgressContext.Provider value={value}>
      {children}
    </UserProgressContext.Provider>
  );
};

export default UserProgressProvider;