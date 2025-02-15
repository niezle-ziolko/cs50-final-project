'use client';
import { createContext, useState, useContext, useMemo } from 'react';

const AudioContext = createContext();

export function AudioProvider({ children }) {
  const [file, setFile] = useState(null);
  const [picture, setPicture] = useState(null);

  const setAudio = (newFile, newPicture) => {
    setFile(newFile);
    setPicture(newPicture);
  };

  const value = useMemo(() => ({ file, picture, setAudio }), [file, picture]);

  return (
    <AudioContext.Provider value={value}>
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