import React from 'react';
import ChordVisualizer from '../../components/ChordVisualizer/ChordVisualizer';
import Navigation from '../../components/Navigation/Navigation';
import './ChordVisualizerPage.css';

/**
 * ChordVisualizerPage - Page wrapper for the ChordVisualizer component
 */
const ChordVisualizerPage = () => {
  return (
    <div className="page-container">
      <Navigation />
      <div className="content-container">
        <ChordVisualizer />
      </div>
    </div>
  );
};

export default ChordVisualizerPage;