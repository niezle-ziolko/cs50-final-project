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
      return localStorage.getItem('book-file') || null;
    };
    return null;
  });

  const [bookPicture, setBookPicture] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('book-picture') || null;
    };
    return null;
  });

  const [bookId, setBookId] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('book-id') || null;
    };
    return null;
  });

  const [bookTitle, setBookTitle] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('book-title') || null;
    };
    return null;
  });

  useEffect(() => {
    if (bookFile) {
      localStorage.setItem('book-file', bookFile);
    } else {
      localStorage.removeItem('book-file');
    };
  }, [bookFile]);

  useEffect(() => {
    if (bookPicture) {
      localStorage.setItem('book-picture', bookPicture);
    } else {
      localStorage.removeItem('book-picture');
    };
  }, [bookPicture]);

  useEffect(() => {
    if (bookId) {
      localStorage.setItem('book-id', bookId);
    } else {
      localStorage.removeItem('book-id');
    };
  }, [bookId]);

  useEffect(() => {
    if (bookTitle) {
      localStorage.setItem('book-title', bookTitle);
    } else {
      localStorage.removeItem('book-title');
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