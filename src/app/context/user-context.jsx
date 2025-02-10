'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';


const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const storedSession = Cookies.get('session');
      if (storedSession) {
        setUser(JSON.parse(storedSession));
      }
    } catch (error) {
      console.error('Failed to parse session data:', error);
      Cookies.remove('session');
    };
  }, []);

  const saveSession = (setCookieHeader) => {
    try {
      const match = /session=({.*?})/.exec(setCookieHeader);
      if (match && match[1]) {
        const sessionData = JSON.parse(match[1]);
        Cookies.set('session', JSON.stringify(sessionData), { path: '/', secure: true, sameSite: 'Strict' });
        setUser(sessionData);
      }
    } catch (error) {
      console.error('Error parsing session data:', error);
    };
  };

  const clearSession = () => {
    Cookies.remove('session');
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