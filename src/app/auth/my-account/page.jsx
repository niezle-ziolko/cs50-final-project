'use client';
import { useSession } from 'context/user-context';
import { useEffect, useState } from 'react';

export default function MyAccount() {
  const { user } = useSession();
  const [loadedUser, setLoadedUser] = useState(null);

  useEffect(() => {
    if (user) {
      setLoadedUser(user);
    }
  }, [user]);

  if (!loadedUser) {
    return <div>Ładowanie...</div>;
  }

  return <div>{loadedUser.id}</div>;
}

export const runtime = 'edge';