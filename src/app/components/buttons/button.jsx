'use client';
import Link from 'next/link';

import { useTheme } from 'context/theme-context';

import 'styles/css/components/buttons/switch.css';


export default function Switch() {
  const { isDarkMode, setIsDarkMode } = useTheme();

  return (
    <div className='menu-container'>
      <ul className='menu-list'>
        <li className='menu-item'>
          <Link href={'/auth/login'} aria-label='login-page'>Sign in</Link>
        </li>
        /
        <li className='menu-item'>
          <Link href={'/auth/register'} aria-label='login-page'>Sign up</Link>
        </li>
      </ul>
      <div className='switch-wrapper'>
        <label className='switch'>
          <input 
            type="checkbox" 
            checked={isDarkMode} 
            onChange={() => setIsDarkMode(!isDarkMode)}
          />
          <span className='slider' />
        </label>
      </div>
    </div>
  );
};