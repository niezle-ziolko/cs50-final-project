'use client';
import { createContext, useContext, useEffect, useState } from 'react';

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedSession = localStorage.getItem('session');

    if (storedSession) {
      try {
        setUser(JSON.parse(storedSession));
      } catch (error) {
        console.error('Failed to parse session data:', error);
        localStorage.removeItem('session');
      };
    };
  }, []);

  const saveSession = (setCookieHeader) => {
    const match = setCookieHeader.match(/session=({.*?});/);

    if (match) {
      try {
        const sessionData = JSON.parse(match[1]);
        localStorage.setItem('session', JSON.stringify(sessionData));
        setUser(sessionData);
      } catch (error) {
        console.error('Error parsing session data:', error);
      };
    };
  };

  const clearSession = () => {
    localStorage.removeItem('session');
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