import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Keyboard from './Keyboard';

// Mock the audio engine
vi.mock('../../utils/audio-engine', () => ({
  default: {
    playNote: vi.fn(),
    initialize: vi.fn().mockResolvedValue(undefined),
  },
}));

describe('Keyboard Component', () => {
  const defaultProps = {
    startOctave: 3,
    endOctave: 5,
    onNoteClick: vi.fn(),
    highlightedNotes: [],
    colorMapping: {},
    noteLabels: 'default',
    interactive: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the correct number of keys', () => {
    render(<Keyboard {...defaultProps} />);
    // 3 octaves * 12 notes = 36 keys
    const keys = screen.getAllByRole('button');
    expect(keys.length).toBe(36);
  });

  it('renders highlighted notes with correct styling', () => {
    const highlightedNotes = ['C4', 'E4', 'G4'];
    render(<Keyboard {...defaultProps} highlightedNotes={highlightedNotes} />);

    // Check that the highlighted keys have the correct class
    highlightedNotes.forEach(note => {
      const key = screen.getByTestId(`key-${note}`);
      expect(key.classList.contains('highlighted')).toBe(true);
    });
  });

  it('calls onNoteClick when a key is clicked', () => {
    render(<Keyboard {...defaultProps} />);
    
    // Click on a key
    const cKey = screen.getByTestId('key-C4');
    fireEvent.click(cKey);
    
    // Check that onNoteClick was called with the correct note
    expect(defaultProps.onNoteClick).toHaveBeenCalledWith('C4', true, expect.any(Array));
  });

  it('does not call onNoteClick when interactive is false', () => {
    render(<Keyboard {...defaultProps} interactive={false} />);
    
    // Click on a key
    const cKey = screen.getByTestId('key-C4');
    fireEvent.click(cKey);
    
    // Check that onNoteClick was not called
    expect(defaultProps.onNoteClick).not.toHaveBeenCalled();
  });

  it('displays the correct note labels', () => {
    render(<Keyboard {...defaultProps} noteLabels="default" />);
    
    // Check that the C4 key has the correct label
    const cKey = screen.getByTestId('key-C4');
    expect(cKey.textContent).toBe('C');
  });

  it('uses color mapping when provided', () => {
    const colorMapping = {
      'C4': { color: '#FF5722', label: '1' },
      'E4': { color: '#4CAF50', label: '3' },
      'G4': { color: '#2196F3', label: '5' },
    };
    
    render(<Keyboard {...defaultProps} colorMapping={colorMapping} noteLabels="scale-degrees" />);
    
    // Check that keys have the correct custom labels
    const cKey = screen.getByTestId('key-C4');
    const eKey = screen.getByTestId('key-E4');
    const gKey = screen.getByTestId('key-G4');
    
    expect(cKey.textContent).toBe('1');
    expect(eKey.textContent).toBe('3');
    expect(gKey.textContent).toBe('5');
    
    // Check the background colors
    expect(cKey.style.backgroundColor).toBe('#FF5722');
    expect(eKey.style.backgroundColor).toBe('#4CAF50');
    expect(gKey.style.backgroundColor).toBe('#2196F3');
  });
});
