'use client';
import { memo } from 'react';

import { AuthProvider } from 'context/auth-context';

import Header from 'components/header';


function Layout({ children }) {
  return (
    <AuthProvider>
      <Header />
      <main>{children}</main>
    </AuthProvider>
  );
};

export default memo(Layout);