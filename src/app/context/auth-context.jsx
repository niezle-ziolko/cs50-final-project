'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const sessionCookie = Cookies.get('session');
    if (sessionCookie) {
      try {
        const userData = JSON.parse(sessionCookie);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing session cookie:', error);
      }
    }
  }, []);

  const updateUser = (sessionData) => {
    Cookies.set('session', JSON.stringify(sessionData), { expires: 7 });
    setUser(sessionData);
  };

  return (
    <AuthContext.Provider value={{ user, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
};