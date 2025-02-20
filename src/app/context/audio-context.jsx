'use client';
import { createContext, useState, useContext, useEffect } from 'react';

const AudioContext = createContext({
  bookId: null,
  bookFile: null,
  bookTitle: null,
  bookAuthor: null,
  bookPicture: null,
  bookDescription: null,
  setBookId: () => {},
  setBookFile: () => {},
  setBookTitle: () => {},
  setBookAuthor: () => {},
  setBookPicture: () => {},
  setBookDescription: () => {}
});

const useLocalStorageState = (key, initialValue) => {
  const [state, setState] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key) || initialValue;
    };

    return initialValue;
  });

  useEffect(() => {
    if (state) {
      localStorage.setItem(key, state);
    } else {
      localStorage.removeItem(key);
    }
  }, [key, state]);

  return [state, setState];
};

export function AudioProvider({ children }) {
  const [bookId, setBookId] = useLocalStorageState('book-id', null);
  const [bookFile, setBookFile] = useLocalStorageState('book-file', null);
  const [bookTitle, setBookTitle] = useLocalStorageState('book-title', null);
  const [bookAuthor, setBookAuthor] = useLocalStorageState('book-author', null);
  const [bookPicture, setBookPicture] = useLocalStorageState('book-picture', null);
  const [bookDescription, setBookDescription] = useLocalStorageState('book-description', null);

  return (
    <AudioContext.Provider
      value={{
        bookId,
        setBookId,
        bookFile,
        setBookFile,
        bookTitle,
        setBookTitle,
        bookAuthor,
        setBookAuthor,
        bookPicture,
        setBookPicture,
        bookDescription,
        setBookDescription
      }}
    >
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