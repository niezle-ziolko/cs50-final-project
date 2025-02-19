'use client';
import { createContext, useState, useContext, useEffect } from 'react';

const AudioContext = createContext({
  bookFile: null,
  bookPicture: null,
  bookId: null,
  bookTitle: null,
  setBookFile: () => {},
  setBookPicture: () => {},
  setBookId: () => {},
  setBookTitle: () => {}
});

export function AudioProvider({ children }) {
  const [bookFile, setBookFile] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('bookFile') || null;
    };
    return null;
  });

  const [bookPicture, setBookPicture] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('bookPicture') || null;
    };
    return null;
  });

  const [bookId, setBookId] = useState(null);

  const [bookTitle, setBookTitle] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('bookTitle') || null;
    };
    return null;
  });

  useEffect(() => {
    if (bookFile) {
      localStorage.setItem('bookFile', bookFile);
    } else {
      localStorage.removeItem('bookFile');
    };
  }, [bookFile]);

  useEffect(() => {
    if (bookPicture) {
      localStorage.setItem('bookPicture', bookPicture);
    } else {
      localStorage.removeItem('bookPicture');
    };
  }, [bookPicture]);

  useEffect(() => {
    if (bookTitle) {
      localStorage.setItem('bookTitle', bookTitle);
    } else {
      localStorage.removeItem('bookTitle');
    };
  }, [bookTitle]);

  return (
    <AudioContext.Provider value={{ bookFile, setBookFile, bookPicture, setBookPicture, bookId, setBookId, bookTitle, setBookTitle }}>
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