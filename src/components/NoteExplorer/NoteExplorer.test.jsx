import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import NoteExplorer from './NoteExplorer';

describe('NoteExplorer', () => {
  it('renders the keyboard', () => {
    render(<NoteExplorer />);
    const keyboard = screen.getByRole('keyboard');
    expect(keyboard).toBeInTheDocument();
  });

  it('displays note info when a key is clicked', () => {
    render(<NoteExplorer />);
    const key = screen.getByText('C');
    fireEvent.click(key);
    const noteInfo = screen.getByText(/C/i);  
    expect(noteInfo).toBeInTheDocument();
  });

  it('updates the audio when a key is clicked', () => {
    const playNote = jest.fn();  
    jest.mock('../../modules', () => ({
      AudioEngine: { playNote },
    }));

    render(<NoteExplorer />);
    const key = screen.getByText('D');
    fireEvent.click(key);
    expect(playNote).toHaveBeenCalled();
  });
});