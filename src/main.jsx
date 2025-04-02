import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

import { HashRouter } from 'react-router-dom'
import { UserProgressProvider } from './contexts/UserProgressContext'
import { AudioProvider } from './contexts/AudioContext'
import { PreferencesProvider } from './contexts/PreferencesContext'

ReactDOM.createRoot(document.getElementById('root')).render(
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
)