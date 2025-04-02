import React, { useState, useEffect, useRef } from 'react';
import { generateCircleOfFifths, getKeySignature } from '../../utils/music-theory';
import audioEngine from '../../utils/audio-engine';
import './CircleOfFifths.css';

/**
 * CircleOfFifths - An interactive visualization of key relationships through the circle of fifths
 * 
 * Features:
 * - SVG-based visualization with interactive key selection
 * - Key highlighting with proper sharps/flats display
 * - Relative minor/major relationship demonstration
 * - Audio playback of selected scales
 */
const CircleOfFifths = () => {
  const [selectedKey, setSelectedKey] = useState(null);
  const [selectedType, setSelectedType] = useState('major'); // 'major' or 'minor'
  const [isPlaying, setIsPlaying] = useState(false);
  const [circleData, setCircleData] = useState(null);
  const svgRef = useRef(null);
  
  // Constants for the SVG rendering
  const WIDTH = 600;
  const HEIGHT = 600;
  const CENTER_X = WIDTH / 2;
  const CENTER_Y = HEIGHT / 2;
  const OUTER_RADIUS = 220;
  const INNER_RADIUS = 150;
  const KEY_RADIUS = 30;
  
  // Initialize circle data
  useEffect(() => {
    const data = generateCircleOfFifths();
    setCircleData(data);
  }, []);

  // Initialize audio engine
  useEffect(() => {
    audioEngine.initialize();
    return () => {
      if (isPlaying) {
        audioEngine.stopAll();
      }
    };
  }, [isPlaying]);

  // Handle key selection
  const handleKeyClick = (key, type) => {
    setSelectedKey(key);
    setSelectedType(type);
    
    // Stop any currently playing audio
    if (isPlaying) {
      audioEngine.stopAll();
      setIsPlaying(false);
    }
  };

  // Play the scale of the selected key
  const playScale = () => {
    if (!selectedKey) return;
    
    setIsPlaying(true);
    
    // Generate the scale notes with octave 4
    const scaleType = selectedType === 'major' ? 'major' : 'minor';
    const scaleNotes = audioEngine.getScaleNotes(selectedKey, scaleType, 4);
    
    // Add the octave note to complete the scale
    const fullScale = [...scaleNotes, scaleNotes[0].replace('4', '5')];
    
    audioEngine.playScale(fullScale, 120, () => {
      setIsPlaying(false);
    });
  };

  // Render the key circles
  const renderKeyCircles = () => {
    if (!circleData) return null;
    
    const { keys, innerKeys } = circleData;
    
    return (
      <>
        {/* Outer circle - Major keys */}
        {keys.map((key, index) => {
          const angle = (index * 30) * (Math.PI / 180);
          const x = CENTER_X + OUTER_RADIUS * Math.sin(angle);
          const y = CENTER_Y - OUTER_RADIUS * Math.cos(angle);
          
          const isSelected = selectedKey === key.note && selectedType === 'major';
          
          return (
            <g 
              key={`major-${key.note}`}
              onClick={() => handleKeyClick(key.note, 'major')}
              className={`key-circle ${isSelected ? 'selected' : ''}`}
              transform={`translate(${x}, ${y})`}
            >
              <circle 
                r={KEY_RADIUS} 
                className={`key-circle-major ${isSelected ? 'selected' : ''}`}
              />
              <text 
                className="key-text" 
                textAnchor="middle" 
                dominantBaseline="middle"
              >
                {key.note}
              </text>
              <text 
                className="key-signature" 
                textAnchor="middle" 
                dominantBaseline="middle" 
                y="18"
              >
                {key.keySignature.sharps > 0 
                  ? `${key.keySignature.sharps}♯` 
                  : key.keySignature.flats > 0 
                    ? `${key.keySignature.flats}♭` 
                    : ''}
              </text>
            </g>
          );
        })}
        
        {/* Inner circle - Minor keys */}
        {innerKeys.map((key, index) => {
          const angle = (index * 30) * (Math.PI / 180);
          const x = CENTER_X + INNER_RADIUS * Math.sin(angle);
          const y = CENTER_Y - INNER_RADIUS * Math.cos(angle);
          
          const isSelected = selectedKey === key.note && selectedType === 'minor';
          
          return (
            <g 
              key={`minor-${key.note}`}
              onClick={() => handleKeyClick(key.note, 'minor')}
              className={`key-circle ${isSelected ? 'selected' : ''}`}
              transform={`translate(${x}, ${y})`}
            >
              <circle 
                r={KEY_RADIUS} 
                className={`key-circle-minor ${isSelected ? 'selected' : ''}`}
              />
              <text 
                className="key-text" 
                textAnchor="middle" 
                dominantBaseline="middle"
              >
                {key.note}m
              </text>
            </g>
          );
        })}
        
        {/* Relationship lines when a key is selected */}
        {selectedKey && circleData && renderRelationshipLines()}
      </>
    );
  };

  // Render relationship lines (relative major/minor, dominant, subdominant)
  const renderRelationshipLines = () => {
    if (!selectedKey || !circleData) return null;
    
    const { keys, innerKeys } = circleData;
    const relationships = [];
    
    // Find the selected key object
    const majorKey = keys.find(k => k.note === selectedKey && selectedType === 'major');
    const minorKey = innerKeys.find(k => k.note === selectedKey && selectedType === 'minor');
    
    if (majorKey) {
      // Find the relative minor
      const relativeMinor = innerKeys.find(k => k.note === majorKey.relativeMinor);
      
      if (relativeMinor) {
        // Get positions
        const majorAngle = keys.indexOf(majorKey) * 30 * (Math.PI / 180);
        const majorX = CENTER_X + OUTER_RADIUS * Math.sin(majorAngle);
        const majorY = CENTER_Y - OUTER_RADIUS * Math.cos(majorAngle);
        
        const minorAngle = innerKeys.indexOf(relativeMinor) * 30 * (Math.PI / 180);
        const minorX = CENTER_X + INNER_RADIUS * Math.sin(minorAngle);
        const minorY = CENTER_Y - INNER_RADIUS * Math.cos(minorAngle);
        
        relationships.push(
          <line 
            key="relative-relationship"
            x1={majorX} 
            y1={majorY} 
            x2={minorX} 
            y2={minorY}
            className="relationship-line relative"
          />
        );
      }
    } else if (minorKey) {
      // Find the relative major
      const relativeMajor = keys.find(k => k.note === minorKey.relativeMajor);
      
      if (relativeMajor) {
        // Get positions
        const minorAngle = innerKeys.indexOf(minorKey) * 30 * (Math.PI / 180);
        const minorX = CENTER_X + INNER_RADIUS * Math.sin(minorAngle);
        const minorY = CENTER_Y - INNER_RADIUS * Math.cos(minorAngle);
        
        const majorAngle = keys.indexOf(relativeMajor) * 30 * (Math.PI / 180);
        const majorX = CENTER_X + OUTER_RADIUS * Math.sin(majorAngle);
        const majorY = CENTER_Y - OUTER_RADIUS * Math.cos(majorAngle);
        
        relationships.push(
          <line 
            key="relative-relationship"
            x1={minorX} 
            y1={minorY} 
            x2={majorX} 
            y2={majorY}
            className="relationship-line relative"
          />
        );
      }
    }
    
    return relationships;
  };

  // Render the key information panel
  const renderKeyInfo = () => {
    if (!selectedKey) {
      return (
        <div className="key-info">
          <h3>Select a key to see details</h3>
          <p>Click on any key in the circle to view information about it and its relationships.</p>
        </div>
      );
    }
    
    const keySignature = getKeySignature(selectedKey, selectedType);
    const sharpsOrFlats = keySignature.sharps > 0 
      ? `${keySignature.sharps} sharp${keySignature.sharps > 1 ? 's' : ''}` 
      : keySignature.flats > 0 
        ? `${keySignature.flats} flat${keySignature.flats > 1 ? 's' : ''}` 
        : 'No sharps or flats';
    
    // Find relative key
    const relativeKey = selectedType === 'major' 
      ? `${selectedKey === 'A' ? 'F' : selectedKey === 'B' ? 'G' : selectedKey === 'C' ? 'A' : selectedKey === 'D' ? 'B' : selectedKey === 'E' ? 'C' : selectedKey === 'F' ? 'D' : selectedKey === 'G' ? 'E' : selectedKey}♯ minor` 
      : `${selectedKey === 'A' ? 'C' : selectedKey === 'B' ? 'D' : selectedKey === 'C' ? 'E' : selectedKey === 'D' ? 'F' : selectedKey === 'E' ? 'G' : selectedKey === 'F' ? 'A' : selectedKey === 'G' ? 'B' : selectedKey}♭ major`;
    
    return (
      <div className="key-info">
        <h3>{selectedKey} {selectedType}</h3>
        <p>Key signature: {sharpsOrFlats}</p>
        <p>Relative key: {relativeKey}</p>
        <button 
          className="play-button" 
          onClick={playScale} 
          disabled={isPlaying}
        >
          {isPlaying ? 'Playing...' : 'Play Scale'}
        </button>
      </div>
    );
  };

  return (
    <div className="circle-of-fifths-container">
      <h2>Circle of Fifths</h2>
      <div className="circle-diagram">
        <svg 
          ref={svgRef}
          width={WIDTH} 
          height={HEIGHT} 
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="circle-svg"
        >
          {/* Background circles */}
          <circle cx={CENTER_X} cy={CENTER_Y} r={OUTER_RADIUS + 30} className="circle-background" />
          <circle cx={CENTER_X} cy={CENTER_Y} r={INNER_RADIUS - 20} className="circle-background inner" />
          
          {/* Radial lines connecting keys */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = i * 30 * (Math.PI / 180);
            const outerX = CENTER_X + (OUTER_RADIUS + 30) * Math.sin(angle);
            const outerY = CENTER_Y - (OUTER_RADIUS + 30) * Math.cos(angle);
            const innerX = CENTER_X + (INNER_RADIUS - 20) * Math.sin(angle);
            const innerY = CENTER_Y - (INNER_RADIUS - 20) * Math.cos(angle);
            
            return (
              <line
                key={`radial-line-${i}`}
                x1={innerX}
                y1={innerY}
                x2={outerX}
                y2={outerY}
                className="radial-line"
              />
            );
          })}
          
          {/* Key circles */}
          {renderKeyCircles()}
          
          {/* Center text */}
          <text 
            x={CENTER_X} 
            y={CENTER_Y - 15} 
            textAnchor="middle" 
            className="center-text-title"
          >
            Circle of Fifths
          </text>
          <text 
            x={CENTER_X} 
            y={CENTER_Y + 15} 
            textAnchor="middle" 
            className="center-text-subtitle"
          >
            Major (outer) ↔ Minor (inner)
          </text>
        </svg>
      </div>
      
      {/* Key information panel */}
      {renderKeyInfo()}
      
      {/* Theory explanation */}
      <div className="theory-explanation">
        <h3>About the Circle of Fifths</h3>
        <p>
          The Circle of Fifths is a visual representation of the relationships between the 12 tones of the chromatic scale.
          It organizes keys in a way that adjacent keys are separated by an interval of a perfect fifth.
        </p>
        <p>
          Moving clockwise around the circle adds one sharp to the key signature, while moving counterclockwise adds one flat.
          The outer circle represents major keys, while the inner circle shows their relative minor keys.
        </p>
        <p>
          This powerful music theory tool helps with understanding key relationships, modulation, and chord progressions.
        </p>
      </div>
    </div>
  );
};

export default CircleOfFifths;