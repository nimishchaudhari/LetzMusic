import React, { useState, useEffect } from 'react';
import { useAudio } from '../../contexts/AudioContext';
import { NOTES, getInterval } from '../../utils/music-theory';
import './IntervalDemonstrator.css';

const IntervalDemonstrator = () => {
  const [firstNote, setFirstNote] = useState(null);
  const [secondNote, setSecondNote] = useState(null);
  const [intervalDetails, setIntervalDetails] = useState(null);
  const { playNote, playInterval } = useAudio();

  useEffect(() => {
    if (firstNote && secondNote) {
      // Calculate the interval between the two notes
      const details = getInterval(firstNote.replace(/\d/g, ''), secondNote.replace(/\d/g, ''));
      setIntervalDetails(details);
    } else {
      setIntervalDetails(null);
    }
  }, [firstNote, secondNote]);

  const handleNoteSelect = (note) => {
    if (!firstNote) {
      setFirstNote(note);
      playNote(note);
    } else if (firstNote && !secondNote) {
      setSecondNote(note);
      playNote(note);
      
      // Play the interval after a short delay to allow the second note to be heard
      setTimeout(() => {
        playInterval(firstNote, note);
      }, 700);
    } else {
      // Clear and start over
      setFirstNote(note);
      setSecondNote(null);
      playNote(note);
    }
  };

  const renderKeyboard = () => {
    // Generate all notes in range C3-C5
    const generateAllNotes = () => {
      const notes = [];
      for (let octave = 3; octave <= 5; octave++) {
        NOTES.forEach(note => {
          notes.push(`${note}${octave}`);
        });
      }
      return notes;
    };

    const allNotes = generateAllNotes();
    
    return (
      <div className="keyboard">
        {allNotes.map(note => {
          const noteName = note.replace(/\d/g, '');
          const isBlackKey = noteName.includes('#');
          const isSelected = note === firstNote || note === secondNote;
          
          return (
            <div
              key={note}
              className={`piano-key ${isBlackKey ? 'black-key' : 'white-key'} ${isSelected ? 'selected' : ''}`}
              onClick={() => handleNoteSelect(note)}
            >
              <span>{noteName}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="interval-demonstrator">
      <h2>Interval Relationship Demonstrator</h2>
      <p>
        Intervals create relationships between notes and are the building blocks of melody and harmony.
        Select two notes on the keyboard to hear and analyze their interval relationship.
      </p>
      
      <div className="selection-display">
        <div className="selected-notes">
          <div className="note-display">
            <strong>First Note:</strong> {firstNote || 'Select a note'}
          </div>
          <div className="note-display">
            <strong>Second Note:</strong> {secondNote || 'Select a note'}
          </div>
        </div>
        
        {intervalDetails && (
          <div className="interval-info">
            <h3>Interval: {intervalDetails.name}</h3>
            <p>Semitones: {intervalDetails.semitones}</p>
            <p>Frequency Ratio: {intervalDetails.ratio}</p>
            <p>Character: {intervalDetails.character}</p>
          </div>
        )}
      </div>
      
      <div className="keyboard-container">
        {renderKeyboard()}
      </div>
      
      <div className="controls">
        <button 
          onClick={() => {
            if (firstNote && secondNote) {
              playInterval(firstNote, secondNote);
            }
          }}
          disabled={!firstNote || !secondNote}
        >
          Play Interval
        </button>
        <button
          onClick={() => {
            setFirstNote(null);
            setSecondNote(null);
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default IntervalDemonstrator;
