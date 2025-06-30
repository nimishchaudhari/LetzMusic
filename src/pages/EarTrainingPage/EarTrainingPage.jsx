import React from 'react';
import EarTraining from '../../components/EarTraining/EarTraining';
import Navigation from '../../components/Navigation/Navigation';
import { EarTrainingProvider } from '../../contexts/EarTrainingContext';
import './EarTrainingPage.css';

const EarTrainingPage = () => {
  return (
    <EarTrainingProvider>
      <div className="page-container">
        <Navigation />
        <div className="content-container">
          <EarTraining />
        </div>
      </div>
    </EarTrainingProvider>
  );
};

export default EarTrainingPage;