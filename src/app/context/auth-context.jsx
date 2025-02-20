'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

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
      };
    };

    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (!user && ['/auth/my-account', '/auth/library', '/auth/my-books'].includes(pathname)) {
        router.push('/auth/login');
      } else if (!user && pathname.startsWith('/auth/library/')) {
        router.push('/auth/login');
      } else if (user && ['/auth/login', '/auth/register'].includes(pathname)) {
        router.push('/auth/my-account');
      };
    };
  }, [user, pathname, router, isLoading]);

  const updateUser = (data) => {
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
  };

  const logoutUser = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('book-id');
    localStorage.removeItem('book-file');
    localStorage.removeItem('book-title');
    localStorage.removeItem('book-author');
    localStorage.removeItem('book-picture');
    localStorage.removeItem('book-description');
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