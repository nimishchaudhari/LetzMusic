import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUserProgress } from '../../contexts/UserProgressContext';
import './Dashboard.css';

const Dashboard = ({ onMount }) => {
  const { progress } = useUserProgress();

  useEffect(() => {
    // Update last visited page
    if (onMount) onMount();
  }, [onMount]);
  
  // Determine recommended path based on user level
  const getRecommendedPath = () => {
    switch (progress.userLevel) {
      case 'beginner':
        return [
          {
            title: 'Notes and Pitch',
            description: 'Learn about musical notes and how they relate to pitch',
            component: 'note-explorer'
          },
          {
            title: 'Intervals',
            description: 'Discover the building blocks of melody and harmony',
            component: 'interval-demonstrator'
          },
          {
            title: 'Major Scale',
            description: 'The foundation of Western music theory',
            component: 'scale-laboratory'
          },
          {
            title: 'Basic Chords',
            description: 'How notes come together to form harmonies',
            component: 'chord-function-visualizer'
          }
        ];
      case 'instrument-player':
        return [
          {
            title: 'Theory to Practice',
            description: 'Connect theoretical concepts to your instrument',
            component: 'note-explorer'
          },
          {
            title: 'Scale Construction',
            description: 'How scales are built and how they function',
            component: 'scale-laboratory'
          },
          {
            title: 'Chord Functions',
            description: 'Understanding the role of chords in music',
            component: 'chord-function-visualizer'
          },
          {
            title: 'Modes',
            description: 'Expanding your tonal palette beyond major and minor',
            component: 'mode-transformer'
          }
        ];
      case 'theory-basics':
        return [
          {
            title: 'Advanced Scale Relationships',
            description: 'Explore the connections between different scales',
            component: 'relative-major-minor'
          },
          {
            title: 'Functional Harmony',
            description: 'Deeper understanding of chord relationships',
            component: 'chord-function-visualizer'
          },
          {
            title: 'Modulation',
            description: 'Moving between different keys',
            component: 'circle-of-fifths'
          },
          {
            title: 'Advanced Modes',
            description: 'Understanding and applying modal concepts',
            component: 'mode-transformer'
          }
        ];
      default:
        return [];
    }
  };

  const recommendedPath = getRecommendedPath();
  
  // Calculate progress percentage
  const completedLessons = Object.keys(progress.completedLessons || {}).length;
  const totalLessons = recommendedPath.length;
  const progressPercentage = totalLessons > 0 
    ? Math.round((completedLessons / totalLessons) * 100) 
    : 0;

  return (
    <div className="dashboard">
      <h1>Your Learning Dashboard</h1>
      
      <div className="dashboard-overview">
        <div className="progress-card">
          <h2>Your Progress</h2>
          <div className="progress-bar-container">
            <div 
              className="progress-bar" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <p>{progressPercentage}% Complete</p>
          
          <div className="dashboard-stats">
            <div className="stat-item">
              <span className="stat-value">{completedLessons}</span>
              <span className="stat-label">Completed</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{totalLessons - completedLessons}</span>
              <span className="stat-label">Remaining</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{progress.conceptMastery ? Object.keys(progress.conceptMastery).length : 0}</span>
              <span className="stat-label">Concepts Mastered</span>
            </div>
          </div>
        </div>
        
        <div className="user-level-card">
          <h2>Your Learning Path</h2>
          <div className="user-level">
            <span className="level-badge">
              {progress.userLevel === 'beginner' && 'Complete Beginner'}
              {progress.userLevel === 'instrument-player' && 'Instrument Player'}
              {progress.userLevel === 'theory-basics' && 'Theory Basics'}
            </span>
          </div>
          <p className="level-description">
            {progress.userLevel === 'beginner' && 
              'You\'re building a solid foundation in music theory fundamentals.'}
            {progress.userLevel === 'instrument-player' && 
              'You\'re connecting theory concepts to enhance your playing skills.'}
            {progress.userLevel === 'theory-basics' && 
              'You\'re deepening your understanding of advanced music theory concepts.'}
          </p>
        </div>
      </div>
      
      <h2>Recommended Learning Path</h2>
      <div className="learning-path">
        {recommendedPath.map((item, index) => (
          <div className="learning-item" key={index}>
            <div className="learning-item-number">{index + 1}</div>
            <div className="learning-item-content">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <Link to={`/${item.component}`} className="learning-item-button">
                Start Learning
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      <h2>Interactive Tools</h2>
      <div className="tool-cards">
        <div className="tool-card">
          <h3>Note Explorer</h3>
          <p>Discover how notes function differently in various musical contexts</p>
          <Link to="/note-explorer" className="tool-link">Open Tool</Link>
        </div>
        
        <div className="tool-card">
          <h3>Interval Demonstrator</h3>
          <p>Experience how intervals create relationships between notes</p>
          <Link to="/interval-demonstrator" className="tool-link">Open Tool</Link>
        </div>
        
        <div className="tool-card">
          <h3>Scale Laboratory</h3>
          <p>Build and experiment with different scales and modes</p>
          <Link to="/scale-laboratory" className="tool-link">Open Tool</Link>
        </div>
        
        <div className="tool-card">
          <h3>Circle of Fifths</h3>
          <p>Navigate the fundamental pattern that defines musical relationships</p>
          <Link to="/circle-of-fifths" className="tool-link">Open Tool</Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
