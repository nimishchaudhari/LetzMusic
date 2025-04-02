import React, { createContext, useContext, useEffect, useState } from 'react';
import * as Tone from 'tone';
import { useUserProgress } from './UserProgressContext';

const AudioContext = createContext();

export const useAudio = () => useContext(AudioContext);

export const AudioProvider = ({ children }) => {
  const [initialized, setInitialized] = useState(false);
  const [synth, setSynth] = useState(null);
  const [activeSequences, setActiveSequences] = useState([]);
  const { progress } = useUserProgress();

  // Initialize Tone.js when component mounts
  useEffect(() => {
    const initializeTone = async () => {
      // Create a polyphonic synth for chord playback
      const newSynth = new Tone.PolySynth(Tone.Synth).toDestination();
      setSynth(newSynth);
    };

    initializeTone();

    // Cleanup on unmount
    return () => {
      Tone.Transport.stop();
      Tone.Transport.cancel();
    };
  }, []);

  // Check if audio is enabled in user preferences
  const isAudioEnabled = progress?.preferences?.audioEnabled ?? true;

  // Initialize Tone.js audio context (requires user interaction)
  const initialize = async () => {
    if (!initialized && isAudioEnabled) {
      await Tone.start();
      setInitialized(true);
    }
    return initialized;
  };

  // Play a single note
  const playNote = async (note, duration = '8n') => {
    if (!isAudioEnabled) return;
    
    const isInit = initialized || await initialize();
    if (isInit && synth) {
      synth.triggerAttackRelease(note, duration);
    }
  };

  // Play an interval (two notes in sequence)
  const playInterval = async (note1, note2, gap = 0.5) => {
    if (!isAudioEnabled) return;
    
    const isInit = initialized || await initialize();
    if (isInit && synth) {
      // Play the first note
      synth.triggerAttackRelease(note1, '8n');
      
      // Play the second note after a delay
      setTimeout(() => {
        synth.triggerAttackRelease(note2, '8n');
        
        // Play both notes together after another delay
        setTimeout(() => {
          synth.triggerAttackRelease([note1, note2], '2n');
        }, gap * 1000);
      }, gap * 1000);
    }
  };

  // Play a chord (multiple notes at once)
  const playChord = async (notes, duration = '2n') => {
    if (!isAudioEnabled) return;
    
    const isInit = initialized || await initialize();
    if (isInit && synth) {
      synth.triggerAttackRelease(notes, duration);
    }
  };

  // Play a sequence of notes (scale, melody, etc.)
  const playSequence = async (notes, tempo = 120, onComplete = null) => {
    if (!isAudioEnabled) return null;
    
    const isInit = initialized || await initialize();
    if (!isInit || !synth) return null;

    const noteLength = '8n';
    
    // Create a new sequence
    const sequence = new Tone.Sequence(
      (time, note) => {
        synth.triggerAttackRelease(note, noteLength, time);
      },
      notes,
      '8n'
    );

    // Set tempo
    Tone.Transport.bpm.value = tempo;
    
    // Start sequence
    sequence.start(0);
    
    // If this is the first sequence, start the transport
    if (activeSequences.length === 0) {
      Tone.Transport.start();
    }
    
    // Add to active sequences
    setActiveSequences(prev => [...prev, sequence]);
    
    // Set up completion handler
    if (onComplete) {
      // Calculate total duration based on tempo and number of notes
      const totalDuration = (60 / tempo) * notes.length;
      setTimeout(() => {
        sequence.stop();
        sequence.dispose();
        setActiveSequences(prev => prev.filter(s => s !== sequence));
        onComplete();
        
        // If no more sequences, stop transport
        if (activeSequences.length === 1) {
          Tone.Transport.stop();
        }
      }, totalDuration * 1000 + 100); // Add a small buffer
    }
    
    return sequence;
  };

  // Stop all audio playback
  const stopAll = () => {
    if (activeSequences.length > 0) {
      activeSequences.forEach(sequence => {
        sequence.stop();
        sequence.dispose();
      });
      setActiveSequences([]);
    }
    
    Tone.Transport.stop();
    Tone.Transport.cancel();
  };

  // Context value
  const value = {
    initialized,
    initialize,
    playNote,
    playChord,
    playSequence,
    playInterval,
    stopAll,
    isAudioEnabled
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
};

export default AudioProvider;
