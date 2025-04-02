import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { HashRouter as Router } from 'react-router-dom';
import UserProgressProvider from './contexts/UserProgressContext';
import AudioProvider from './contexts/AudioContext';
import PreferencesProvider from './contexts/PreferencesContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <AudioProvider>
        <UserProgressProvider>
          <PreferencesProvider>
            <App />
          </PreferencesProvider>
        </UserProgressProvider>
      </AudioProvider>
    </Router>
  </React.StrictMode>
);
