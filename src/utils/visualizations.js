import { NOTES } from './music-theory';

/**
 * Utility functions for music visualizations
 */

/**
 * Generate positions for piano keys on a keyboard
 * @param {number} startOctave - Starting octave
 * @param {number} endOctave - Ending octave
 * @returns {Object} Key dimensions and positions
 */
export const generateKeyboardLayout = (startOctave = 3, endOctave = 5) => {
  const whiteKeyWidth = 40;
  const blackKeyWidth = 24;
  const whiteKeyHeight = 150;
  const blackKeyHeight = 90;
  
  const layout = {
    whiteKeys: [],
    blackKeys: [],
    dimensions: {
      whiteKeyWidth,
      blackKeyWidth,
      whiteKeyHeight,
      blackKeyHeight,
      totalWidth: 0
    }
  };
  
  let whiteKeyCounter = 0;
  
  // Generate positions for all keys
  for (let octave = startOctave; octave <= endOctave; octave++) {
    NOTES.forEach((note, i) => {
      const isBlackKey = note.includes('#');
      const fullNote = `${note}${octave}`;
      
      if (isBlackKey) {
        // Black keys positioned relative to white keys
        layout.blackKeys.push({
          note: fullNote,
          x: whiteKeyCounter * whiteKeyWidth - blackKeyWidth / 2,
          width: blackKeyWidth,
          height: blackKeyHeight
        });
      } else {
        // White keys in sequence
        layout.whiteKeys.push({
          note: fullNote,
          x: whiteKeyCounter * whiteKeyWidth,
          width: whiteKeyWidth,
          height: whiteKeyHeight
        });
        whiteKeyCounter++;
      }
    });
  }
  
  // Calculate total width
  layout.dimensions.totalWidth = whiteKeyCounter * whiteKeyWidth;
  
  return layout;
};

/**
 * Generate fretboard layout for guitar or bass visualization
 * @param {number} numStrings - Number of strings (6 for guitar, 4 for bass)
 * @param {number} numFrets - Number of frets to display
 * @param {string[]} openNotes - Open string notes (e.g., ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'])
 * @returns {Object} Fretboard layout information
 */
export const generateFretboardLayout = (
  numStrings = 6,
  numFrets = 12,
  openNotes = ['E2', 'A2', 'D3', 'G3', 'B3', 'E4']
) => {
  // Default to guitar if insufficient open notes provided
  if (openNotes.length < numStrings) {
    openNotes = ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'].slice(0, numStrings);
  }
  
  const stringSpacing = 30; // Vertical space between strings
  const fretSpacing = [40, 38, 36, 34, 32, 30, 28, 26, 24, 22, 20, 18]; // Decreasing spacing to simulate perspective
  
  // Fill in remaining frets with constant spacing if needed
  while (fretSpacing.length < numFrets) {
    fretSpacing.push(fretSpacing[fretSpacing.length - 1]);
  }
  
  const fretboard = {
    strings: [],
    frets: [],
    notes: [],
    dimensions: {
      width: 0,
      height: (numStrings - 1) * stringSpacing
    }
  };
  
  // Calculate positions and generate strings
  for (let s = 0; s < numStrings; s++) {
    const y = s * stringSpacing;
    fretboard.strings.push({
      index: s,
      y,
      openNote: openNotes[s]
    });
  }
  
  // Calculate fret positions and total width
  let x = 0;
  fretboard.frets.push({ position: 0, x });
  
  for (let f = 0; f < numFrets; f++) {
    x += fretSpacing[f];
    fretboard.frets.push({
      position: f + 1,
      x
    });
  }
  
  fretboard.dimensions.width = x;
  
  // Generate all notes on the fretboard
  for (let s = 0; s < numStrings; s++) {
    const openNote = openNotes[s];
    const openNoteOnly = openNote.replace(/\d/g, '');
    const octave = parseInt(openNote.match(/\d+/)[0]);
    const openNoteIndex = NOTES.indexOf(openNoteOnly);
    
    if (openNoteIndex === -1) continue;
    
    for (let f = 0; f <= numFrets; f++) {
      const noteIndex = (openNoteIndex + f) % 12;
      const newOctave = octave + Math.floor((openNoteIndex + f) / 12);
      const note = `${NOTES[noteIndex]}${newOctave}`;
      
      fretboard.notes.push({
        string: s,
        fret: f,
        note,
        x: f === 0 ? 0 : (fretboard.frets[f].x + fretboard.frets[f-1].x) / 2,
        y: s * stringSpacing
      });
    }
  }
  
  return fretboard;
};

/**
 * Generate circle of fifths visualization data
 * @param {number} radius - Outer circle radius
 * @param {number} innerRadius - Inner circle radius
 * @returns {Object} Circle of fifths layout data
 */
export const generateCircleOfFifthsLayout = (radius = 200, innerRadius = 140) => {
  const layout = {
    outer: [],
    inner: [],
    dimensions: {
      radius,
      innerRadius,
      width: radius * 2,
      height: radius * 2
    }
  };
  
  const notes = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'G#', 'D#', 'A#', 'F'];
  const relativeMajor = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'G#', 'D#', 'A#', 'F'];
  const relativeMinor = ['A', 'E', 'B', 'F#', 'C#', 'G#', 'D#', 'A#', 'F', 'C', 'G', 'D'];
  
  // Generate positions on the circles
  for (let i = 0; i < 12; i++) {
    const angle = (i * Math.PI / 6) - (Math.PI / 2); // Start from top (C)
    
    // Outer circle (majors)
    layout.outer.push({
      note: notes[i],
      key: `${notes[i]} major`,
      x: radius + radius * Math.cos(angle),
      y: radius + radius * Math.sin(angle),
      angle
    });
    
    // Inner circle (minors)
    layout.inner.push({
      note: relativeMinor[i],
      key: `${relativeMinor[i]} minor`,
      relativeMajor: relativeMajor[i],
      x: radius + innerRadius * Math.cos(angle),
      y: radius + innerRadius * Math.sin(angle),
      angle
    });
  }
  
  return layout;
};

/**
 * Generate staff notation layout
 * @param {number} width - Staff width
 * @param {number} lineSpacing - Space between staff lines
 * @returns {Object} Staff layout information
 */
export const generateStaffLayout = (width = 500, lineSpacing = 10) => {
  const lines = 5; // Standard music staff has 5 lines
  const layout = {
    lines: [],
    height: lineSpacing * (lines - 1),
    width,
    lineSpacing
  };
  
  // Generate staff lines
  for (let i = 0; i < lines; i++) {
    layout.lines.push({
      y: i * lineSpacing,
      x1: 0,
      x2: width
    });
  }
  
  return layout;
};

/**
 * Generate color mapping for notes based on scale or function
 * @param {string[]} notes - Array of notes to colorize
 * @param {boolean} isHighlighted - Whether these notes should be highlighted
 * @param {string} colorScheme - Color scheme to use
 * @returns {Object} Mapping of notes to colors
 */
export const generateColorMapping = (notes, isHighlighted = true, colorScheme = 'default') => {
  const colorMap = {};
  
  // Define color schemes
  const schemes = {
    default: {
      highlighted: '#4CAF50', // Green
      normal: '#2196F3', // Blue
      selected: '#FF5722' // Orange accent
    },
    rainbow: {
      colors: ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'],
      highlighted: '#FF5722',
      normal: '#CCCCCC'
    },
    blues: {
      colors: ['#E3F2FD', '#BBDEFB', '#90CAF9', '#64B5F6', '#42A5F5', '#2196F3', '#1E88E5', '#1976D2', '#1565C0', '#0D47A1'],
      highlighted: '#FF5722',
      normal: '#CCCCCC'
    }
  };
  
  const scheme = schemes[colorScheme] || schemes.default;
  
  if (scheme.colors && isHighlighted) {
    // If we have a color array, assign colors in sequence
    notes.forEach((note, i) => {
      const color = scheme.colors[i % scheme.colors.length];
      colorMap[note] = {
        color,
        label: `${i + 1}` // Default to showing scale degree
      };
    });
  } else {
    // Simple binary coloring
    notes.forEach((note, i) => {
      colorMap[note] = {
        color: isHighlighted ? scheme.highlighted : scheme.normal,
        label: `${i + 1}`
      };
    });
  }
  
  return colorMap;
};

/**
 * Calculate the proper positioning for chord diagram dots
 * @param {string} chordType - Type of chord (e.g., 'major', 'minor', '7')
 * @param {number} frets - Number of frets to show
 * @param {number} numStrings - Number of strings
 * @returns {Object} Chord diagram positioning data
 */
export const generateChordDiagram = (chordType = 'major', frets = 5, numStrings = 6) => {
  // This would contain actual chord diagrams; simplified example for now
  const chordPatterns = {
    // Standard guitar chords in 1st position
    'C': { positions: [{ string: 3, fret: 3 }, { string: 2, fret: 2 }, { string: 1, fret: 0 }], openStrings: [4, 5], basePosition: 0 },
    'A': { positions: [{ string: 3, fret: 2 }, { string: 2, fret: 2 }, { string: 1, fret: 2 }], openStrings: [4, 5], basePosition: 0 },
    'G': { positions: [{ string: 6, fret: 3 }, { string: 5, fret: 2 }, { string: 1, fret: 3 }], openStrings: [4, 3, 2], basePosition: 0 },
    'E': { positions: [{ string: 6, fret: 0 }, { string: 5, fret: 2 }, { string: 4, fret: 2 }, { string: 3, fret: 1 }, { string: 2, fret: 0 }, { string: 1, fret: 0 }], openStrings: [], basePosition: 0 },
    'D': { positions: [{ string: 4, fret: 0 }, { string: 3, fret: 2 }, { string: 2, fret: 3 }, { string: 1, fret: 2 }], openStrings: [], basePosition: 0 },
    'F': { positions: [{ string: 6, fret: 1 }, { string: 5, fret: 3 }, { string: 4, fret: 3 }, { string: 3, fret: 2 }, { string: 2, fret: 1 }, { string: 1, fret: 1 }], openStrings: [], basePosition: 0 },
  };
  
  // Return a placeholder or basic layout if chord not found
  return chordPatterns[chordType] || {
    positions: [],
    openStrings: [],
    basePosition: 0
  };
};

/**
 * Create a formatter for scale degrees with proper notation
 * @returns {Function} Formatter function
 */
export const createScaleDegreeFormatter = () => {
  const superscripts = {
    'b': '♭',
    '#': '♯'
  };
  
  return (degree) => {
    if (typeof degree !== 'string') {
      return `${degree}`;
    }
    
    // Replace b and # with proper symbols
    return degree.replace(/([b#])/g, (match) => superscripts[match] || match);
  };
};
