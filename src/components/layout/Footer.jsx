import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>LetzMusic</h3>
            <p>Interactive music theory learning application demonstrating how musical elements gain meaning through relationships.</p>
          </div>
          
          <div className="footer-section">
            <h3>Resources</h3>
            <ul>
              <li><a href="https://github.com/nimishchaudhari/LetzMusic" target="_blank" rel="noopener noreferrer">GitHub Repository</a></li>
              <li><a href="https://tonejs.github.io/" target="_blank" rel="noopener noreferrer">Tone.js Documentation</a></li>
              <li><a href="https://reactjs.org/" target="_blank" rel="noopener noreferrer">React Documentation</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Interactive Tools</h3>
            <ul>
              <li><a href="/note-explorer">Note Explorer</a></li>
              <li><a href="/interval-demonstrator">Interval Demonstrator</a></li>
              <li><a href="/scale-laboratory">Scale Laboratory</a></li>
              <li><a href="/circle-of-fifths">Circle of Fifths</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {currentYear} LetzMusic. All rights reserved.</p>
          <p>
            <button className="footer-button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              Back to Top
            </button>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
