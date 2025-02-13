'use client';
import Link from 'next/link';
import Image from 'next/image';

import { useAuth } from 'context/auth-context';

import Switch from './buttons/switch';
import LogoIcon from 'styles/icons/logo';

import 'styles/css/header/theme.css';

export default function Header() {
  const { user } = useAuth();

  return (
    <header className='header'>
      <div className='element'>
        <div className='box'>
          <div>
            <Link href='/'>
              <LogoIcon />
            </Link>
          </div>
          {user ? (
            <>
              <Image className='picture' src={user?.photo} alt='profile-picture' width='70' height='70' />
            </>
          ) : (
            <>
              <Image className='picture' src='https://cdn.niezleziolko.app/final-project/profile-photo/default-profile-picture.webp' alt='profile-picture' width='70' height='70' />
            </>
          )}
        </div>
        <div className='box'>
          <div className='menu'>
            <Switch />
          </div>
        </div>
      </div>
    </header>
  );
};