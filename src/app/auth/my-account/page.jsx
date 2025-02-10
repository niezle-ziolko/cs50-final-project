'use client';
import { useSession } from 'context/user-context';

export default function MyAccount() {
  const { user } = useSession();

  if (typeof user === 'undefined') {
    return <div>Ładowanie...</div>;
  }

  return <div>{user?.id ?? 'Brak ID użytkownika'}</div>;
}

export const runtime = 'edge';