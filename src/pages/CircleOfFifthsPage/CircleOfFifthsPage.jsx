import React from 'react';
import CircleOfFifths from '../../components/CircleOfFifths/CircleOfFifths';
import Navigation from '../../components/Navigation/Navigation';
import './CircleOfFifthsPage.css';

/**
 * CircleOfFifthsPage - Page wrapper for the CircleOfFifths component
 */
const CircleOfFifthsPage = () => {
  return (
    <div className="page-container">
      <Navigation />
      <div className="content-container">
        <CircleOfFifths />
      </div>
    </div>
  );
};

export default CircleOfFifthsPage;