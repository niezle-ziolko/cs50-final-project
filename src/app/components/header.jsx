import { memo } from 'react';

import LogoIcon from 'styles/icons/logo';

import { header } from 'styles/css/header/theme.css';


function Header() {

  return (
    <header className={header.header}>
      <div className={header.box}>
        <div>
          <LogoIcon />
        </div>
      </div>
      <div className={header.box}>
        <div className={header.menu}>
          <i className="fa-solid fa-bars"></i>
        </div>
      </div>
    </header>
  );
};

export default memo(Header);