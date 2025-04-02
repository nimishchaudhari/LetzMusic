import React from 'react';

const Keyboard = () => {
  const keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  return (
    <div className="keyboard">
      {keys.map((key) => (
        <div key={key} className="key">
          {key}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
