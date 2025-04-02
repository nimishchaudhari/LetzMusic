import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navigation.css';

/**
 * Navigation - Main navigation component with links to all tools
 */
const Navigation = () => {
  return (
    <nav className="navigation">
      <div className="logo">LetzMusic</div>
      <ul>
        <li>
          <NavLink to="/" end>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/dashboard">Dashboard</NavLink>
        </li>
        <li>
          <NavLink to="/notes">Note Explorer</NavLink>
        </li>
        <li>
          <NavLink to="/circle-of-fifths">Circle of Fifths</NavLink>
        </li>
        <li>
          <NavLink to="/chord-visualizer">Chord Visualizer</NavLink>
        </li>
        <li>
          <NavLink to="/mode-transformer">Mode Transformer</NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;