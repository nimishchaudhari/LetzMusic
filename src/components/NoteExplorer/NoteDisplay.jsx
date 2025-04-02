import React from 'react';

const NoteDisplay = ({ note }) => {
  if (!note) {
    return <div className="note-display">Select a note to see details</div>;
  }

  return (
    <div className="note-display">
      <h3>{note.name}</h3>
      <p>Frequency: {note.frequency} Hz</p>
      {/* TODO: Add more note details */}
    </div>
  );
};

export default NoteDisplay;
