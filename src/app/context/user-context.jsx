'use client';
import { createContext, useContext, useEffect, useState } from 'react';

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const storedSession = localStorage.getItem('session');
        if (storedSession) {
          setUser(JSON.parse(storedSession));
        }
      }
    } catch (error) {
      console.error('Failed to parse session data:', error);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('session');
      }
    }
  }, []);

  const saveSession = (setCookieHeader) => {
    try {
      const match = /session=({.*?})/.exec(setCookieHeader);
      if (match && match[1]) {
        const sessionData = JSON.parse(match[1]);
        if (typeof window !== 'undefined') {
          localStorage.setItem('session', JSON.stringify(sessionData));
        }
        setUser(sessionData);
      }
    } catch (error) {
      console.error('Error parsing session data:', error);
    }
  };

  const clearSession = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('session');
    }
    setUser(null);
  };

  return (
    <SessionContext.Provider value={{ user, saveSession, clearSession }}>
      {children}
    </SessionContext.Provider>
  );
};

export function useSession() {
  return useContext(SessionContext);
};
