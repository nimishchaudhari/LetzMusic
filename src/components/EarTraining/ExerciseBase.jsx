import React, { useState, useEffect } from 'react';
import { useAudio } from '../../contexts/AudioContext';
import audioEngine from '../../utils/audio-engine';
import './ExerciseBase.css';

const ExerciseBase = ({ 
  exercise, 
  onAnswer, 
  showHints = false,
  autoAdvance = false,
  onNext 
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const { playNote, playChord, playSequence } = useAudio();

  useEffect(() => {
    // Reset state when exercise changes
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
  }, [exercise]);

  const playExercise = async () => {
    if (!exercise || isPlaying) return;
    
    setIsPlaying(true);
    
    try {
      switch (exercise.type) {
        case 'interval':
          await audioEngine.playIntervalForTraining(
            exercise.rootNote,
            exercise.targetNote,
            {
              sequential: exercise.playSequentially,
              gap: 0.8,
              duration: '2n'
            }
          );
          break;
          
        case 'chord':
          await audioEngine.playChordForTraining(
            exercise.chordNotes,
            {
              arpeggiate: exercise.playArpeggio,
              arpeggiateSpeed: 120,
              duration: '2n'
            }
          );
          break;
          
        case 'scale':
          await audioEngine.playScaleForTraining(
            exercise.scaleNotes,
            {
              ascending: exercise.playAscending,
              descending: exercise.playDescending,
              tempo: 120
            }
          );
          break;
          
        default:
          console.warn('Unknown exercise type:', exercise.type);
      }
    } catch (error) {
      console.error('Error playing exercise:', error);
    } finally {
      // Set a timeout to reset playing state
      setTimeout(() => setIsPlaying(false), 2000);
    }
  };

  const handleAnswerSelect = (answer) => {
    if (showResult) return; // Prevent changing answer after submission
    setSelectedAnswer(answer);
  };

  const handleSubmit = () => {
    if (!selectedAnswer || showResult) return;
    
    const correct = onAnswer(selectedAnswer);
    setIsCorrect(correct);
    setShowResult(true);
    
    if (autoAdvance && correct) {
      setTimeout(() => {
        onNext?.();
      }, 1500);
    }
  };

  const handleNext = () => {
    onNext?.();
  };

  const getExerciseTitle = () => {
    switch (exercise?.type) {
      case 'interval':
        return 'Identify the Interval';
      case 'chord':
        return 'Identify the Chord Quality';
      case 'scale':
        return 'Identify the Scale';
      default:
        return 'Exercise';
    }
  };

  const getExerciseInstructions = () => {
    switch (exercise?.type) {
      case 'interval':
        return 'Listen to the two notes and identify the interval between them.';
      case 'chord':
        return 'Listen to the chord and identify its quality.';
      case 'scale':
        return 'Listen to the scale and identify its type.';
      default:
        return 'Listen and identify the musical element.';
    }
  };

  if (!exercise) {
    return (
      <div className="exercise-base">
        <div className="no-exercise">
          <p>No exercise available. Generate a new exercise to begin.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="exercise-base">
      <div className="exercise-header">
        <h3>{getExerciseTitle()}</h3>
        <p className="exercise-instructions">{getExerciseInstructions()}</p>
      </div>

      <div className="exercise-player">
        <button 
          className={`play-button ${isPlaying ? 'playing' : ''}`}
          onClick={playExercise}
          disabled={isPlaying}
        >
          {isPlaying ? '♪ Playing...' : '▶ Play Exercise'}
        </button>
        
        {!isPlaying && (
          <button 
            className="replay-button"
            onClick={playExercise}
            title="Replay Exercise"
          >
            🔄 Replay
          </button>
        )}
      </div>

      <div className="exercise-options">
        {exercise.options?.map((option, index) => (
          <button
            key={index}
            className={`option-button ${
              selectedAnswer === option.value ? 'selected' : ''
            } ${
              showResult && option.value === exercise.correctAnswer 
                ? 'correct' 
                : ''
            } ${
              showResult && selectedAnswer === option.value && !isCorrect 
                ? 'incorrect' 
                : ''
            }`}
            onClick={() => handleAnswerSelect(option.value)}
            disabled={showResult}
          >
            {option.label}
          </button>
        ))}
      </div>

      {showHints && selectedAnswer && !showResult && (
        <div className="exercise-hint">
          {exercise.type === 'interval' && (
            <p>💡 Hint: Try singing or humming from the first note to the second. Large intervals jump more than small ones.</p>
          )}
          {exercise.type === 'chord' && (
            <p>💡 Hint: Major chords sound bright and happy, minor chords sound darker, diminished chords sound tense.</p>
          )}
          {exercise.type === 'scale' && (
            <p>💡 Hint: Major scales sound bright and complete, minor scales sound darker, modes have unique characteristics.</p>
          )}
        </div>
      )}

      {showHints && !selectedAnswer && !showResult && (
        <div className="exercise-hint">
          <p>💡 Select an answer to see a helpful hint!</p>
        </div>
      )}

      <div className="exercise-controls">
        <button
          className="submit-button"
          onClick={handleSubmit}
          disabled={!selectedAnswer || showResult}
        >
          Submit Answer
        </button>
        
        {showResult && (
          <button
            className="next-button"
            onClick={handleNext}
          >
            Next Exercise
          </button>
        )}
      </div>

      {showResult && (
        <div className={`exercise-result ${isCorrect ? 'correct' : 'incorrect'}`}>
          <div className="result-icon">
            {isCorrect ? '✅' : '❌'}
          </div>
          <div className="result-message">
            {isCorrect 
              ? 'Correct! Well done!' 
              : `Incorrect. The answer was: ${exercise.options?.find(opt => opt.value === exercise.correctAnswer)?.label}`
            }
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseBase;