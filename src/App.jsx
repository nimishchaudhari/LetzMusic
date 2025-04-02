import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { 
  Home,
  Dashboard,
  NoteExplorer,
  IntervalDemonstrator 
} from './components/pages';

const App = () => {
  return (
    <div className="app">
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/note-explorer" element={<NoteExplorer />} />
          <Route path="/interval-demonstrator" element={<IntervalDemonstrator />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;