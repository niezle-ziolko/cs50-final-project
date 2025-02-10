import localFont from 'next/font/local';

import { ThemeProvider } from 'context/theme-context';

import Layout from 'components/layout';

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
  description: 'A universe that speak to you',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={`${lucidaFax.variable} ${comicSans.variable}`}>
        <ThemeProvider>
          <Layout>
            {children}
          </Layout>
        </ThemeProvider>
      </body>
    </html>
  );
};