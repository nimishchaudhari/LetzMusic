import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUserProgress } from './UserProgressContext';
import { 
  NOTES, 
  INTERVALS, 
  CHORD_FORMULAS, 
  SCALE_FORMULAS,
  generateScale,
  getChordNotes
} from '../utils/music-theory';

const EarTrainingContext = createContext();

export const useEarTraining = () => useContext(EarTrainingContext);

export const EarTrainingProvider = ({ children }) => {
  const { progress, updateConceptMastery } = useUserProgress();
  
  // Current exercise state
  const [currentExercise, setCurrentExercise] = useState(null);
  const [exerciseType, setExerciseType] = useState('interval'); // 'interval', 'chord', 'scale', 'progression'
  const [difficulty, setDifficulty] = useState('beginner');
  const [mode, setMode] = useState('practice'); // 'practice', 'challenge'
  
  // Exercise session state
  const [sessionStats, setSessionStats] = useState({
    correct: 0,
    incorrect: 0,
    streak: 0,
    maxStreak: 0,
    startTime: null,
    totalTime: 0
  });
  
  // Exercise generation settings
  const [exerciseSettings, setExerciseSettings] = useState({
    interval: {
      beginner: { intervals: [2, 3, 4, 5, 7], octaveRange: 1 },
      intermediate: { intervals: [1, 2, 3, 4, 5, 6, 7, 8, 9], octaveRange: 2 },
      advanced: { intervals: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], octaveRange: 3 }
    },
    chord: {
      beginner: { chordTypes: ['maj', 'min'], inversions: false },
      intermediate: { chordTypes: ['maj', 'min', 'dim', 'aug', '7'], inversions: true },
      advanced: { chordTypes: ['maj', 'min', 'dim', 'aug', '7', 'maj7', 'min7', 'm7b5'], inversions: true }
    },
    scale: {
      beginner: { scaleTypes: ['major', 'minor'], keyRange: ['C', 'D', 'E', 'F', 'G', 'A', 'B'] },
      intermediate: { scaleTypes: ['major', 'minor', 'dorian', 'mixolydian'], keyRange: NOTES.slice(0, 8) },
      advanced: { scaleTypes: Object.keys(SCALE_FORMULAS), keyRange: NOTES }
    }
  });

  // Generate random interval exercise
  const generateIntervalExercise = () => {
    const settings = exerciseSettings.interval[difficulty];
    const intervals = settings.intervals;
    const selectedInterval = intervals[Math.floor(Math.random() * intervals.length)];
    
    // Pick random root note and octave
    const rootNote = NOTES[Math.floor(Math.random() * NOTES.length)];
    const rootOctave = 3 + Math.floor(Math.random() * settings.octaveRange);
    const targetOctave = rootOctave + Math.floor(selectedInterval / 12);
    
    const rootNoteWithOctave = `${rootNote}${rootOctave}`;
    const targetNoteIndex = (NOTES.indexOf(rootNote) + selectedInterval) % 12;
    const targetNote = NOTES[targetNoteIndex];
    const targetNoteWithOctave = `${targetNote}${targetOctave}`;
    
    return {
      type: 'interval',
      rootNote: rootNoteWithOctave,
      targetNote: targetNoteWithOctave,
      interval: selectedInterval,
      correctAnswer: INTERVALS[selectedInterval],
      options: generateIntervalOptions(selectedInterval),
      playSequentially: true,
      playTogether: false
    };
  };

  // Generate interval answer options
  const generateIntervalOptions = (correctInterval) => {
    const settings = exerciseSettings.interval[difficulty];
    const availableIntervals = settings.intervals;
    
    // Always include the correct answer
    const options = [correctInterval];
    
    // Add wrong answers
    while (options.length < 4) {
      const randomInterval = availableIntervals[Math.floor(Math.random() * availableIntervals.length)];
      if (!options.includes(randomInterval)) {
        options.push(randomInterval);
      }
    }
    
    // Shuffle options
    return options.sort(() => Math.random() - 0.5).map(interval => ({
      value: interval,
      label: INTERVALS[interval]
    }));
  };

  // Generate random chord exercise
  const generateChordExercise = () => {
    const settings = exerciseSettings.chord[difficulty];
    const chordTypes = settings.chordTypes;
    const selectedChordType = chordTypes[Math.floor(Math.random() * chordTypes.length)];
    
    const rootNote = NOTES[Math.floor(Math.random() * NOTES.length)];
    const octave = 4; // Standard octave for chords
    
    const chordNotes = getChordNotes(rootNote, selectedChordType, octave);
    
    return {
      type: 'chord',
      rootNote: `${rootNote}${octave}`,
      chordType: selectedChordType,
      chordNotes,
      correctAnswer: selectedChordType,
      options: generateChordOptions(selectedChordType),
      playArpeggio: false,
      playTogether: true
    };
  };

  // Generate chord answer options
  const generateChordOptions = (correctChordType) => {
    const settings = exerciseSettings.chord[difficulty];
    const availableChords = settings.chordTypes;
    
    const options = [correctChordType];
    
    while (options.length < 4) {
      const randomChord = availableChords[Math.floor(Math.random() * availableChords.length)];
      if (!options.includes(randomChord)) {
        options.push(randomChord);
      }
    }
    
    return options.sort(() => Math.random() - 0.5).map(chord => ({
      value: chord,
      label: getChordLabel(chord)
    }));
  };

  // Get human-readable chord label
  const getChordLabel = (chordType) => {
    const labels = {
      'maj': 'Major',
      'min': 'Minor', 
      'dim': 'Diminished',
      'aug': 'Augmented',
      '7': 'Dominant 7th',
      'maj7': 'Major 7th',
      'min7': 'Minor 7th',
      'm7b5': 'Half Diminished'
    };
    return labels[chordType] || chordType;
  };

  // Generate scale exercise
  const generateScaleExercise = () => {
    const settings = exerciseSettings.scale[difficulty];
    const scaleTypes = settings.scaleTypes;
    const selectedScaleType = scaleTypes[Math.floor(Math.random() * scaleTypes.length)];
    
    const keyRange = settings.keyRange;
    const rootNote = keyRange[Math.floor(Math.random() * keyRange.length)];
    
    const scale = generateScale(rootNote, selectedScaleType);
    const scaleWithOctaves = scale.map(note => `${note}4`);
    
    return {
      type: 'scale',
      rootNote: `${rootNote}4`,
      scaleType: selectedScaleType,
      scaleNotes: scaleWithOctaves,
      correctAnswer: selectedScaleType,
      options: generateScaleOptions(selectedScaleType),
      playAscending: true,
      playDescending: false
    };
  };

  // Generate scale answer options
  const generateScaleOptions = (correctScaleType) => {
    const settings = exerciseSettings.scale[difficulty];
    const availableScales = settings.scaleTypes;
    
    const options = [correctScaleType];
    
    while (options.length < 4) {
      const randomScale = availableScales[Math.floor(Math.random() * availableScales.length)];
      if (!options.includes(randomScale)) {
        options.push(randomScale);
      }
    }
    
    return options.sort(() => Math.random() - 0.5).map(scale => ({
      value: scale,
      label: scale.charAt(0).toUpperCase() + scale.slice(1)
    }));
  };

  // Generate new exercise based on type
  const generateExercise = (type = exerciseType) => {
    let exercise;
    
    switch (type) {
      case 'interval':
        exercise = generateIntervalExercise();
        break;
      case 'chord':
        exercise = generateChordExercise();
        break;
      case 'scale':
        exercise = generateScaleExercise();
        break;
      default:
        exercise = generateIntervalExercise();
    }
    
    setCurrentExercise(exercise);
    return exercise;
  };

  // Submit answer and update stats
  const submitAnswer = (answer) => {
    if (!currentExercise) return;
    
    const isCorrect = answer === currentExercise.correctAnswer;
    
    setSessionStats(prev => {
      const newStreak = isCorrect ? prev.streak + 1 : 0;
      return {
        ...prev,
        correct: prev.correct + (isCorrect ? 1 : 0),
        incorrect: prev.incorrect + (isCorrect ? 0 : 1),
        streak: newStreak,
        maxStreak: Math.max(prev.maxStreak, newStreak)
      };
    });

    // Update user progress with more detailed tracking
    const conceptId = `eartraining-${exerciseType}-${difficulty}`;
    const masteryLevel = isCorrect ? 'correct' : 'incorrect';
    
    // Track specific exercise types for better progress tracking
    const specificConceptId = `${exerciseType}-${difficulty}-${currentExercise.correctAnswer}`;
    
    if (updateConceptMastery) {
      updateConceptMastery(conceptId, masteryLevel);
      updateConceptMastery(specificConceptId, masteryLevel);
    }

    return isCorrect;
  };

  // Start new session
  const startSession = () => {
    setSessionStats({
      correct: 0,
      incorrect: 0,
      streak: 0,
      maxStreak: 0,
      startTime: Date.now(),
      totalTime: 0
    });
  };

  // End session
  const endSession = () => {
    setSessionStats(prev => ({
      ...prev,
      totalTime: prev.startTime ? Date.now() - prev.startTime : 0
    }));
  };

  const value = {
    // State
    currentExercise,
    exerciseType,
    difficulty,
    mode,
    sessionStats,
    exerciseSettings,
    
    // Actions
    setExerciseType,
    setDifficulty,
    setMode,
    generateExercise,
    submitAnswer,
    startSession,
    endSession,
    setCurrentExercise
  };

  return (
    <EarTrainingContext.Provider value={value}>
      {children}
    </EarTrainingContext.Provider>
  );
};

export default EarTrainingProvider;