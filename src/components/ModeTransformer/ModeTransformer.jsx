import React, { useState, useEffect } from 'react';
import { generateScale, getModes } from '../../utils/music-theory';
import audioEngine from '../../utils/audio-engine';
import './ModeTransformer.css';

/**
 * ModeTransformer - Shows how modes are transformations of scales from different starting positions
 * 
 * Features:
 * - Interactive controls for generating modes from a scale
 * - Visualizes the interval structure of each mode
 * - Audio playback for experiencing the unique sound of each mode
 * - Educational content explaining modal theory and practical applications
 */
const ModeTransformer = () => {
  const [rootNote, setRootNote] = useState('C');
  const [modes, setModes] = useState([]);
  const [selectedMode, setSelectedMode] = useState(0); // Index of the selected mode
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackMode, setPlaybackMode] = useState('ascending'); // 'ascending', 'descending', 'both'
  
  // Key options
  const keyOptions = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  
  // Mode descriptions
  const modeDescriptions = {
    'Ionian': {
      character: 'Bright, happy, stable',
      use: 'Pop, rock, folk, children's songs',
      example: 'Happy Birthday, Twinkle Twinkle Little Star',
      intervals: 'W-W-H-W-W-W-H'
    },
    'Dorian': {
      character: 'Minor with a bright sixth, jazzy, slightly melancholic',
      use: 'Jazz, folk, rock, blues',
      example: 'Scarborough Fair, So What (Miles Davis)',
      intervals: 'W-H-W-W-W-H-W'
    },
    'Phrygian': {
      character: 'Exotic, tense, Spanish or Middle Eastern flavor',
      use: 'Flamenco, metal, film music for tension',
      example: 'Flamenco music, some heavy metal riffs',
      intervals: 'H-W-W-W-H-W-W'
    },
    'Lydian': {
      character: 'Dreamy, floating, otherworldly',
      use: 'Film scores, progressive rock, dream sequences',
      example: 'The Simpsons theme, Flying (The Beatles)',
      intervals: 'W-W-W-H-W-W-H'
    },
    'Mixolydian': {
      character: 'Bluesy, less resolute than major, rock and roll feel',
      use: 'Blues, rock, folk, Celtic music',
      example: 'Norwegian Wood (The Beatles), Sweet Home Alabama',
      intervals: 'W-W-H-W-W-H-W'
    },
    'Aeolian': {
      character: 'Sad, melancholic, natural minor scale',
      use: 'Pop ballads, rock, classical, emotional pieces',
      example: 'All Along the Watchtower, Stairway to Heaven intro',
      intervals: 'W-H-W-W-H-W-W'
    },
    'Locrian': {
      character: 'Unstable, tense, dissonant',
      use: 'Jazz, contemporary classical, tension sections',
      example: 'Rare in popular music, used more in jazz and theoretical contexts',
      intervals: 'H-W-W-H-W-W-W'
    }
  };
  
  // Initialize audio engine
  useEffect(() => {
    audioEngine.initialize();
    return () => {
      if (isPlaying) {
        audioEngine.stopAll();
      }
    };
  }, [isPlaying]);
  
  // Generate modes when root note changes
  useEffect(() => {
    const generatedModes = getModes(rootNote, 'major');
    setModes(generatedModes);
  }, [rootNote]);
  
  // Handle root note change
  const handleRootChange = (e) => {
    setRootNote(e.target.value);
  };
  
  // Handle mode selection
  const handleModeSelect = (index) => {
    setSelectedMode(index);
  };
  
  // Play mode scale
  const playModeScale = () => {
    if (isPlaying) {
      audioEngine.stopAll();
      setIsPlaying(false);
      return;
    }
    
    if (modes.length === 0 || selectedMode >= modes.length) return;
    
    setIsPlaying(true);
    
    const selectedModeObj = modes[selectedMode];
    const notes = selectedModeObj.scale.map(note => `${note}4`);
    
    // Add the octave note to complete the scale
    const completeScale = [...notes, `${notes[0].replace('4', '5')}`];
    
    if (playbackMode === 'ascending' || playbackMode === 'both') {
      audioEngine.playScale(completeScale, 120, () => {
        if (playbackMode !== 'both') {
          setIsPlaying(false);
        }
      });
    }
    
    if (playbackMode === 'descending' || playbackMode === 'both') {
      const delay = playbackMode === 'both' ? completeScale.length * 500 : 0;
      
      setTimeout(() => {
        const descendingScale = [...completeScale].reverse();
        audioEngine.playScale(descendingScale, 120, () => {
          setIsPlaying(false);
        });
      }, delay);
    }
  };
  
  // Handle playback mode change
  const handlePlaybackModeChange = (e) => {
    setPlaybackMode(e.target.value);
  };
  
  // Render interval pattern visualization
  const renderIntervalPattern = (pattern) => {
    if (!pattern || pattern.length === 0) return null;
    
    return (
      <div className="interval-pattern">
        {pattern.map((interval, index) => (
          <span 
            key={index} 
            className={`interval ${interval === 'W' ? 'whole' : 'half'}`}
          >
            {interval}
            {index < pattern.length - 1 && <span className="interval-dash">-</span>}
          </span>
        ))}
      </div>
    );
  };
  
  // Get selected mode object
  const getSelectedMode = () => {
    if (modes.length === 0 || selectedMode >= modes.length) return null;
    return modes[selectedMode];
  };
  
  // Get mode description
  const getModeDescription = (modeName) => {
    return modeDescriptions[modeName] || {
      character: 'Unknown',
      use: 'Unknown',
      example: 'Unknown',
      intervals: 'Unknown'
    };
  };
  
  // Render a color-coded keyboard to visualize the mode
  const renderModeKeyboard = () => {
    if (modes.length === 0 || selectedMode >= modes.length) return null;
    
    const selectedModeObj = modes[selectedMode];
    const scale = selectedModeObj.scale;
    
    // Represent a simple keyboard
    const keyboard = [
      { note: 'C', type: 'white' },
      { note: 'C#', type: 'black' },
      { note: 'D', type: 'white' },
      { note: 'D#', type: 'black' },
      { note: 'E', type: 'white' },
      { note: 'F', type: 'white' },
      { note: 'F#', type: 'black' },
      { note: 'G', type: 'white' },
      { note: 'G#', type: 'black' },
      { note: 'A', type: 'white' },
      { note: 'A#', type: 'black' },
      { note: 'B', type: 'white' }
    ];
    
    return (
      <div className="mode-keyboard">
        {keyboard.map((key, index) => {
          const isInScale = scale.includes(key.note);
          const scaleDegree = isInScale ? scale.indexOf(key.note) + 1 : null;
          
          return (
            <div 
              key={index}
              className={`key ${key.type} ${isInScale ? 'in-scale' : ''} ${scaleDegree === 1 ? 'root' : ''}`}
            >
              <span className="key-name">{key.note}</span>
              {isInScale && <span className="key-degree">{scaleDegree}</span>}
            </div>
          );
        })}
      </div>
    );
  };
  
  return (
    <div className="mode-transformer-container">
      <h2>Mode Transformer</h2>
      
      <div className="controls">
        <div className="control-group">
          <label htmlFor="root-select">Root Note:</label>
          <select id="root-select" value={rootNote} onChange={handleRootChange}>
            {keyOptions.map(key => (
              <option key={key} value={key}>{key}</option>
            ))}
          </select>
        </div>
        
        <div className="control-group">
          <label htmlFor="playback-mode">Playback:</label>
          <select id="playback-mode" value={playbackMode} onChange={handlePlaybackModeChange}>
            <option value="ascending">Ascending</option>
            <option value="descending">Descending</option>
            <option value="both">Both</option>
          </select>
        </div>
        
        <button
          className="play-button"
          onClick={playModeScale}
          disabled={modes.length === 0}
        >
          {isPlaying ? 'Stop' : 'Play Mode'}
        </button>
      </div>
      
      <div className="modes-tabs">
        {modes.map((mode, index) => (
          <div
            key={index}
            className={`mode-tab ${selectedMode === index ? 'active' : ''}`}
            onClick={() => handleModeSelect(index)}
          >
            {mode.name}
          </div>
        ))}
      </div>
      
      <div className="mode-display">
        {getSelectedMode() && (
          <>
            <div className="mode-header">
              <h3>{getSelectedMode().root} {getSelectedMode().name}</h3>
              <div className="mode-scale">
                {getSelectedMode().scale.map((note, index) => (
                  <span key={index} className="scale-note">
                    {note}
                    {index === 0 && <sup>1</sup>}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="mode-details">
              <div className="intervals-section">
                <h4>Interval Pattern</h4>
                {renderIntervalPattern(getSelectedMode().pattern)}
                <p className="interval-formula">Formula: {getModeDescription(getSelectedMode().name).intervals}</p>
              </div>
              
              <div className="keyboard-section">
                <h4>Scale Visualization</h4>
                {renderModeKeyboard()}
              </div>
            </div>
            
            <div className="mode-info">
              <div className="info-section">
                <h4>Character</h4>
                <p>{getModeDescription(getSelectedMode().name).character}</p>
              </div>
              
              <div className="info-section">
                <h4>Common Uses</h4>
                <p>{getModeDescription(getSelectedMode().name).use}</p>
              </div>
              
              <div className="info-section">
                <h4>Examples</h4>
                <p>{getModeDescription(getSelectedMode().name).example}</p>
              </div>
            </div>
          </>
        )}
      </div>
      
      <div className="mode-transformation">
        <h3>Understanding Modal Transformation</h3>
        <p>
          Modes are derived from the same set of notes but start from different positions.
          Each mode has a unique sound and character due to the different interval patterns created
          when starting from a different note.
        </p>
        <p>
          For example, all the modes shown above use the same set of notes as the {rootNote} major scale,
          but each one starts on a different note of that scale, creating a completely different sound.
        </p>
        <div className="transformation-diagram">
          <div className="parent-scale">
            <h4>{rootNote} Ionian (Major Scale)</h4>
            <div className="scale-notes">
              {modes.length > 0 && modes[0].scale.map((note, index) => (
                <span key={index} className="diagram-note">{note}</span>
              ))}
            </div>
          </div>
          <div className="transformation-arrows">
            ↓ ↓ ↓ ↓ ↓ ↓ ↓
          </div>
          <div className="derived-modes">
            <div className="derived-mode">
              <h5>{rootNote} Ionian</h5>
              <div className="mode-rotation">
                Start from {rootNote}
              </div>
            </div>
            <div className="derived-mode">
              <h5>{modes.length > 1 ? modes[1].root : ''} Dorian</h5>
              <div className="mode-rotation">
                Start from the 2nd note
              </div>
            </div>
            <div className="derived-mode">
              <h5>{modes.length > 2 ? modes[2].root : ''} Phrygian</h5>
              <div className="mode-rotation">
                Start from the 3rd note
              </div>
            </div>
            <div className="derived-mode">
              <h5>{modes.length > 3 ? modes[3].root : ''} Lydian</h5>
              <div className="mode-rotation">
                Start from the 4th note
              </div>
            </div>
            <div className="derived-mode">
              <h5>{modes.length > 4 ? modes[4].root : ''} Mixolydian</h5>
              <div className="mode-rotation">
                Start from the 5th note
              </div>
            </div>
            <div className="derived-mode">
              <h5>{modes.length > 5 ? modes[5].root : ''} Aeolian</h5>
              <div className="mode-rotation">
                Start from the 6th note
              </div>
            </div>
            <div className="derived-mode">
              <h5>{modes.length > 6 ? modes[6].root : ''} Locrian</h5>
              <div className="mode-rotation">
                Start from the 7th note
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="practical-applications">
        <h3>Practical Applications</h3>
        <div className="application">
          <h4>Composition</h4>
          <p>
            Modes provide different emotional colors for your music. Switch between modes to create contrast
            or establish a particular mood. For example, Dorian mode creates a jazzy, slightly melancholic feel
            that's neither too dark nor too bright.
          </p>
        </div>
        <div className="application">
          <h4>Improvisation</h4>
          <p>
            Modes give improvisers a framework for creating melodies with specific characters.
            When soloing over chord progressions, understanding which mode fits each chord helps
            create melodic lines that complement the harmony.
          </p>
        </div>
        <div className="application">
          <h4>Analysis</h4>
          <p>
            Modal analysis helps understand why certain pieces sound the way they do. Film composers
            often use Lydian mode for wonder and fantasy, while Dorian mode appears frequently in folk and jazz.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ModeTransformer;