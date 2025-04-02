import React, { createContext, useState, useContext, useEffect } from 'react';
import * as Tone from 'tone';

// Create the context
const PlaybackContext = createContext();

// Custom hook to use the playback context
export const usePlayback = () => useContext(PlaybackContext);

// Provider component
export const PlaybackProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [tempo, setTempo] = useState(120);
  const [isAudioInitialized, setIsAudioInitialized] = useState(false);
  
  // Initialize audio engine
  const initializeAudio = async () => {
    if (!isAudioInitialized) {
      await Tone.start();
      setIsAudioInitialized(true);
    }
  };
  
  // Stop all audio playback
  const stopAllPlayback = () => {
    Tone.Transport.stop();
    Tone.Transport.cancel();
    setIsPlaying(false);
  };
  
  // Set transport tempo
  useEffect(() => {
    Tone.Transport.bpm.value = tempo;
  }, [tempo]);
  
  // Clean up when unmounting
  useEffect(() => {
    return () => {
      if (isPlaying) {
        stopAllPlayback();
      }
    };
  }, [isPlaying]);
  
  // Value to be provided by the context
  const value = {
    isPlaying,
    setIsPlaying,
    tempo,
    setTempo,
    isAudioInitialized,
    initializeAudio,
    stopAllPlayback
  };

  return (
    <PlaybackContext.Provider value={value}>
      {children}
    </PlaybackContext.Provider>
  );
};
