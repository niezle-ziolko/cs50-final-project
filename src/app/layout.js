import Script from 'next/script';
import localFont from 'next/font/local';

import { AuthProvider } from 'context/auth-context';
import { AudioProvider } from 'context/audio-context';
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
      <head>
        <link rel='stylesheet' href='https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free/css/all.min.css' />
        <Script src='https://cdn.jsdelivr.net/npm/media-chrome@3/+esm' type='module' strategy='afterInteractive' />
      </head>
      <body className={`${lucidaFax.variable} ${comicSans.variable}`}>
        <ThemeProvider>
          <AuthProvider>
            <AudioProvider>
              <Header />
              <main>{children}</main>
            </AudioProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
};