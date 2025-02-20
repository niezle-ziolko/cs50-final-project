'use client';
import { createContext, useState, useContext, useEffect } from 'react';

const AudioContext = createContext({
  bookFile: null,
  bookPicture: null,
  bookId: null,
  bookTitle: null,
  bookAuthor: null,
  bookDescription: null,
  setBookFile: () => {},
  setBookPicture: () => {},
  setBookId: () => {},
  setBookTitle: () => {},
  setBookAuthor: () => {},
  setBookDescription: () => {}
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
  
  const [bookAuthor, setBookAuthor] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('book-author') || null;
    };
    return null;
  });

  const [bookDescription, setBookDescription] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('book-description') || null;
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

  useEffect(() => {
    if (bookAuthor) {
      localStorage.setItem('book-author', bookAuthor);
    } else {
      localStorage.removeItem('book-author');
    };
  }, [bookAuthor]);

  useEffect(() => {
    if (bookDescription) {
      localStorage.setItem('book-description', bookDescription);
    } else {
      localStorage.removeItem('book-description');
    };
  }, [bookDescription]);

  return (
    <AudioContext.Provider value={{ bookFile, setBookFile, bookPicture, setBookPicture, bookId, setBookId, bookTitle, setBookTitle, bookAuthor, setBookAuthor, bookDescription, setBookDescription }}>
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