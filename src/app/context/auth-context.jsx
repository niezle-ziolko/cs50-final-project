'use client';
import { createContext, useContext, useState, useEffect } from 'react';


const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        const expiresDate = new Date(userData.expiresDate);
        const currentDate = new Date();

        const diffTime = currentDate - expiresDate;
        const diffDays = diffTime / (1000 * 3600 * 24);

        if (diffDays > 7) {
          localStorage.removeItem('user');
          setUser(null);
        } else {
          setUser(userData);
        }
      } catch (error) {
        console.error('Error parsing session data:', error);
      }
    }
  }, []);

  const updateUser = (data) => {
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
  };

  const logoutUser = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, updateUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
};