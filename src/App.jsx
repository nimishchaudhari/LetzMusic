import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { ProgressionProvider } from './contexts/ProgressionContext';
import { PlaybackProvider } from './contexts/PlaybackContext';
import { AudioProvider } from './contexts/AudioContext';
import { UserProgressProvider } from './contexts/UserProgressContext';
import Home from './pages/Home/Home';
import Dashboard from './pages/Dashboard/Dashboard';
import NoteExplorerPage from './pages/NoteExplorerPage/NoteExplorerPage';
import CircleOfFifthsPage from './pages/CircleOfFifthsPage/CircleOfFifthsPage';
import ChordVisualizerPage from './pages/ChordVisualizerPage/ChordVisualizerPage';
import ModeTransformerPage from './pages/ModeTransformerPage/ModeTransformerPage';
import IntervalDemonstratorPage from './pages/IntervalDemonstratorPage/IntervalDemonstratorPage';
import ScaleLabPage from './pages/ScaleLabPage/ScaleLabPage';
import RelativeExplorerPage from './pages/RelativeExplorerPage/RelativeExplorerPage';
import EarTrainingPage from './pages/EarTrainingPage/EarTrainingPage';

/**
 * App - Main application component with routing
 */
const App = () => {
  return (
    <ThemeProvider>
      <UserProgressProvider>
        <AudioProvider>
          <ProgressionProvider>
            <PlaybackProvider>  
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
<Route path="/ear-training" element={<EarTrainingPage />} />
                  <Route path="/mode-transformer" element={<ModeTransformerPage />} />
                </Routes>
              </div>
            </PlaybackProvider>
          </ProgressionProvider>
        </AudioProvider>
      </UserProgressProvider>
    </ThemeProvider>
  );
};

export default App;
