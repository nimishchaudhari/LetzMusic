import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { ProgressionProvider } from './contexts/ProgressionContext';
import { PlaybackProvider } from './contexts/PlaybackContext';
import Home from './pages/Home/Home';
import Dashboard from './pages/Dashboard/Dashboard';
import NoteExplorerPage from './pages/NoteExplorerPage/NoteExplorerPage';
import CircleOfFifthsPage from './pages/CircleOfFifthsPage/CircleOfFifthsPage';
import ChordVisualizerPage from './pages/ChordVisualizerPage/ChordVisualizerPage';
import ModeTransformerPage from './pages/ModeTransformerPage/ModeTransformerPage';
import IntervalDemonstratorPage from './pages/IntervalDemonstratorPage/IntervalDemonstratorPage';
import ScaleLabPage from './pages/ScaleLabPage/ScaleLabPage';
import RelativeExplorerPage from './pages/RelativeExplorerPage/RelativeExplorerPage';

/**
 * App - Main application component with routing
 */
const App = () => {
  return (
    <ThemeProvider>
      <ProgressionProvider>
        <PlaybackProvider>  
          <Router>
            <div className="app">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/notes" element={<NoteExplorerPage />} />
                <Route path="/intervals" element={<IntervalDemonstratorPage />} />
                <Route path="/scales" element={<ScaleLabPage />} />
                <Route path="/relative" element={<RelativeExplorerPage />} />
                <Route path="/circle-of-fifths" element={<CircleOfFifthsPage />} />
                <Route path="/chord-visualizer" element={<ChordVisualizerPage />} />
                <Route path="/mode-transformer" element={<ModeTransformerPage />} />
              </Routes>
            </div>
          </Router>
        </PlaybackProvider>
      </ProgressionProvider>  
    </ThemeProvider>
  );
};

export default App;