'use client';
import { useAuth } from 'context/auth-context';

import Spinner from './spinner';

export default function ClientPanel() {
  const { user } = useAuth();

  return (
    <div>
      {user ? (
        <>
          <h1>Welcome, {user.username}!</h1>
          <p>Your ID: {user.id}</p>
        </>
      ) : (
        <Spinner />
      )}
    </div>
  );
};