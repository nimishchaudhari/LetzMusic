import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { ProgressionProvider } from './contexts/ProgressionContext';
import { PlaybackProvider } from './contexts/PlaybackContext';
import Home from './pages/Home/Home';
import Dashboard from './pages/Dashboard/Dashboard';
import NoteExplorerPage from './pages/NoteExplorerPage/NoteExplorerPage';

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
              </Routes>
            </div>
          </Router>
        </PlaybackProvider>
      </ProgressionProvider>  
    </ThemeProvider>
  );
};

export default App;