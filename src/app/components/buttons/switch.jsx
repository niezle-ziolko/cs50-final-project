'use client';
import Link from 'next/link';

import { useAuth } from 'context/auth-context';
import { useTheme } from 'context/theme-context';

import 'styles/css/components/buttons/switch.css';


export default function Switch() {
  const { user, logoutUser } = useAuth();
  const { isDarkMode, setIsDarkMode } = useTheme();

  return (
    <div className='menu-container'>
      <ul className='menu-list'>
        {user ? (
          <>
            <li className='menu-item'>
              <Link href='/auth/library' aria-label='library-page'>Library</Link>
            </li>
            |
            <li className='menu-item'>
              <Link href='/auth/my-account' aria-label='account-page'>My account</Link>
            </li>
            |
            <li className='menu-item'>
              <Link href='/auth/my-books' aria-label='my-books-page'>My books</Link>
            </li>
            |
            <li className='menu-item'>
              <button 
                onClick={logoutUser} 
                aria-label='logout-page'
                className="logout-button"
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li className='menu-item'>
              <Link href='/auth/login' aria-label='login-page'>Sign in</Link>
            </li>
            |
            <li className='menu-item'>
              <Link href='/auth/register' aria-label='register-page'>Sign up</Link>
            </li>
          </>
        )}
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