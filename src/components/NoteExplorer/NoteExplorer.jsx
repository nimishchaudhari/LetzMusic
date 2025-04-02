import React, { useState } from 'react';
import Keyboard from './Keyboard';  
import NoteDisplay from './NoteDisplay';
import { MusicTheory } from '../../modules';

const NoteExplorer = () => {
  const [currentNote, setCurrentNote] = useState(null);

  const handleNoteSelect = (noteName) => {
    const note = MusicTheory.getNote(noteName);
    setCurrentNote(note);
    // TODO: Trigger note playback
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
