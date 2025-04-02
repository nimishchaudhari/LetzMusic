import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUserProgress } from '../../contexts/UserProgressContext';
import './Home.css';

const Home = ({ onMount }) => {
  const { progress, setUserLevel } = useUserProgress();
  const [showLevelSelector, setShowLevelSelector] = useState(!progress.userLevel);
  
  useEffect(() => {
    // Update last visited page
    if (onMount) onMount();
  }, [onMount]);
  
  const handleSelectLevel = (level) => {
    setUserLevel(level);
    setShowLevelSelector(false);
  };
  
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Discover the Language of Music</h1>
          <p className="hero-subtitle">Learn music theory through interactive visualizations and hands-on exploration</p>
          {progress.userLevel ? (
            <Link to="/dashboard" className="cta-button">Continue Learning</Link>
          ) : (
            <button 
              className="cta-button"
              onClick={() => setShowLevelSelector(true)}
            >
              Start Learning
            </button>
          )}
        </div>
      </section>
      
      {showLevelSelector && (
        <section className="level-selector">
          <h2>Choose Your Starting Point</h2>
          <p>Select the option that best describes your current music knowledge:</p>
          
          <div className="level-cards">
            <div className="level-card" onClick={() => handleSelectLevel('beginner')}>
              <h3>Complete Beginner</h3>
              <p>I'm new to music theory and want to learn the basics</p>
              <ul>
                <li>Learn musical notes and pitch</li>
                <li>Understand intervals and scales</li>
                <li>Explore basic chords</li>
              </ul>
              <button className="level-button">Select</button>
            </div>
            
            <div className="level-card" onClick={() => handleSelectLevel('instrument-player')}>
              <h3>Instrument Player</h3>
              <p>I can play, but want to understand the theory behind it</p>
              <ul>
                <li>Connect theory to playing</li>
                <li>Understand chord progression</li>
                <li>Learn scales and modes</li>
              </ul>
              <button className="level-button">Select</button>
            </div>
            
            <div className="level-card" onClick={() => handleSelectLevel('theory-basics')}>
              <h3>Theory Foundations</h3>
              <p>I know the basics and want to deepen my understanding</p>
              <ul>
                <li>Advanced scale relationships</li>
                <li>Complex harmony concepts</li>
                <li>Composition techniques</li>
              </ul>
              <button className="level-button">Select</button>
            </div>
          </div>
        </section>
      )}
      
      <section className="features">
        <h2>Interactive Learning Tools</h2>
        <div className="feature-cards">
          <div className="feature-card">
            <h3>Note Explorer</h3>
            <p>Discover how notes function differently in various musical contexts</p>
            <Link to="/note-explorer" className="feature-link">Try It →</Link>
          </div>
          
          <div className="feature-card">
            <h3>Interval Demonstrator</h3>
            <p>Experience how intervals create relationships between notes</p>
            <Link to="/interval-demonstrator" className="feature-link">Try It →</Link>
          </div>
          
          <div className="feature-card">
            <h3>Scale Laboratory</h3>
            <p>Build and experiment with different scales and modes</p>
            <Link to="/scale-laboratory" className="feature-link">Try It →</Link>
          </div>
          
          <div className="feature-card">
            <h3>Circle of Fifths</h3>
            <p>Navigate the fundamental pattern that defines musical relationships</p>
            <Link to="/circle-of-fifths" className="feature-link">Try It →</Link>
          </div>
        </div>
      </section>
      
      <section className="about">
        <h2>About LetzMusic</h2>
        <p>
          LetzMusic is an interactive music theory learning application designed to demonstrate 
          how musical elements gain meaning through their relationships to each other.
        </p>
        <p>
          Rather than memorizing isolated facts, our approach focuses on understanding the 
          connections between notes, intervals, scales, and chords, making music theory 
          intuitive and practical.
        </p>
        <p>
          Each concept is presented with interactive visualizations and audio examples, 
          allowing you to both see and hear the musical relationships in action.
        </p>
      </section>
    </div>
  );
};

export default Home;
