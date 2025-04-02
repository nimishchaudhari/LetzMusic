import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../../components/Navigation/Navigation';
import './Home.css';

/**
 * Home - Landing page for the LetzMusic application
 */
const Home = () => {
  // Tools available in the application
  const tools = [
    {
      name: 'Note Explorer',
      description: 'See how notes function differently in various contexts',
      path: '/notes'
    },
    {
      name: 'Interval Demonstrator',
      description: 'Explore how intervals create relationships between notes',
      path: '/intervals'
    },
    {
      name: 'Scale Lab',
      description: 'Understand how scales are built from interval patterns',
      path: '/scales'
    },
    {
      name: 'Relative Explorer',
      description: 'Learn about relative major and minor key relationships',
      path: '/relative'
    },
    {
      name: 'Circle of Fifths',
      description: 'Visualize key relationships through the circle of fifths',
      path: '/circle-of-fifths'
    },
    {
      name: 'Chord Visualizer',
      description: 'Discover how chords function within a key',
      path: '/chord-visualizer'
    },
    {
      name: 'Mode Transformer',
      description: 'Explore modes as transformations of the same scale',
      path: '/mode-transformer'
    }
  ];

  return (
    <div className="home-container">
      <Navigation />
      <div className="hero-section">
        <h1>LetzMusic</h1>
        <p className="tagline">
          Discover how music theory elements gain meaning through relationships
        </p>
        <Link to="/dashboard" className="cta-button">
          Start Learning
        </Link>
      </div>

      <div className="tools-section">
        <h2>Interactive Tools</h2>
        <div className="tools-grid">
          {tools.map((tool, index) => (
            <Link to={tool.path} key={index} className="tool-card">
              <h3>{tool.name}</h3>
              <p>{tool.description}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="about-section">
        <h2>About LetzMusic</h2>
        <p>
          LetzMusic is an interactive application designed to make learning music theory
          intuitive and engaging. Through visual demonstrations and audio examples,
          we help you understand the fundamental concept that musical elements gain their
          meaning through relationships to other elements.
        </p>
        <p>
          Whether you're a complete beginner, an instrument player looking to deepen your
          theoretical knowledge, or a student seeking advanced concepts, LetzMusic
          provides interactive tools to enhance your understanding of music theory.
        </p>
      </div>

      <footer className="home-footer">
        <p>&copy; 2025 LetzMusic. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;