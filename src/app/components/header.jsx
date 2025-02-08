import Link from 'next/link';

import Switch from './button/button';

import LogoIcon from 'styles/icons/logo';

import 'styles/css/header/theme.css';


export default function Header() {
  return (
    <header className='header'>
      <div className='header-element'>
        <div className='header-box'>
          <div>
            <Link href='/'>
              <LogoIcon />
            </Link>
          </div>
        </div>
        <div className='header-box'>
          <div className='header-menu'>
            <Switch />
          </div>
        </div>
      </div>
    </header>
  );
};