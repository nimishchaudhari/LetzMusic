import React, { useState, useEffect } from 'react';
import { 
  NOTES, 
  SCALE_FORMULAS, 
  generateScale,
  getNoteIndex
} from '../../utils/music-theory';
import { useAudio } from '../../contexts/AudioContext';
import './ScaleLab.css';

const ScaleLab = () => {
  const [rootNote, setRootNote] = useState('C');
  const [scaleType, setScaleType] = useState('major');
  const [currentScale, setCurrentScale] = useState([]);
  const [colorMapping, setColorMapping] = useState({});
  const [steps, setSteps] = useState([]);
  const { playNote, playSequence } = useAudio();

  // Update the scale whenever root note or scale type changes
  useEffect(() => {
    const scale = generateScale(rootNote, scaleType);
    
    // Add octave numbers for audio playback (using octave 4)
    const scaleWithOctaves = scale.map(note => `${note}4`);
    
    setCurrentScale(scaleWithOctaves);
    
    // Generate color mapping for the keyboard
    const newColorMapping = {};
    scaleWithOctaves.forEach((note, index) => {
      newColorMapping[note] = {
        color: getScaleDegreeBgColor(index),
        label: `${index + 1}`
      };
    });
    setColorMapping(newColorMapping);
    
    // Calculate the step pattern (whole and half steps)
    calculateStepPattern(scale);
  }, [rootNote, scaleType]);

  // Calculate the whole-step and half-step pattern of the scale
  const calculateStepPattern = (scale) => {
    const pattern = [];
    
    for (let i = 0; i < scale.length - 1; i++) {
      const currentIndex = getNoteIndex(scale[i]);
      const nextIndex = getNoteIndex(scale[i + 1]);
      
      // Calculate semitones between notes (considering wrap-around)
      const semitones = (nextIndex - currentIndex + 12) % 12;
      
      if (semitones === 1) {
        pattern.push({ from: scale[i], to: scale[i + 1], type: 'half', semitones });
      } else if (semitones === 2) {
        pattern.push({ from: scale[i], to: scale[i + 1], type: 'whole', semitones });
      } else {
        pattern.push({ from: scale[i], to: scale[i + 1], type: 'other', semitones });
      }
    }
    
    // Add the last step (from last note to octave of first note)
    const lastIndex = getNoteIndex(scale[scale.length - 1]);
    const firstIndex = getNoteIndex(scale[0]);
    const lastSemitones = (firstIndex - lastIndex + 12) % 12;
    
    pattern.push({
      from: scale[scale.length - 1],
      to: scale[0],
      type: lastSemitones === 1 ? 'half' : lastSemitones === 2 ? 'whole' : 'other',
      semitones: lastSemitones
    });
    
    setSteps(pattern);
  };

  // Get color based on scale degree
  const getScaleDegreeBgColor = (degree) => {
    const colors = [
      '#FF5722', // 1 - Tonic (orange)
      '#4CAF50', // 2 - Supertonic (green)
      '#2196F3', // 3 - Mediant (blue)
      '#FFC107', // 4 - Subdominant (amber)
      '#9C27B0', // 5 - Dominant (purple)
      '#00BCD4', // 6 - Submediant (cyan)
      '#F44336', // 7 - Leading tone/subtonic (red)
    ];
    return colors[degree % colors.length];
  };

  const handlePlayScale = () => {
    // Play the scale up and down
    const scaleUp = [...currentScale];
    const scaleDown = [...currentScale].reverse().slice(1);
    playSequence([...scaleUp, ...scaleDown], 120);
  };

  const handleNoteClick = (note) => {
    playNote(note);
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
          const isInScale = currentScale.includes(note);
          const colorInfo = colorMapping[note];
          
          return (
            <div
              key={note}
              className={`piano-key ${isBlackKey ? 'black-key' : 'white-key'} ${isInScale ? 'in-scale' : ''}`}
              style={isInScale ? { backgroundColor: colorInfo?.color } : {}}
              onClick={() => handleNoteClick(note)}
            >
              <span>{isInScale ? colorInfo?.label : ''}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="scale-lab">
      <h2>Scale Construction Laboratory</h2>
      <p>
        Explore how different scales are constructed using specific patterns of intervals.
        Select a root note and scale type to see the pattern visualized on the keyboard.
      </p>
      
      <div className="controls">
        <div className="control-group">
          <label htmlFor="root-note">Root Note:</label>
          <select 
            id="root-note" 
            value={rootNote} 
            onChange={(e) => setRootNote(e.target.value)}
          >
            {NOTES.map(note => (
              <option key={note} value={note}>{note}</option>
            ))}
          </select>
        </div>
        
        <div className="control-group">
          <label htmlFor="scale-type">Scale Type:</label>
          <select 
            id="scale-type" 
            value={scaleType} 
            onChange={(e) => setScaleType(e.target.value)}
          >
            {Object.keys(SCALE_FORMULAS).map(type => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>
        
        <button 
          className="play-button" 
          onClick={handlePlayScale}
        >
          Play Scale
        </button>
      </div>
      
      <div className="scale-display">
        <h3>Scale Notes:</h3>
        <div className="scale-notes">
          {currentScale.map((note, index) => (
            <div 
              key={index}
              className="scale-note"
              style={{ backgroundColor: getScaleDegreeBgColor(index) }}
              onClick={() => handleNoteClick(note)}
            >
              {note.replace(/\d/g, '')}
              <span className="degree">{index + 1}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="step-pattern">
        <h3>Step Pattern:</h3>
        <div className="steps">
          {steps.map((step, index) => (
            <div key={index} className={`step ${step.type}`}>
              <div className="notes">
                <span>{step.from}</span>
                <span>to</span>
                <span>{step.to}</span>
              </div>
              <div className="description">
                {step.type === 'half' ? 'Half Step (1 semitone)' : 
                 step.type === 'whole' ? 'Whole Step (2 semitones)' : 
                 `${step.semitones} semitones`}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="keyboard-container">
        <h3>Interactive Keyboard:</h3>
        {renderKeyboard()}
      </div>
      
      <div className="scale-theory">
        <h3>About {rootNote} {scaleType.charAt(0).toUpperCase() + scaleType.slice(1)} Scale:</h3>
        <p>
          The {rootNote} {scaleType} scale consists of {currentScale.length} notes. 
          {scaleType === 'major' && " The major scale is one of the most common scales in Western music, with a bright and happy sound."}
          {scaleType === 'minor' && " The natural minor scale has a darker, more melancholic sound compared to the major scale."}
          {scaleType === 'dorian' && " The Dorian mode is a minor mode with a raised 6th degree, giving it a jazzy and slightly less somber sound than the natural minor."}
          {scaleType === 'phrygian' && " The Phrygian mode has a distinctive Spanish or Eastern flavor, with its flattened 2nd degree."}
          {scaleType === 'lydian' && " The Lydian mode has a dreamy, floating quality due to its raised 4th degree."}
          {scaleType === 'mixolydian' && " The Mixolydian mode has a bluesy, dominant 7th chord sound due to its flattened 7th degree."}
          {scaleType === 'locrian' && " The Locrian mode is the most dissonant of the modes, with both a flattened 2nd and 5th degree."}
        </p>
        <p>
          The formula for this scale is:
          {SCALE_FORMULAS[scaleType].map((interval, index) => (
            <span key={index}> 
              {index > 0 ? ' - ' : ''}
              {interval}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
};

export default ScaleLab;