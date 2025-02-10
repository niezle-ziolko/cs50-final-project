'use client';
import { useEffect, useState } from 'react';

export default function MyAccount() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div>
      {user ? (
        <>
          <h1>Welcome, {user.username}!</h1>
          <p>Your ID: {user.id}</p>
        </>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};