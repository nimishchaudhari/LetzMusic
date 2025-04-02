import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useUserProgress } from './contexts/UserProgressContext';

// Layout components
import Navigation from './components/layout/Navigation';
import Footer from './components/layout/Footer';

// Page components
import Home from './components/pages/Home';
import Dashboard from './components/pages/Dashboard';
import NoteExplorer from './components/pages/NoteExplorer';
import IntervalDemonstrator from './components/pages/IntervalDemonstrator';
import ScaleLaboratory from './components/pages/ScaleLaboratory';
import ChordFunctionVisualizer from './components/pages/ChordFunctionVisualizer';
import RelativeMajorMinor from './components/pages/RelativeMajorMinor';
import CircleOfFifths from './components/pages/CircleOfFifths';
import ModeTransformer from './components/pages/ModeTransformer';

import './App.css';

function App() {
  const { progress, updateLastVisited } = useUserProgress();

  // Update last visited page when route changes
  const handleRouteChange = (path) => {
    updateLastVisited(path);
  };

  return (
    <div className="app">
      <Navigation />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home onMount={() => handleRouteChange('home')} />} />
          <Route path="/dashboard" element={<Dashboard onMount={() => handleRouteChange('dashboard')} />} />
          <Route path="/note-explorer" element={<NoteExplorer onMount={() => handleRouteChange('note-explorer')} />} />
          <Route path="/interval-demonstrator" element={<IntervalDemonstrator onMount={() => handleRouteChange('interval-demonstrator')} />} />
          <Route path="/scale-laboratory" element={<ScaleLaboratory onMount={() => handleRouteChange('scale-laboratory')} />} />
          <Route path="/chord-function-visualizer" element={<ChordFunctionVisualizer onMount={() => handleRouteChange('chord-function-visualizer')} />} />
          <Route path="/relative-major-minor" element={<RelativeMajorMinor onMount={() => handleRouteChange('relative-major-minor')} />} />
          <Route path="/circle-of-fifths" element={<CircleOfFifths onMount={() => handleRouteChange('circle-of-fifths')} />} />
          <Route path="/mode-transformer" element={<ModeTransformer onMount={() => handleRouteChange('mode-transformer')} />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
