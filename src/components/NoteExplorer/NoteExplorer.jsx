import React, { useState, useEffect } from 'react';
import Keyboard from './Keyboard';
import NoteDisplay from './NoteDisplay';
import { useAudio } from '../../contexts/AudioContext';
import * as MusicTheory from '../../utils/music-theory';

const NoteExplorer = () => {
  const [currentNote, setCurrentNote] = useState(null);
  const { playNote, initialize } = useAudio();

  useEffect(() => {
    initialize();
  }, [initialize]);

  const handleNoteSelect = (noteName) => {
    // Create a note object with the basic information
    const octave = 4; // Default octave
    const note = {
      name: noteName,
      frequency: 440 * Math.pow(2, (MusicTheory.getNoteIndex(noteName) - 9) / 12) // A4 = 440Hz as reference
    };
    setCurrentNote(note);
    playNote(`${noteName}${octave}`);
  };

  return (
    <div className="note-explorer">
      <h2>Note Explorer</h2>
      <Keyboard onNoteSelect={handleNoteSelect} />
      <NoteDisplay note={currentNote} />
    </div>
  );
};

export default NoteExplorer;