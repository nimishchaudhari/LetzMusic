import React from 'react';
import './Keyboard.css';

const KEY_WIDTH = 50;
const KEY_HEIGHT = 180;
const BLACK_KEY_WIDTH = 30;
const BLACK_KEY_HEIGHT = 110;
const BLACK_KEY_OFFSET = KEY_WIDTH * 0.6;

const Keyboard = ({ onNoteSelect }) => {
  const keys = [
    { note: 'C', isBlack: false },
    { note: 'C#', isBlack: true },
    { note: 'D', isBlack: false },
    { note: 'D#', isBlack: true },
    { note: 'E', isBlack: false },
    { note: 'F', isBlack: false },
    { note: 'F#', isBlack: true },
    { note: 'G', isBlack: false },
    { note: 'G#', isBlack: true },
    { note: 'A', isBlack: false },
    { note: 'A#', isBlack: true },
    { note: 'B', isBlack: false },
  ];

  return (
    <div className="keyboard">
      {keys.map((key, index) => (
        <div 
          key={key.note}
          className={`key ${key.isBlack ? 'black' : 'white'}`}
          style={{
            left: key.isBlack ? index * KEY_WIDTH - BLACK_KEY_OFFSET : index * KEY_WIDTH,
            width: key.isBlack ? BLACK_KEY_WIDTH : KEY_WIDTH,
            height: key.isBlack ? BLACK_KEY_HEIGHT : KEY_HEIGHT,
          }}
          onClick={() => onNoteSelect(key.note)}
        >
          {key.note}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;