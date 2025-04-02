import React, { useState, useEffect } from 'react';
import { 
  generateScale, 
  getDiatonicChords, 
  getChordFunction,
  getChordNotes
} from '../../utils/music-theory';
import audioEngine from '../../utils/audio-engine';
import './ChordVisualizer.css';

/**
 * ChordVisualizer - Demonstrates how chords derive meaning from their relationship to a key center
 * 
 * Features:
 * - Visualizes triads built on each scale degree
 * - Roman numeral notation with color-coding for chord functions
 * - Audio playback for individual chords and progressions
 * - Educational explanation of chord function theory
 */
const ChordVisualizer = () => {
  const [selectedKey, setSelectedKey] = useState('C');
  const [selectedScale, setSelectedScale] = useState('major');
  const [diatonicChords, setDiatonicChords] = useState([]);
  const [scaleNotes, setScaleNotes] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentlyPlayingChord, setCurrentlyPlayingChord] = useState(null);
  const [selectedProgression, setSelectedProgression] = useState('I-IV-V-I');
  
  // Key options
  const keyOptions = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  
  // Scale options
  const scaleOptions = [
    { value: 'major', label: 'Major' },
    { value: 'minor', label: 'Minor' }
  ];
  
  // Common chord progressions
  const progressions = [
    { id: 'I-IV-V-I', name: 'I-IV-V-I (Common)', degrees: [0, 3, 4, 0] },
    { id: 'I-V-vi-IV', name: 'I-V-vi-IV (Pop)', degrees: [0, 4, 5, 3] },
    { id: 'ii-V-I', name: 'ii-V-I (Jazz)', degrees: [1, 4, 0] },
    { id: 'I-vi-IV-V', name: 'I-vi-IV-V (50s)', degrees: [0, 5, 3, 4] },
    { id: 'vi-IV-I-V', name: 'vi-IV-I-V (Emotional)', degrees: [5, 3, 0, 4] }
  ];
  
  // Initialize audio engine
  useEffect(() => {
    audioEngine.initialize();
    return () => {
      if (isPlaying) {
        audioEngine.stopAll();
      }
    };
  }, [isPlaying]);
  
  // Update chords when key or scale changes
  useEffect(() => {
    const scale = generateScale(selectedKey, selectedScale);
    setScaleNotes(scale);
    
    const chords = getDiatonicChords(selectedKey, selectedScale);
    setDiatonicChords(chords);
  }, [selectedKey, selectedScale]);
  
  // Handle key change
  const handleKeyChange = (e) => {
    setSelectedKey(e.target.value);
  };
  
  // Handle scale change
  const handleScaleChange = (e) => {
    setSelectedScale(e.target.value);
  };
  
  // Get chord color based on function
  const getChordColor = (chordIndex) => {
    const function_ = getChordFunction(chordIndex, selectedScale);
    
    switch (function_) {
      case 'Tonic':
        return '#4CAF50'; // Green
      case 'Subdominant':
        return '#2196F3'; // Blue
      case 'Dominant':
        return '#F44336'; // Red
      default:
        return '#9E9E9E'; // Grey
    }
  };
  
  // Get chord display name (Roman numerals)
  const getChordDisplayName = (chord, index) => {
    // Get Roman numeral based on degree
    const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
    let numeral = romanNumerals[index];
    
    // Lowercase for minor and diminished chords
    if (chord.type === 'minor' || chord.type === 'diminished') {
      numeral = numeral.toLowerCase();
    }
    
    // Add symbol for diminished chords
    if (chord.type === 'diminished') {
      numeral += '°';
    }
    
    return numeral;
  };
  
  // Play a single chord
  const playChord = (chord, index) => {
    if (isPlaying) {
      audioEngine.stopAll();
      setIsPlaying(false);
      setCurrentlyPlayingChord(null);
      return;
    }
    
    setIsPlaying(true);
    setCurrentlyPlayingChord(index);
    
    // Get chord notes with octaves
    const chordNotes = getChordNotes(chord.root, chord.type, 4);
    
    // Play chord
    audioEngine.playChord(chordNotes, '2n', () => {
      setIsPlaying(false);
      setCurrentlyPlayingChord(null);
    });
  };
  
  // Play chord progression
  const playProgression = () => {
    if (isPlaying) {
      audioEngine.stopAll();
      setIsPlaying(false);
      setCurrentlyPlayingChord(null);
      return;
    }
    
    // Find the selected progression
    const progression = progressions.find(p => p.id === selectedProgression);
    if (!progression) return;
    
    setIsPlaying(true);
    
    // Play each chord in sequence
    const chordDuration = 1; // in seconds
    progression.degrees.forEach((degree, i) => {
      const chord = diatonicChords[degree];
      setTimeout(() => {
        // Update currently playing chord indicator
        setCurrentlyPlayingChord(degree);
        
        // Get chord notes with octaves
        const chordNotes = getChordNotes(chord.root, chord.type, 4);
        
        // Play chord
        audioEngine.playChord(chordNotes, '2n');
        
        // If last chord, reset playing state
        if (i === progression.degrees.length - 1) {
          setTimeout(() => {
            setIsPlaying(false);
            setCurrentlyPlayingChord(null);
          }, 1000);
        }
      }, i * chordDuration * 1000);
    });
  };
  
  // Handle progression selection
  const handleProgressionChange = (e) => {
    setSelectedProgression(e.target.value);
  };
  
  return (
    <div className="chord-visualizer-container">
      <h2>Chord Function Visualizer</h2>
      
      <div className="controls">
        <div className="control-group">
          <label htmlFor="key-select">Key:</label>
          <select id="key-select" value={selectedKey} onChange={handleKeyChange}>
            {keyOptions.map(key => (
              <option key={key} value={key}>{key}</option>
            ))}
          </select>
        </div>
        
        <div className="control-group">
          <label htmlFor="scale-select">Scale:</label>
          <select id="scale-select" value={selectedScale} onChange={handleScaleChange}>
            {scaleOptions.map(scale => (
              <option key={scale.value} value={scale.value}>{scale.label}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="scale-display">
        <h3>Scale: {selectedKey} {selectedScale}</h3>
        <div className="scale-notes">
          {scaleNotes.map((note, index) => (
            <span key={index} className="scale-note">{note}</span>
          ))}
        </div>
      </div>
      
      <div className="chords-container">
        <h3>Diatonic Chords</h3>
        <div className="chord-cards">
          {diatonicChords.map((chord, index) => {
            const chordName = getChordDisplayName(chord, index);
            const chordFunction = getChordFunction(index, selectedScale);
            const chordColor = getChordColor(index);
            const isPlayed = currentlyPlayingChord === index;
            
            return (
              <div 
                key={index} 
                className={`chord-card ${isPlayed ? 'playing' : ''}`}
                onClick={() => playChord(chord, index)}
                style={{ borderColor: chordColor }}
              >
                <div className="chord-numeral" style={{ backgroundColor: chordColor }}>
                  {chordName}
                </div>
                <div className="chord-details">
                  <div className="chord-name">{chord.root}{chord.type === 'major' ? '' : chord.type === 'minor' ? 'm' : chord.type === 'diminished' ? '°' : ''}</div>
                  <div className="chord-notes">
                    {chord.notes.join(' - ')}
                  </div>
                  <div className="chord-function">{chordFunction}</div>
                </div>
                <div className="play-icon">
                  {isPlayed ? '■' : '▶'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="progression-player">
        <h3>Chord Progressions</h3>
        <div className="progression-controls">
          <select value={selectedProgression} onChange={handleProgressionChange}>
            {progressions.map(prog => (
              <option key={prog.id} value={prog.id}>{prog.name}</option>
            ))}
          </select>
          <button 
            className="play-button"
            onClick={playProgression}
            disabled={isPlaying && currentlyPlayingChord === null}
          >
            {isPlaying ? 'Stop' : 'Play Progression'}
          </button>
        </div>
        <div className="progression-display">
          {selectedProgression.split('-').map((numeral, i) => {
            const prog = progressions.find(p => p.id === selectedProgression);
            const degree = prog ? prog.degrees[i] : 0;
            const isPlayed = currentlyPlayingChord === degree && isPlaying;
            const chordColor = getChordColor(degree);
            
            return (
              <div 
                key={i} 
                className={`progression-chord ${isPlayed ? 'playing' : ''}`}
                style={{ backgroundColor: isPlayed ? chordColor : 'transparent', borderColor: chordColor }}
              >
                {numeral}
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="theory-explanation">
        <h3>Understanding Chord Functions</h3>
        <p>
          Chords in a key have specific roles or "functions" based on their relationship to the tonic (home) chord.
          These functions create the sense of tension and resolution that drives musical motion.
        </p>
        <div className="function-groups">
          <div className="function-group">
            <h4 style={{ color: '#4CAF50' }}>Tonic Function (I, vi, iii)</h4>
            <p>Creates a sense of stability and resolution. The "home base" of the key.</p>
          </div>
          <div className="function-group">
            <h4 style={{ color: '#2196F3' }}>Subdominant Function (IV, ii)</h4>
            <p>Creates movement away from tonic, setting up tension. The "departure" feeling.</p>
          </div>
          <div className="function-group">
            <h4 style={{ color: '#F44336' }}>Dominant Function (V, vii°)</h4>
            <p>Creates maximum tension that wants to resolve back to tonic. The "returning home" impulse.</p>
          </div>
        </div>
        <p>
          Most chord progressions in music follow functional patterns that create satisfying journeys of tension and resolution,
          typically moving from tonic → subdominant → dominant → tonic.
        </p>
      </div>
    </div>
  );
};

export default ChordVisualizer;