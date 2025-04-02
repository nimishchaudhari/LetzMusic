import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../../components/Navigation/Navigation';
import './Dashboard.css';

/**
 * Dashboard - Main dashboard showing all available tools
 */
const Dashboard = () => {
  // Define the tools available in the application
  const tools = [
    {
      id: 'note-explorer',
      name: 'Note Explorer',
      description: 'See how the same note functions differently in various musical contexts',
      path: '/notes',
      level: 'beginner',
      icon: '🎵'
    },
    {
      id: 'interval-demonstrator',
      name: 'Interval Demonstrator',
      description: 'Understand how intervals create relationships between notes',
      path: '/intervals',
      level: 'beginner',
      icon: '📏'
    },
    {
      id: 'scale-lab',
      name: 'Scale Lab',
      description: 'Learn how scales are built from specific interval patterns',
      path: '/scales',
      level: 'beginner',
      icon: '🔍'
    },
    {
      id: 'relative-explorer',
      name: 'Relative Explorer',
      description: 'Explore the relationship between relative major and minor keys',
      path: '/relative',
      level: 'intermediate',
      icon: '🔄'
    },
    {
      id: 'circle-of-fifths',
      name: 'Circle of Fifths',
      description: 'Visualize key relationships through the circle of fifths',
      path: '/circle-of-fifths',
      level: 'intermediate',
      icon: '⭕'
    },
    {
      id: 'chord-visualizer',
      name: 'Chord Visualizer',
      description: 'Discover how chords derive meaning from their relationship to a key center',
      path: '/chord-visualizer',
      level: 'intermediate',
      icon: '🎹'
    },
    {
      id: 'mode-transformer',
      name: 'Mode Transformer',
      description: 'See how modes are transformations of the same scale from different positions',
      path: '/mode-transformer',
      level: 'advanced',
      icon: '🔄'
    }
  ];

  // Group tools by level
  const beginnerTools = tools.filter(tool => tool.level === 'beginner');
  const intermediateTools = tools.filter(tool => tool.level === 'intermediate');
  const advancedTools = tools.filter(tool => tool.level === 'advanced');

  return (
    <div className="dashboard-container">
      <Navigation />
      <div className="dashboard-content">
        <h1>Music Theory Interactive Tools</h1>
        <p className="dashboard-intro">
          Explore these interactive tools to understand how musical elements gain meaning through their relationships to each other.
          Start with the beginner tools and progress through to more advanced concepts.
        </p>

        <div className="level-section">
          <h2 className="level-title beginner">Beginner Tools</h2>
          <div className="tools-grid">
            {beginnerTools.map(tool => (
              <Link to={tool.path} key={tool.id} className="tool-card">
                <div className="tool-icon">{tool.icon}</div>
                <h3>{tool.name}</h3>
                <p>{tool.description}</p>
                <div className="tool-level beginner">Beginner</div>
              </Link>
            ))}
          </div>
        </div>

        <div className="level-section">
          <h2 className="level-title intermediate">Intermediate Tools</h2>
          <div className="tools-grid">
            {intermediateTools.map(tool => (
              <Link to={tool.path} key={tool.id} className="tool-card">
                <div className="tool-icon">{tool.icon}</div>
                <h3>{tool.name}</h3>
                <p>{tool.description}</p>
                <div className="tool-level intermediate">Intermediate</div>
              </Link>
            ))}
          </div>
        </div>

        <div className="level-section">
          <h2 className="level-title advanced">Advanced Tools</h2>
          <div className="tools-grid">
            {advancedTools.map(tool => (
              <Link to={tool.path} key={tool.id} className="tool-card">
                <div className="tool-icon">{tool.icon}</div>
                <h3>{tool.name}</h3>
                <p>{tool.description}</p>
                <div className="tool-level advanced">Advanced</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;