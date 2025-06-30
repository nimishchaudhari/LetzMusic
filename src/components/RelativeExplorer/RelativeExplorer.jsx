import React, { useState, useEffect } from 'react';
import { 
  NOTES, 
  generateScale, 
  getRelativeKey,
  getDiatonicChords
} from '../../utils/music-theory';
import { useAudio } from '../../contexts/AudioContext';
import './RelativeExplorer.css';

const RelativeExplorer = () => {
  const [rootNote, setRootNote] = useState('C');
  const [scaleType, setScaleType] = useState('major');
  
  const [primaryScale, setPrimaryScale] = useState([]);
  const [relativeScale, setRelativeScale] = useState([]);
  const [relativeInfo, setRelativeInfo] = useState(null);
  
  const [primaryChords, setPrimaryChords] = useState([]);
  const [relativeChords, setRelativeChords] = useState([]);
  
  const [activeTab, setActiveTab] = useState('scales');
  
  const { playNote, playSequence, playChord } = useAudio();

  // Update scales and chords when root note or scale type changes
  useEffect(() => {
    // Get primary scale
    const scale = generateScale(rootNote, scaleType);
    const scaleWithOctaves = scale.map(note => `${note}4`);
    setPrimaryScale(scaleWithOctaves);
    
    // Get relative key information
    const relativeKeyInfo = getRelativeKey(rootNote, scaleType);
    setRelativeInfo(relativeKeyInfo);
    
    if (relativeKeyInfo) {
      // Get relative scale
      const relScale = generateScale(relativeKeyInfo.root, relativeKeyInfo.type);
      const relScaleWithOctaves = relScale.map(note => `${note}4`);
      setRelativeScale(relScaleWithOctaves);
      
      // Get diatonic chords for both keys
      setPrimaryChords(getDiatonicChords(rootNote, scaleType));
      setRelativeChords(getDiatonicChords(relativeKeyInfo.root, relativeKeyInfo.type));
    }
  }, [rootNote, scaleType]);

  const handlePlayScale = (scale) => {
    if (scale && scale.length > 0) {
      // Play the scale up and down
      const scaleUp = [...scale];
      const scaleDown = [...scale].reverse().slice(1);
      playSequence([...scaleUp, ...scaleDown], 120);
    }
  };
  
  const handlePlayChord = (chord) => {
    if (chord && chord.chord) {
      // Add octave numbers for audio playback
      const chordWithOctaves = chord.chord.map(note => `${note}4`);
      playChord(chordWithOctaves);
    }
  };
  
  const handlePlayBoth = () => {
    // Play both scales in sequence
    if (primaryScale.length > 0 && relativeScale.length > 0) {
      // First the primary scale
      handlePlayScale(primaryScale);
      
      // After a delay, play the relative scale
      setTimeout(() => {
        handlePlayScale(relativeScale);
      }, 4000); // Delay based on scale length
    }
  };

  return (
    <div className="relative-explorer">
      <h2>Relative Major/Minor Explorer</h2>
      <p>
        Explore the relationship between relative major and minor keys, which share the same notes
        but start from different positions, creating different tonalities.
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
            <option value="major">Major</option>
            <option value="minor">Minor</option>
          </select>
        </div>
        
        <button 
          className="play-button" 
          onClick={handlePlayBoth}
        >
          Play Both Scales
        </button>
      </div>
      
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'scales' ? 'active' : ''}`}
          onClick={() => setActiveTab('scales')}
        >
          Scales
        </button>
        <button 
          className={`tab ${activeTab === 'chords' ? 'active' : ''}`}
          onClick={() => setActiveTab('chords')}
        >
          Chords
        </button>
        <button 
          className={`tab ${activeTab === 'theory' ? 'active' : ''}`}
          onClick={() => setActiveTab('theory')}
        >
          Theory
        </button>
      </div>
      
      <div className="tab-content">
        {activeTab === 'scales' && (
          <div className="scales-view">
            <div className="scale-box primary">
              <h3>{rootNote} {scaleType.charAt(0).toUpperCase() + scaleType.slice(1)}</h3>
              <div className="scale-notes">
                {primaryScale.map((note, index) => (
                  <div 
                    key={index}
                    className="scale-note"
                    onClick={() => playNote(note)}
                  >
                    {note.replace(/\d/g, '')}
                    <span className="degree">{index + 1}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => handlePlayScale(primaryScale)}>
                Play Scale
              </button>
            </div>
            
            <div className="relationship-arrow">
              {scaleType === 'major' ? '↔ Relative Minor' : '↔ Relative Major'}
            </div>
            
            {relativeInfo && (
              <div className="scale-box relative">
                <h3>
                  {relativeInfo.root} {relativeInfo.type.charAt(0).toUpperCase() + relativeInfo.type.slice(1)}
                </h3>
                <div className="scale-notes">
                  {relativeScale.map((note, index) => (
                    <div 
                      key={index}
                      className="scale-note"
                      onClick={() => playNote(note)}
                    >
                      {note.replace(/\d/g, '')}
                      <span className="degree">{index + 1}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => handlePlayScale(relativeScale)}>
                  Play Scale
                </button>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'chords' && (
          <div className="chords-view">
            <div className="chord-box primary">
              <h3>{rootNote} {scaleType.charAt(0).toUpperCase() + scaleType.slice(1)} Chords</h3>
              <div className="chord-list">
                {primaryChords.map((chord, index) => (
                  <div 
                    key={index}
                    className="chord-item"
                    onClick={() => handlePlayChord(chord)}
                  >
                    <div className="chord-name">
                      {chord.numeral}
                    </div>
                    <div className="chord-notes">
                      {chord.root}{chord.type} ({chord.chord.join(', ')})
                    </div>
                    <div className="chord-function">
                      {chord.function}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {relativeInfo && (
              <div className="chord-box relative">
                <h3>{relativeInfo.root} {relativeInfo.type.charAt(0).toUpperCase() + relativeInfo.type.slice(1)} Chords</h3>
                <div className="chord-list">
                  {relativeChords.map((chord, index) => (
                    <div 
                      key={index}
                      className="chord-item"
                      onClick={() => handlePlayChord(chord)}
                    >
                      <div className="chord-name">
                        {chord.numeral}
                      </div>
                      <div className="chord-notes">
                        {chord.root}{chord.type} ({chord.chord.join(', ')})
                      </div>
                      <div className="chord-function">
                        {chord.function}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'theory' && (
          <div className="theory-view">
            <h3>Understanding Relative Keys</h3>
            
            <div className="theory-content">
              <p>
                <strong>Relative keys</strong> are musical keys that share the same key signature (the same set of sharps or flats).
                Every major key has a relative minor key, and every minor key has a relative major key.
              </p>
              
              <h4>Key Relationships:</h4>
              <ul>
                <li>
                  <strong>To find the relative minor</strong> of a major key: Go down 3 semitones (or up 9 semitones) from the major key's tonic. For example, the relative minor of C major is A minor.
                </li>
                <li>
                  <strong>To find the relative major</strong> of a minor key: Go up 3 semitones (or down 9 semitones) from the minor key's tonic. For example, the relative major of A minor is C major.
                </li>
              </ul>
              
              <h4>What Makes Them Special:</h4>
              <ul>
                <li>
                  <strong>Same notes, different starting point:</strong> Both relative keys use exactly the same notes, but they start from different positions in the scale.
                </li>
                <li>
                  <strong>Different character:</strong> Despite sharing the same notes, they sound very different because of the different tonal center and chord relationships.
                </li>
                <li>
                  <strong>Different chord functions:</strong> The chords play different functional roles in each key, creating distinct harmonies and resolutions.
                </li>
              </ul>
              
              {relativeInfo && (
                <div className="example-box">
                  <h4>Current Example:</h4>
                  <p>
                    {rootNote} {scaleType} and {relativeInfo.root} {relativeInfo.type} are relative keys.
                  </p>
                  <p>
                    Both keys share exactly the same notes, starting from different positions. However, the emotional character is quite different:
                  </p>
                  <ul>
                    <li>{rootNote} {scaleType} typically sounds {scaleType === 'major' ? 'bright and happy' : 'dark and melancholic'}.</li>
                    <li>{relativeInfo.root} {relativeInfo.type} typically sounds {relativeInfo.type === 'major' ? 'bright and happy' : 'dark and melancholic'}.</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RelativeExplorer;
