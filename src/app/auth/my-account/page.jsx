'use client';
import { useSession } from 'context/user-context';


export default function MyAccount() {
  const { user } = useSession();

  if (!user) {
    return <div>Loading...</div>;
  };

  return <div>{user.id}</div>;
};

export const runtime = 'force-dynamic';