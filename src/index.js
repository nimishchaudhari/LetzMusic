import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import UserProgressProvider from './contexts/UserProgressContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router basename={process.env.PUBLIC_URL}>
      <UserProgressProvider>
        <App />
      </UserProgressProvider>
    </Router>
  </React.StrictMode>
);
