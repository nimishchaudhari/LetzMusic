import React from 'react';
import PropTypes from 'prop-types';
import { useAudio } from '../../contexts/AudioContext';
import './AudioLoadingIndicator.css';

/**
 * AudioLoadingIndicator - Shows a loading state during audio initialization
 * 
 * This component displays a visual indicator when the audio engine is being initialized
 * and provides instructions for user interaction if audio fails to initialize.
 */
const AudioLoadingIndicator = ({ children }) => {
  const { initialized, initializing, error } = useAudio();

  if (error) {
    return (
      <div className="audio-error-container">
        <div className="audio-error">
          <h3>Audio Initialization Failed</h3>
          <p>There was a problem initializing the audio engine.</p>
          <p className="error-message">{error.message}</p>
          <div className="error-instructions">
            <p>Try the following:</p>
            <ul>
              <li>Click anywhere on the page to enable audio</li>
              <li>Check if your browser allows audio playback</li>
              <li>Try using a different browser</li>
              <li>Ensure your audio device is connected and unmuted</li>
            </ul>
          </div>
          <button 
            className="retry-button"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!initialized && initializing) {
    return (
      <div className="audio-loading-container">
        <div className="audio-loading">
          <div className="spinner"></div>
          <p>Initializing Audio Engine...</p>
          <p className="loading-hint">
            (Click anywhere if loading takes too long)
          </p>
        </div>
      </div>
    );
  }

  if (!initialized && !initializing) {
    return (
      <div className="audio-start-container" onClick={() => window.location.reload()}>
        <div className="audio-start">
          <p>Click anywhere to start audio engine</p>
          <p className="start-hint">
            (Web browsers require a user interaction to enable audio)
          </p>
        </div>
      </div>
    );
  }

  return children;
};

AudioLoadingIndicator.propTypes = {
  children: PropTypes.node.isRequired
};

export default AudioLoadingIndicator;
