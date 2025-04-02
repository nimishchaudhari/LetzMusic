import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUserProgress } from '../../contexts/UserProgressContext';
import './Navigation.css';

const Navigation = () => {
  const { progress } = useUserProgress();
  const [menuOpen, setMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  
  const closeMenu = () => {
    setMenuOpen(false);
  };
  
  return (
    <header className="navigation">
      <div className="nav-container">
        <div className="logo">
          <Link to="/" onClick={closeMenu}>LetzMusic</Link>
        </div>
        
        <button className="menu-toggle" onClick={toggleMenu} aria-expanded={menuOpen}>
          <span className="sr-only">Menu</span>
          <div className={`hamburger ${menuOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
        
        <nav className={`nav-menu ${menuOpen ? 'open' : ''}`}>
          <ul className="nav-links">
            <li>
              <Link to="/" onClick={closeMenu}>Home</Link>
            </li>
            {progress.userLevel && (
              <li>
                <Link to="/dashboard" onClick={closeMenu}>Dashboard</Link>
              </li>
            )}
            <li className="dropdown">
              <button className="dropdown-toggle">
                Interactive Tools
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              <ul className="dropdown-menu">
                <li>
                  <Link to="/note-explorer" onClick={closeMenu}>Note Explorer</Link>
                </li>
                <li>
                  <Link to="/interval-demonstrator" onClick={closeMenu}>Interval Demonstrator</Link>
                </li>
                <li>
                  <Link to="/scale-laboratory" onClick={closeMenu}>Scale Laboratory</Link>
                </li>
                <li>
                  <Link to="/chord-function-visualizer" onClick={closeMenu}>Chord Function Visualizer</Link>
                </li>
                <li>
                  <Link to="/relative-major-minor" onClick={closeMenu}>Relative Major/Minor</Link>
                </li>
                <li>
                  <Link to="/circle-of-fifths" onClick={closeMenu}>Circle of Fifths</Link>
                </li>
                <li>
                  <Link to="/mode-transformer" onClick={closeMenu}>Mode Transformer</Link>
                </li>
              </ul>
            </li>
            <li>
              <a href="https://github.com/nimishchaudhari/LetzMusic" target="_blank" rel="noopener noreferrer" onClick={closeMenu}>GitHub</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navigation;
