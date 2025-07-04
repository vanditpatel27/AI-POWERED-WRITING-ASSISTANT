import React from 'react';  // Removed { useState }
import './App.css';
import TextEditor from './TextEditor';

function App() {
  return (
    <div className="App">
      <h1>AI-powered Writing Assistant</h1>
      <TextEditor />
    </div>
  );
}

export default App;
