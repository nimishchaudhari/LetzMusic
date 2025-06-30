import React, { useState, useEffect } from 'react';
import { useAudio } from '../../contexts/AudioContext';
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
          if (exercise.playSequentially) {
            // Play notes in sequence
            await playNote(exercise.rootNote);
            setTimeout(async () => {
              await playNote(exercise.targetNote);
              setIsPlaying(false);
            }, 800);
          } else {
            // Play notes together
            await playNote([exercise.rootNote, exercise.targetNote]);
            setIsPlaying(false);
          }
          break;
          
        case 'chord':
          if (exercise.playArpeggio) {
            // Play chord as arpeggio
            await playSequence(exercise.chordNotes, 150);
            setIsPlaying(false);
          } else {
            // Play chord together
            await playChord(exercise.chordNotes);
            setIsPlaying(false);
          }
          break;
          
        case 'scale':
          if (exercise.playAscending) {
            // Play scale ascending
            await playSequence(exercise.scaleNotes, 120);
            setIsPlaying(false);
          }
          break;
          
        default:
          setIsPlaying(false);
      }
    } catch (error) {
      console.error('Error playing exercise:', error);
      setIsPlaying(false);
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
          <p>💡 Hint: Try singing or humming the interval to help identify it.</p>
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