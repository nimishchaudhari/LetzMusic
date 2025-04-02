import React from 'react';
import RelativeExplorer from '../../components/RelativeExplorer/RelativeExplorer';
import Navigation from '../../components/Navigation/Navigation';
import './RelativeExplorerPage.css';

/**
 * RelativeExplorerPage - Page wrapper for the RelativeExplorer component
 */
const RelativeExplorerPage = () => {
  return (
    <div className="page-container">
      <Navigation />
      <div className="content-container">
        <RelativeExplorer />
      </div>
    </div>
  );
};

export default RelativeExplorerPage;