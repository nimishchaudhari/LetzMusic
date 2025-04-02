import React from 'react';
import ScaleLab from '../../components/ScaleLab/ScaleLab';
import Navigation from '../../components/Navigation/Navigation';
import './ScaleLabPage.css';

/**
 * ScaleLabPage - Page wrapper for the ScaleLab component
 */
const ScaleLabPage = () => {
  return (
    <div className="page-container">
      <Navigation />
      <div className="content-container">
        <ScaleLab />
      </div>
    </div>
  );
};

export default ScaleLabPage;