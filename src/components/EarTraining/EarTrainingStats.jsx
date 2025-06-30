import React from 'react';
import { useUserProgress } from '../../contexts/UserProgressContext';
import './EarTrainingStats.css';

const EarTrainingStats = () => {
  const { progress } = useUserProgress();

  // Filter ear training related progress
  const getEarTrainingStats = () => {
    const earTrainingConcepts = Object.entries(progress.conceptMastery || {})
      .filter(([key]) => key.startsWith('eartraining-') || key.includes('interval-') || key.includes('chord-') || key.includes('scale-'));
    
    const stats = {
      totalExercises: 0,
      correctAnswers: 0,
      byType: {
        interval: { total: 0, correct: 0 },
        chord: { total: 0, correct: 0 },
        scale: { total: 0, correct: 0 }
      },
      byDifficulty: {
        beginner: { total: 0, correct: 0 },
        intermediate: { total: 0, correct: 0 },
        advanced: { total: 0, correct: 0 }
      }
    };

    earTrainingConcepts.forEach(([conceptId, data]) => {
      if (data.level === 'correct' || data.level === 'incorrect') {
        stats.totalExercises++;
        
        if (data.level === 'correct') {
          stats.correctAnswers++;
        }

        // Parse concept type and difficulty
        const parts = conceptId.split('-');
        if (parts.length >= 2) {
          const type = parts[0] === 'eartraining' ? parts[1] : parts[0];
          const difficulty = parts[0] === 'eartraining' ? parts[2] : parts[1];
          
          if (stats.byType[type]) {
            stats.byType[type].total++;
            if (data.level === 'correct') {
              stats.byType[type].correct++;
            }
          }
          
          if (stats.byDifficulty[difficulty]) {
            stats.byDifficulty[difficulty].total++;
            if (data.level === 'correct') {
              stats.byDifficulty[difficulty].correct++;
            }
          }
        }
      }
    });

    return stats;
  };

  const stats = getEarTrainingStats();
  const overallAccuracy = stats.totalExercises > 0 
    ? Math.round((stats.correctAnswers / stats.totalExercises) * 100) 
    : 0;

  const getAccuracy = (correct, total) => {
    return total > 0 ? Math.round((correct / total) * 100) : 0;
  };

  if (stats.totalExercises === 0) {
    return (
      <div className="ear-training-stats">
        <h3>Your Progress</h3>
        <p className="no-stats">Complete some exercises to see your progress statistics here!</p>
      </div>
    );
  }

  return (
    <div className="ear-training-stats">
      <h3>Your Progress</h3>
      
      <div className="overall-stats">
        <div className="stat-card">
          <div className="stat-number">{stats.totalExercises}</div>
          <div className="stat-label">Total Exercises</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.correctAnswers}</div>
          <div className="stat-label">Correct Answers</div>
        </div>
        <div className="stat-card accuracy">
          <div className="stat-number">{overallAccuracy}%</div>
          <div className="stat-label">Overall Accuracy</div>
        </div>
      </div>

      <div className="detailed-stats">
        <div className="stats-section">
          <h4>By Exercise Type</h4>
          <div className="stats-grid">
            {Object.entries(stats.byType).map(([type, data]) => (
              data.total > 0 && (
                <div key={type} className="stat-item">
                  <span className="stat-type">{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                  <span className="stat-accuracy">{getAccuracy(data.correct, data.total)}%</span>
                  <span className="stat-count">({data.correct}/{data.total})</span>
                </div>
              )
            ))}
          </div>
        </div>

        <div className="stats-section">
          <h4>By Difficulty</h4>
          <div className="stats-grid">
            {Object.entries(stats.byDifficulty).map(([difficulty, data]) => (
              data.total > 0 && (
                <div key={difficulty} className="stat-item">
                  <span className="stat-type">{difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</span>
                  <span className="stat-accuracy">{getAccuracy(data.correct, data.total)}%</span>
                  <span className="stat-count">({data.correct}/{data.total})</span>
                </div>
              )
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarTrainingStats;