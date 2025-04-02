import React from 'react';
import { Link } from 'react-router-dom';
import NoteExplorer from '../../components/NoteExplorer/NoteExplorer';

const NoteExplorerPage = () => {
  return (
    <div className="note-explorer-page">
      <h1>Explore Musical Notes</h1>
      <p>Click a key on the interactive keyboard to see and hear the corresponding note.</p>
      <NoteExplorer />
      <p>
        <Link to="/">Back to Home</Link>
      </p>
    </div>
  );
};

export default NoteExplorerPage;