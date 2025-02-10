'use client';
import { useSession } from 'context/user-context';


export default function Login() {
  const { user } = useSession();

  return (
    <div>{user.id}</div>
  );
};