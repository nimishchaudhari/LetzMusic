import React, { useState, useEffect, useRef } from 'react';
import { NOTES } from '../../utils/music-theory';
import { useAudio } from '../../contexts/AudioContext';
import './Keyboard.css';

const Keyboard = ({
  startOctave = 3,
  endOctave = 5,
  highlightedNotes = [],
  noteLabels = 'default', // 'default', 'none', 'scale-degrees', 'frequencies'
  onNoteClick,
  interactive = true,
  colorMapping = {}
}) => {
  const keyboardRef = useRef(null);
  const [activeNotes, setActiveNotes] = useState([]);
  const { playNote } = useAudio();
  
  // Generate all notes in range
  const generateAllNotes = () => {
    const notes = [];
    for (let octave = startOctave; octave <= endOctave; octave++) {
      NOTES.forEach(note => {
        notes.push(`${note}${octave}`);
      });
    }
    return notes;
  };
  
  const allNotes = generateAllNotes();
  
  // Handle note click
  const handleNoteClick = (note) => {
    if (!interactive) return;
    
    setActiveNotes(prev => {
      const isActive = prev.includes(note);
      const newActiveNotes = isActive
        ? prev.filter(n => n !== note)
        : [...prev, note];
      
      if (onNoteClick) {
        onNoteClick(note, !isActive, newActiveNotes);
      }
      
      // Play the note
      playNote(note);
      
      return newActiveNotes;
    });
  };
  
  // Determine if a note is a black key
  const isBlackKey = (note) => {
    const noteName = note.replace(/\\d/g, '');
    return noteName.includes('#');
  };
  
  // Get note label based on preference
  const getNoteLabel = (note) => {
    const noteName = note.replace(/\\d/g, '');
    const octave = note.match(/\\d+/)[0];
    
    switch(noteLabels) {
      case 'none':
        return '';
      case 'scale-degrees':
        // This would be populated by the parent component via colorMapping
        return colorMapping[note]?.label || '';
      case 'frequencies':
        const a4 = 440;
        const n = NOTES.indexOf(noteName) + (octave - 4) * 12;
        const freq = a4 * Math.pow(2, n/12);
        return `${Math.round(freq)} Hz`;
      case 'default':
      default:
        return noteName;
    }
  };
  
  // Get the color for a note
  const getNoteColor = (note) => {
    if (colorMapping[note]) {
      return colorMapping[note].color;
    }
    
    if (highlightedNotes.includes(note)) {
      return '#4CAF50'; // Green for highlighted notes
    }
    
    if (activeNotes.includes(note)) {
      return '#2196F3'; // Blue for active notes
    }
    
    return isBlackKey(note) ? '#333' : 'white';
  };
  
  // Keyboard component rendering
  return (
    <div className="keyboard-container">
      <div 
        className="keyboard" 
        ref={keyboardRef}
      >
        {/* White keys rendered first (for proper z-index) */}
        {allNotes.map(note => {
          const isBlack = isBlackKey(note);
          if (isBlack) return null;
          
          return (
            <div
              key={`white-${note}`}
              className={`piano-key white-key ${activeNotes.includes(note) ? 'active' : ''} ${highlightedNotes.includes(note) ? 'highlighted' : ''}`}
              style={{
                backgroundColor: getNoteColor(note)
              }}
              onClick={() => handleNoteClick(note)}
              data-note={note}
              data-testid={`key-${note}`}
              role="button"
              aria-pressed={activeNotes.includes(note)}
              aria-label={`${note} key`}
            >
              <span className="key-label">
                {getNoteLabel(note)}
              </span>
            </div>
          );
        })}
        
        {/* Black keys rendered on top */}
        {allNotes.map((note, index) => {
          const isBlack = isBlackKey(note);
          if (!isBlack) return null;
          
          // Find the previous white key index for positioning
          const prevWhiteKeyIndex = allNotes.findIndex((n, i) => i < index && !isBlackKey(n));
          
          return (
            <div
              key={`black-${note}`}
              className={`piano-key black-key ${activeNotes.includes(note) ? 'active' : ''} ${highlightedNotes.includes(note) ? 'highlighted' : ''}`}
              style={{
                backgroundColor: getNoteColor(note),
                left: `calc(${prevWhiteKeyIndex} * var(--white-key-width) - var(--black-key-width) / 2)`,
              }}
              onClick={() => handleNoteClick(note)}
              data-note={note}
              data-testid={`key-${note}`}
              role="button"
              aria-pressed={activeNotes.includes(note)}
              aria-label={`${note} key`}
            >
              <span className="key-label">
                {getNoteLabel(note)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Keyboard;
