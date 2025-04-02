import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { UserProgressProvider } from './contexts/UserProgressContext';
import { AudioProvider } from './contexts/AudioContext';
import { PreferencesProvider } from './contexts/PreferencesContext';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HashRouter>
      <UserProgressProvider>
        <AudioProvider>
          <PreferencesProvider>
            <App />
          </PreferencesProvider>
        </AudioProvider>
      </UserProgressProvider>
    </HashRouter>
  </React.StrictMode>
);