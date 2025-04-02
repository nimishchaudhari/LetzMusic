import React from 'react';
import ModeTransformer from '../../components/ModeTransformer/ModeTransformer';
import Navigation from '../../components/Navigation/Navigation';
import './ModeTransformerPage.css';

/**
 * ModeTransformerPage - Page wrapper for the ModeTransformer component
 */
const ModeTransformerPage = () => {
  return (
    <div className="page-container">
      <Navigation />
      <div className="content-container">
        <ModeTransformer />
      </div>
    </div>
  );
};

export default ModeTransformerPage;