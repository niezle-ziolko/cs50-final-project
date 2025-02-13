import localFont from 'next/font/local';

import { AuthProvider } from 'context/auth-context';
import { ThemeProvider } from 'context/theme-context';

import Header from 'components/header';

import 'styles/css/theme/theme.css';

const comicSans = localFont({
  src: '../styles/fonts/comic-sans-ms.woff', 
  variable: '--font-comic-sans-ms'
});

const lucidaFax = localFont({
  src: '../styles/fonts/lucida-fax-regular-v2.woff',
  variable: '--font-lucida-fax'
});

export const metadata = {
  title: 'EchoVerse',
  description: 'A universe that speak to you'
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={`${lucidaFax.variable} ${comicSans.variable}`}>
        <ThemeProvider>
          <AuthProvider>
            <Header />
            <main>{children}</main>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
};