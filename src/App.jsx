// src/App.jsx
import React from 'react';
import ChatWindow from './components/ChatWindow';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'react-hot-toast'; // Import Toaster

function App() {
  return (
    <ThemeProvider>
      <Toaster position="top-center" /> {/* Add the Toaster component here */}
      <div className="app-container">
        <ChatWindow />
      </div>
    </ThemeProvider>
  );
}

export default App; 