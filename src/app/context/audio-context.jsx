'use client';
import { createContext, useState, useContext, useEffect } from 'react';

const AudioContext = createContext({
  currentFile: null,
  currentPicture: null,
  setCurrentFile: () => {},
  setCurrentPicture: () => {},
});

export function AudioProvider({ children }) {
  const [currentFile, setCurrentFile] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('currentFile') || null;
    };
    
    return null;
  });

  const [currentPicture, setCurrentPicture] = useState(null);

  useEffect(() => {
    if (currentFile) {
      localStorage.setItem('currentFile', currentFile);
    } else {
      localStorage.removeItem('currentFile');
    };
  }, [currentFile]);

  return (
    <AudioContext.Provider value={{ currentFile, setCurrentFile, currentPicture, setCurrentPicture }}>
      {children}
    </AudioContext.Provider>
  );
};

export function useAudio() {
  const context = useContext(AudioContext);

  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  };

  return context;
};