'use client';
import { useSession } from 'context/user-context';

export default function MyAccount() {
  const { user } = useSession();

  return <div>{user?.id ?? 'Brak ID użytkownika'}</div>;
}

export const runtime = 'edge';