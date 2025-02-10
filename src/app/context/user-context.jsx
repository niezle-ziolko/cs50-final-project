'use client';
import { createContext, useContext, useEffect, useState } from 'react';

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedSession = localStorage.getItem('user');

    if (storedSession) {
      try {
        setUser(JSON.parse(storedSession));
      } catch (error) {
        console.error('Failed to parse session data:', error);
        localStorage.removeItem('user');
      };
    };
  }, []);

  const saveSession = (setCookieHeader) => {
    const match = setCookieHeader.match(/session=({.*?});/);

    if (match) {
      try {
        const sessionData = JSON.parse(match[1]);
        localStorage.setItem('user', JSON.stringify(sessionData));
        setUser(sessionData);
      } catch (error) {
        console.error('Error parsing session data:', error);
      };
    };
  };

  const clearSession = () => {
    localStorage.removeItem('user');
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