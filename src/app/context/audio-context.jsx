import { createContext, useState, useContext } from 'react';

const AudioContext = createContext();

export function AudioProvider({ children }) {
  const [currentFile, setCurrentFile] = useState(null);

  return (
    <AudioContext.Provider value={{ currentFile, setCurrentFile }}>
      {children}
    </AudioContext.Provider>
  );
};

export function useAudio() {
  return useContext(AudioContext);
};