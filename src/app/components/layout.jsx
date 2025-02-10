'use client';
import { memo } from 'react';

import { SessionProvider } from 'context/user-context';

import Header from 'components/header';


function Layout({ children }) {
  return (
    <SessionProvider>
      <Header />
      <main>{children}</main>
    </SessionProvider>
  );
};

export default memo(Layout);