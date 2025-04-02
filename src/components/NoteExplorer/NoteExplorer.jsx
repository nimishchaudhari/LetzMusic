import React, { useState, useEffect } from 'react';
import Keyboard from './Keyboard';
import NoteDisplay from './NoteDisplay';
import { MusicTheory, AudioEngine } from '../../modules';

const NoteExplorer = () => {
  const [currentNote, setCurrentNote] = useState(null);

  useEffect(() => {
    AudioEngine.initialize();
  }, []);

  const handleNoteSelect = (noteName) => {
    const note = MusicTheory.getNote(noteName);
    setCurrentNote(note);
    AudioEngine.playNote(note);
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
