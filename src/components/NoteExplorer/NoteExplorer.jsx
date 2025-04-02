import React, { useState } from 'react';
import Keyboard from './Keyboard';
import NoteDisplay from './NoteDisplay';

const NoteExplorer = () => {
  const [currentNote, setCurrentNote] = useState(null);

  const handleNoteSelect = (note) => {
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
