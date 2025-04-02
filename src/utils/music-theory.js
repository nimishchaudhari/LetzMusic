// Constants and utility functions for music theory

// Note constants
export const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Scale formulas (semitone patterns from the root)
export const SCALE_FORMULAS = {
  major: [0, 2, 4, 5, 7, 9, 11],
  minor: [0, 2, 3, 5, 7, 8, 10],
  // Modes
  dorian: [0, 2, 3, 5, 7, 9, 10],
  phrygian: [0, 1, 3, 5, 7, 8, 10],
  lydian: [0, 2, 4, 6, 7, 9, 11],
  mixolydian: [0, 2, 4, 5, 7, 9, 10],
  locrian: [0, 1, 3, 5, 6, 8, 10],
  // Other common scales
  minorPentatonic: [0, 3, 5, 7, 10],
  majorPentatonic: [0, 2, 4, 7, 9],
  blues: [0, 3, 5, 6, 7, 10],
  harmonicMinor: [0, 2, 3, 5, 7, 8, 11],
  melodicMinor: [0, 2, 3, 5, 7, 9, 11],
};

// Chord formulas (semitone patterns from the root)
export const CHORD_FORMULAS = {
  // Triads
  maj: [0, 4, 7],
  min: [0, 3, 7],
  dim: [0, 3, 6],
  aug: [0, 4, 8],
  // Seventh chords
  maj7: [0, 4, 7, 11],
  min7: [0, 3, 7, 10],
  7: [0, 4, 7, 10],
  dim7: [0, 3, 6, 9],
  m7b5: [0, 3, 6, 10], // half-diminished
  // Extensions and alterations
  maj9: [0, 4, 7, 11, 14],
  min9: [0, 3, 7, 10, 14],
  9: [0, 4, 7, 10, 14],
  maj6: [0, 4, 7, 9],
  min6: [0, 3, 7, 9],
  add9: [0, 4, 7, 14],
  sus2: [0, 2, 7],
  sus4: [0, 5, 7],
};

// Named intervals
export const INTERVALS = {
  0: 'Unison',
  1: 'Minor 2nd',
  2: 'Major 2nd',
  3: 'Minor 3rd',
  4: 'Major 3rd',
  5: 'Perfect 4th',
  6: 'Tritone',
  7: 'Perfect 5th',
  8: 'Minor 6th',
  9: 'Major 6th',
  10: 'Minor 7th',
  11: 'Major 7th',
  12: 'Octave',
};

// Interval character descriptions
export const INTERVAL_CHARACTERS = {
  0: 'Perfect consonance, foundation for harmony',
  1: 'Strong dissonance, creates tension and urgency',
  2: 'Mild dissonance, used for stepwise motion and creating movement',
  3: 'Imperfect consonance, dark and somber quality',
  4: 'Imperfect consonance, bright and happy quality',
  5: 'Perfect consonance with a suspended quality, seeking resolution',
  6: 'Strong dissonance, historically the "devil\'s interval"',
  7: 'Perfect consonance, stable and grounding',
  8: 'Imperfect consonance with melancholic quality',
  9: 'Imperfect consonance, warm and bright',
  10: 'Mild dissonance, creates tension that resolves to the tonic',
  11: 'Strong dissonance, creates anticipation for resolution',
  12: 'Perfect consonance, emphasizes stability',
};

// Frequency ratios for just intonation
export const FREQUENCY_RATIOS = {
  0: '1:1',
  1: '16:15',
  2: '9:8',
  3: '6:5',
  4: '5:4',
  5: '4:3',
  6: '45:32',
  7: '3:2',
  8: '8:5',
  9: '5:3',
  10: '9:5',
  11: '15:8',
  12: '2:1',
};

// Chord function names
export const CHORD_FUNCTIONS = {
  major: [
    'Tonic',
    'Supertonic',
    'Mediant',
    'Subdominant',
    'Dominant',
    'Submediant',
    'Leading Tone'
  ],
  minor: [
    'Tonic',
    'Supertonic',
    'Mediant',
    'Subdominant',
    'Dominant',
    'Submediant',
    'Subtonic'
  ]
};

/**
 * Get the index of a note within the octave (0-11)
 * @param {string} note - The note name (e.g. 'C', 'D#', etc.)
 * @returns {number} Index of the note
 */
export const getNoteIndex = (note) => {
  // Remove octave indicator if present
  const noteName = note.replace(/\d/g, '');
  return NOTES.indexOf(noteName);
};

/**
 * Generate a scale from a root note and scale type
 * @param {string} rootNote - The root note of the scale
 * @param {string} scaleType - The type of scale (e.g. 'major', 'minor', etc.)
 * @returns {string[]} Array of note names in the scale
 */
export const generateScale = (rootNote, scaleType = 'major') => {
  const rootIndex = getNoteIndex(rootNote);
  const formula = SCALE_FORMULAS[scaleType];
  
  if (rootIndex === -1 || !formula) {
    return [];
  }
  
  return formula.map(interval => {
    const noteIndex = (rootIndex + interval) % 12;
    return NOTES[noteIndex];
  });
};

/**
 * Generate a chord from a root note and chord type
 * @param {string} rootNote - The root note of the chord
 * @param {string} chordType - The type of chord (e.g. 'maj', 'min', '7', etc.)
 * @returns {string[]} Array of note names in the chord
 */
export const generateChord = (rootNote, chordType = 'maj') => {
  const rootIndex = getNoteIndex(rootNote);
  const formula = CHORD_FORMULAS[chordType];
  
  if (rootIndex === -1 || !formula) {
    return [];
  }
  
  return formula.map(interval => {
    const noteIndex = (rootIndex + interval) % 12;
    return NOTES[noteIndex];
  });
};

/**
 * Calculate the interval between two notes
 * @param {string} note1 - First note
 * @param {string} note2 - Second note
 * @returns {Object} Interval information
 */
export const getInterval = (note1, note2) => {
  const index1 = getNoteIndex(note1);
  const index2 = getNoteIndex(note2);
  
  if (index1 === -1 || index2 === -1) {
    return null;
  }
  
  const semitones = (index2 - index1 + 12) % 12;
  
  return {
    semitones,
    name: INTERVALS[semitones],
    character: INTERVAL_CHARACTERS[semitones],
    ratio: FREQUENCY_RATIOS[semitones]
  };
};

/**
 * Calculate the frequency ratio between two notes
 * @param {string} note1 - First note
 * @param {string} note2 - Second note
 * @returns {number} Frequency ratio
 */
export const getFrequencyRatio = (note1, note2) => {
  const interval = getInterval(note1, note2);
  
  if (!interval) {
    return null;
  }
  
  // Equal temperament ratio calculation
  return Math.pow(2, interval.semitones / 12);
};

/**
 * Get the diatonic chords of a key
 * @param {string} rootNote - The root note of the key
 * @param {string} scaleType - The type of scale/key (e.g. 'major', 'minor')
 * @returns {Object[]} Array of chord information objects
 */
export const getDiatonicChords = (rootNote, scaleType = 'major') => {
  const scale = generateScale(rootNote, scaleType);
  
  if (scale.length === 0) {
    return [];
  }
  
  // Chord types for major and minor keys (in proper sequence)
  const chordTypes = {
    major: ['maj', 'min', 'min', 'maj', 'maj', 'min', 'dim'],
    minor: ['min', 'dim', 'maj', 'min', 'min', 'maj', 'maj']
  };
  
  // Roman numeral representations
  const numerals = {
    major: ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'],
    minor: ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII']
  };
  
  // Get correct sequence of chord types for this key
  const types = chordTypes[scaleType] || chordTypes.major;
  const rn = numerals[scaleType] || numerals.major;
  
  // Build each diatonic chord using the scale notes as roots
  return scale.map((note, i) => {
    return {
      root: note,
      type: types[i],
      chord: generateChord(note, types[i]),
      numeral: rn[i],
      degree: i + 1,
      function: CHORD_FUNCTIONS[scaleType][i]
    };
  });
};

/**
 * Get the chord function based on scale degree
 * @param {number} scaleDegree - The scale degree (0-6)
 * @param {string} scaleType - The type of scale/key
 * @returns {string} The function name
 */
export const getChordFunction = (scaleDegree, scaleType = 'major') => {
  if (scaleDegree < 0 || scaleDegree > 6) {
    return null;
  }
  
  return CHORD_FUNCTIONS[scaleType]?.[scaleDegree] || CHORD_FUNCTIONS.major[scaleDegree];
};

/**
 * Get the relative minor/major of a key
 * @param {string} rootNote - The root note of the key
 * @param {string} scaleType - Either 'major' or 'minor'
 * @returns {Object} The relative key information
 */
export const getRelativeKey = (rootNote, scaleType) => {
  const rootIndex = getNoteIndex(rootNote);
  
  if (rootIndex === -1) {
    return null;
  }
  
  if (scaleType === 'major') {
    // Relative minor is 3 semitones down (or 9 up)
    const relativeMinorIndex = (rootIndex + 9) % 12;
    return {
      root: NOTES[relativeMinorIndex],
      type: 'minor'
    };
  } else if (scaleType === 'minor') {
    // Relative major is 3 semitones up (or 9 down)
    const relativeMajorIndex = (rootIndex + 3) % 12;
    return {
      root: NOTES[relativeMajorIndex],
      type: 'major'
    };
  }
  
  return null;
};

/**
 * Get all modes derived from a scale
 * @param {string} rootNote - The root note of the original scale
 * @param {string} scaleType - The type of original scale
 * @returns {Object[]} Array of mode information objects
 */
export const getModes = (rootNote, scaleType = 'major') => {
  const scale = generateScale(rootNote, scaleType);
  
  if (scale.length === 0) {
    return [];
  }
  
  const modeNames = ['Ionian', 'Dorian', 'Phrygian', 'Lydian', 'Mixolydian', 'Aeolian', 'Locrian'];
  
  return scale.map((note, i) => {
    // Create a rotated version of the scale starting from this note
    const modeScale = [...scale.slice(i), ...scale.slice(0, i)];
    
    return {
      root: note,
      name: modeNames[i],
      scale: modeScale,
      // Calculate the interval pattern for this mode
      pattern: modeScale.map((_, j) => {
        if (j === modeScale.length - 1) return null;
        const interval = (getNoteIndex(modeScale[j + 1]) - getNoteIndex(modeScale[j]) + 12) % 12;
        return interval === 1 ? 'H' : 'W'; // Half or Whole step
      }).filter(i => i !== null)
    };
  });
};

/**
 * Generate notes for a circle of fifths visualization
 * @returns {Object} Circle of fifths data structure
 */
export const generateCircleOfFifths = () => {
  const result = {
    keys: [],
    innerKeys: [] // For relative minors
  };
  
  let currentNote = 'C';
  
  // Generate 12 notes moving in perfect fifths
  for (let i = 0; i < 12; i++) {
    const currentIndex = getNoteIndex(currentNote);
    const relativeKey = getRelativeKey(currentNote, 'major');
    
    result.keys.push({
      note: currentNote,
      keySignature: getKeySignature(currentNote, 'major'),
      relativeMinor: relativeKey.root
    });
    
    // Move up a perfect fifth (7 semitones)
    const nextIndex = (currentIndex + 7) % 12;
    currentNote = NOTES[nextIndex];
  }
  
  // Add relative minors to inner circle
  result.innerKeys = result.keys.map(key => ({
    note: getRelativeKey(key.note, 'major').root,
    keySignature: getKeySignature(key.note, 'major'), // Same signature as relative major
    relativeMajor: key.note
  }));
  
  return result;
};

/**
 * Get key signature (number of sharps/flats)
 * @param {string} rootNote - The root note of the key
 * @param {string} scaleType - The type of scale/key
 * @returns {Object} Key signature information
 */
export const getKeySignature = (rootNote, scaleType) => {
  // Circle of fifths order - C has 0 sharps, G has 1, etc.
  const circleOfFifths = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'G#', 'D#', 'A#', 'F'];
  const position = circleOfFifths.indexOf(rootNote);
  
  if (position === -1) {
    return { sharps: 0, flats: 0 };
  }
  
  if (scaleType === 'major') {
    if (position <= 6) {
      return { sharps: position };
    } else {
      return { flats: 12 - position };
    }
  } else if (scaleType === 'minor') {
    // Get relative major and its key signature
    const relativeMajor = getRelativeKey(rootNote, 'minor').root;
    return getKeySignature(relativeMajor, 'major');
  }
  
  return { sharps: 0, flats: 0 };
};
