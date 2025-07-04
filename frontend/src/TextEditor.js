import React, { useState } from 'react';
import { transformText } from './api';

const TextEditor = () => {
  const [text, setText] = useState('');
  const [selectedText, setSelectedText] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [loading, setLoading] = useState(false);
  const [transformedText, setTransformedText] = useState('');

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleTextSelect = () => {
    const selection = window.getSelection().toString();
    if (selection) {
      setSelectedText(selection);
      const range = window.getSelection().getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setMenuPosition({ top: rect.top + window.scrollY, left: rect.left + window.scrollX });
      setShowMenu(true);
    } else {
      setShowMenu(false);
    }
  };

  const handleAction = async (action) => {
    setLoading(true);
    const response = await transformText(action, selectedText);
    setTransformedText(response.transformedText);
    setLoading(false);
  };

  return (
    <div className="editor-container">
      <textarea
        value={text}
        onChange={handleTextChange}
        onMouseUp={handleTextSelect}
        rows="10"
        cols="50"
        placeholder="Type your text here..."
      />
      {showMenu && (
        <div className="bubble-menu" style={{ top: menuPosition.top, left: menuPosition.left }}>
          <button onClick={() => handleAction('shorten')}>Make it Shorter</button>
          <button onClick={() => handleAction('lengthen')}>Make it Longer</button>
        </div>
      )}
      {loading && <p>Loading...</p>}
      {transformedText && (
        <div className="transformed-text">
          <h3>Transformed Text</h3>
          <p>{transformedText}</p>
        </div>
      )}
    </div>
  );
};

export default TextEditor;
