import * as Tone from 'tone';

/**
 * Audio Engine class for handling all audio synthesis and playback
 * Uses Tone.js as the underlying audio framework
 */
class AudioEngine {
  constructor() {
    // Main polyphonic synth for notes and chords
    this.synth = new Tone.PolySynth(Tone.Synth).toDestination();
    
    // Flag to track if audio context is initialized
    this.initialized = false;
    
    // Store active sequences for management
    this.activeSequences = [];
  }

  /**
   * Initialize the audio context (must be called from a user interaction)
   * @returns {Promise<boolean>} Whether initialization was successful
   */
  async initialize() {
    if (this.initialized) return true;
    
    try {
      await Tone.start();
      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
      return false;
    }
  }

  /**
   * Play a single note
   * @param {string} note - Note to play (e.g., 'C4', 'D#3')
   * @param {string} duration - Note duration (e.g., '8n', '4n', '2n')
   */
  async playNote(note, duration = '8n') {
    if (!this.initialized) {
      const success = await this.initialize();
      if (!success) return;
    }
    
    this.synth.triggerAttackRelease(note, duration);
  }

  /**
   * Play multiple notes as a chord
   * @param {string[]|string} notes - Array of notes or chord name (e.g., ['C4', 'E4', 'G4'] or 'Cmaj')
   * @param {string} duration - Chord duration
   */
  async playChord(notes, duration = '2n') {
    if (!this.initialized) {
      const success = await this.initialize();
      if (!success) return;
    }
    
    // If a string is passed, convert it to notes (requires chord-name parser)
    if (typeof notes === 'string') {
      // Basic chord name parser (to be expanded)
      const root = notes.replace(/maj|min|m|dim|aug|sus[24]?|[2-9]/, '');
      const type = notes.replace(root, '');
      
      // Simple mapping for demonstration
      const chordMap = {
        'maj': ['C4', 'E4', 'G4'],
        'm': ['C4', 'Eb4', 'G4'],
        'min': ['C4', 'Eb4', 'G4'],
        '7': ['C4', 'E4', 'G4', 'Bb4'],
        'maj7': ['C4', 'E4', 'G4', 'B4'],
        // Add more chord types as needed
      };
      
      // Use placeholder chord for demonstration
      notes = chordMap[type] || ['C4', 'E4', 'G4'];
    }
    
    this.synth.triggerAttackRelease(notes, duration);
  }

  /**
   * Play a sequence of notes (such as a scale or melody)
   * @param {string[]} notes - Array of notes to play in sequence
   * @param {number} tempo - Playback tempo in BPM
   * @param {Function} onComplete - Callback when sequence completes
   * @returns {Object} The sequence object for control
   */
  async playScale(notes, tempo = 120, onComplete = null) {
    if (!this.initialized) {
      const success = await this.initialize();
      if (!success) return null;
    }
    
    const noteLength = '8n';
    
    // Create a new sequence
    const sequence = new Tone.Sequence(
      (time, note) => {
        this.synth.triggerAttackRelease(note, noteLength, time);
      },
      notes,
      '8n'
    );
    
    // Set tempo
    Tone.Transport.bpm.value = tempo;
    
    // Start sequence and transport
    sequence.start(0);
    
    // Only start transport if it's not already running
    if (Tone.Transport.state !== 'started') {
      Tone.Transport.start();
    }
    
    // Track active sequence
    this.activeSequences.push(sequence);
    
    // Set up completion handler
    if (onComplete) {
      // Calculate total duration based on tempo and number of notes
      const totalDuration = (60 / tempo) * notes.length;
      
      setTimeout(() => {
        sequence.stop();
        sequence.dispose();
        
        // Remove from active sequences
        this.activeSequences = this.activeSequences.filter(s => s !== sequence);
        
        // If no more active sequences, stop transport
        if (this.activeSequences.length === 0) {
          Tone.Transport.stop();
        }
        
        onComplete();
      }, (totalDuration * 1000) + 100); // Add a small buffer
    }
    
    return sequence;
  }

  /**
   * Play a simple arpeggio from a chord
   * @param {string[]} chordNotes - The notes of the chord
   * @param {number} tempo - Playback tempo
   * @param {string} pattern - Arpeggio pattern ('up', 'down', 'updown')
   * @param {Function} onComplete - Callback when completed
   */
  async playArpeggio(chordNotes, tempo = 120, pattern = 'up', onComplete = null) {
    let notes;
    
    // Generate arpeggio pattern
    switch (pattern) {
      case 'down':
        notes = [...chordNotes].reverse();
        break;
      case 'updown':
        notes = [...chordNotes, ...chordNotes.slice(1, -1).reverse()];
        break;
      case 'up':
      default:
        notes = chordNotes;
    }
    
    return this.playScale(notes, tempo, onComplete);
  }

  /**
   * Play a progression of chords
   * @param {Array} chords - Array of chord specifications
   * @param {number} tempo - Tempo in BPM
   * @param {Function} onChordChange - Callback when chord changes
   * @param {Function} onComplete - Callback when progression completes
   */
  async playProgression(chords, tempo = 80, onChordChange = null, onComplete = null) {
    if (!this.initialized) {
      const success = await this.initialize();
      if (!success) return;
    }
    
    const chordDuration = '2n'; // Half note duration for each chord
    const totalDuration = (60 / tempo) * 2 * chords.length; // in seconds
    
    // Play each chord sequentially with setTimeout
    let currentIndex = 0;
    
    const playNextChord = () => {
      if (currentIndex >= chords.length) {
        if (onComplete) onComplete();
        return;
      }
      
      const chord = chords[currentIndex];
      this.playChord(chord, chordDuration);
      
      if (onChordChange) onChordChange(chord, currentIndex);
      
      currentIndex++;
      setTimeout(playNextChord, (60 / tempo) * 2 * 1000); // Convert to milliseconds
    };
    
    playNextChord();
    
    // Return control object
    return {
      totalDuration,
      stop: () => {
        currentIndex = chords.length; // Will stop at next timeout
        this.stopAll();
      }
    };
  }

  /**
   * Stop all audio playback
   */
  stopAll() {
    // Stop and dispose all active sequences
    this.activeSequences.forEach(sequence => {
      sequence.stop();
      sequence.dispose();
    });
    this.activeSequences = [];
    
    // Stop transport
    Tone.Transport.stop();
    Tone.Transport.cancel();
  }
  
  /**
   * Create a custom instrument with specific settings
   * @param {string} type - Instrument type ('synth', 'piano', 'guitar', etc.)
   * @returns {Object} The created instrument
   */
  createInstrument(type = 'synth') {
    let instrument;
    
    switch (type) {
      case 'piano':
        instrument = new Tone.Sampler({
          // Use simplified piano tones for now (would be replaced with actual samples)
          'C4': 'piano-C4.mp3',
          'G4': 'piano-G4.mp3',
        }).toDestination();
        break;
        
      case 'guitar':
        // Basic guitar-like synth
        instrument = new Tone.PolySynth(Tone.AMSynth).toDestination();
        instrument.set({
          harmonicity: 2.5,
          oscillator: {
            type: 'sine'
          },
          envelope: {
            attack: 0.05,
            decay: 0.2,
            sustain: 0.4,
            release: 1.5
          },
          modulation: {
            type: 'square'
          },
          modulationEnvelope: {
            attack: 0.5,
            decay: 0.1,
            sustain: 0.2,
            release: 0.5
          }
        });
        break;
        
      case 'synth':
      default:
        instrument = new Tone.PolySynth(Tone.Synth).toDestination();
    }
    
    return instrument;
  }
}

// Create a singleton instance
const audioEngine = new AudioEngine();

export default audioEngine;
