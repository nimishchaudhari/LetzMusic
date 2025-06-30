import React, { useState, useEffect } from 'react';
import { useEarTraining } from '../../contexts/EarTrainingContext';
import ExerciseBase from './ExerciseBase';
import './EarTraining.css';

const EarTraining = () => {
  const {
    currentExercise,
    exerciseType,
    difficulty,
    mode,
    sessionStats,
    setExerciseType,
    setDifficulty,
    setMode,
    generateExercise,
    submitAnswer,
    startSession,
    endSession
  } = useEarTraining();

  const [sessionActive, setSessionActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [timer, setTimer] = useState(null);

  // Challenge mode timer
  useEffect(() => {
    if (mode === 'challenge' && sessionActive && timeRemaining > 0) {
      const intervalId = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleEndSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      setTimer(intervalId);
      
      return () => clearInterval(intervalId);
    } else if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
  }, [mode, sessionActive, timeRemaining]);

  const handleStartSession = () => {
    startSession();
    setSessionActive(true);
    
    if (mode === 'challenge') {
      setTimeRemaining(300); // 5 minutes for challenge mode
    }
    
    // Generate first exercise
    generateExercise();
  };

  const handleEndSession = () => {
    endSession();
    setSessionActive(false);
    setTimeRemaining(0);
    
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
  };

  const handleAnswer = (answer) => {
    const isCorrect = submitAnswer(answer);
    return isCorrect;
  };

  const handleNextExercise = () => {
    generateExercise();
  };

  const handleExerciseTypeChange = (type) => {
    setExerciseType(type);
    if (sessionActive) {
      generateExercise(type);
    }
  };

  const handleDifficultyChange = (newDifficulty) => {
    setDifficulty(newDifficulty);
    if (sessionActive) {
      generateExercise();
    }
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    if (sessionActive) {
      handleEndSession();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getAccuracy = () => {
    const total = sessionStats.correct + sessionStats.incorrect;
    return total > 0 ? Math.round((sessionStats.correct / total) * 100) : 0;
  };

  return (
    <div className="ear-training">
      <div className="ear-training-header">
        <h2>Advanced Ear Training</h2>
        <p>Develop your listening skills with interactive exercises</p>
      </div>

      {/* Exercise Controls */}
      <div className="exercise-controls">
        <div className="control-group">
          <label>Exercise Type:</label>
          <select 
            value={exerciseType} 
            onChange={(e) => handleExerciseTypeChange(e.target.value)}
            disabled={sessionActive}
          >
            <option value="interval">Interval Recognition</option>
            <option value="chord">Chord Quality</option>
            <option value="scale">Scale Identification</option>
          </select>
        </div>

        <div className="control-group">
          <label>Difficulty:</label>
          <select 
            value={difficulty} 
            onChange={(e) => handleDifficultyChange(e.target.value)}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <div className="control-group">
          <label>Mode:</label>
          <select 
            value={mode} 
            onChange={(e) => handleModeChange(e.target.value)}
            disabled={sessionActive}
          >
            <option value="practice">Practice</option>
            <option value="challenge">Challenge (5 min)</option>
          </select>
        </div>
      </div>

      {/* Session Stats */}
      {sessionActive && (
        <div className="session-stats">
          <div className="stat-item">
            <span className="stat-label">Correct:</span>
            <span className="stat-value correct">{sessionStats.correct}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Incorrect:</span>
            <span className="stat-value incorrect">{sessionStats.incorrect}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Accuracy:</span>
            <span className="stat-value">{getAccuracy()}%</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Streak:</span>
            <span className="stat-value streak">{sessionStats.streak}</span>
          </div>
          {mode === 'challenge' && (
            <div className="stat-item">
              <span className="stat-label">Time:</span>
              <span className={`stat-value ${timeRemaining < 60 ? 'warning' : ''}`}>
                {formatTime(timeRemaining)}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Exercise Area */}
      <div className="exercise-area">
        {!sessionActive ? (
          <div className="session-start">
            <h3>Ready to start training?</h3>
            <p>
              {mode === 'practice' 
                ? 'Practice mode lets you work at your own pace with hints available.'
                : 'Challenge mode gives you 5 minutes to answer as many questions as possible!'
              }
            </p>
            <button 
              className="start-session-button"
              onClick={handleStartSession}
            >
              Start {mode === 'challenge' ? 'Challenge' : 'Practice'}
            </button>
          </div>
        ) : (
          <ExerciseBase
            exercise={currentExercise}
            onAnswer={handleAnswer}
            onNext={handleNextExercise}
            showHints={mode === 'practice'}
            autoAdvance={mode === 'challenge'}
          />
        )}
      </div>

      {/* Session End Controls */}
      {sessionActive && (
        <div className="session-controls">
          <button 
            className="end-session-button"
            onClick={handleEndSession}
          >
            End Session
          </button>
        </div>
      )}

      {/* Exercise Type Information */}
      <div className="exercise-info">
        <h3>About {exerciseType.charAt(0).toUpperCase() + exerciseType.slice(1)} Recognition</h3>
        <div className="info-content">
          {exerciseType === 'interval' && (
            <p>
              Interval recognition helps you identify the distance between two notes. 
              This is fundamental for understanding melody, harmony, and chord progressions.
            </p>
          )}
          {exerciseType === 'chord' && (
            <p>
              Chord quality recognition teaches you to distinguish between different types of chords.
              This skill is essential for harmonic analysis and composition.
            </p>
          )}
          {exerciseType === 'scale' && (
            <p>
              Scale identification helps you recognize different scale types and their unique sounds.
              This knowledge is crucial for understanding musical modes and styles.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EarTraining;