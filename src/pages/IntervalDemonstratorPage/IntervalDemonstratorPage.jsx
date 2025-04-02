import React from 'react';
import IntervalDemonstrator from '../../components/IntervalDemonstrator/IntervalDemonstrator';
import Navigation from '../../components/Navigation/Navigation';
import './IntervalDemonstratorPage.css';

/**
 * IntervalDemonstratorPage - Page wrapper for the IntervalDemonstrator component
 */
const IntervalDemonstratorPage = () => {
  return (
    <div className="page-container">
      <Navigation />
      <div className="content-container">
        <IntervalDemonstrator />
      </div>
    </div>
  );
};

export default IntervalDemonstratorPage;