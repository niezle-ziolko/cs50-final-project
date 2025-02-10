'use client';
import { useContext, useEffect, memo } from 'react';

import Header from 'components/header';


function Layout({ children }) {
  const isBrowser = typeof window !== 'undefined';

  useEffect(() => {
    if (isBrowser) {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      };

      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

      if (isStandalone) {
        const viewportMeta = document.querySelector('meta[name="viewport"]');
        if (viewportMeta) {
          const content = viewportMeta.getAttribute('content');
          
          if (!content.includes('user-scalable=no')) {
            viewportMeta.setAttribute('content', `${content}, user-scalable=no`);
          };
        } else {
          const newViewportMeta = document.createElement('meta');
          newViewportMeta.name = 'viewport';
          newViewportMeta.content = 'width=device-width, initial-scale=1, user-scalable=no';
          document.head.appendChild(newViewportMeta);
        };
  
        const swipeBack = (e) => {
          if (e.touches[0].clientX < 30) {
            e.preventDefault();
          };
        };

        const orientationChange = (e) => {
          e.preventDefault();
        };

        const lockOrientation = async () => {
          try {
            await screen.orientation.lock('portrait');
          } catch (error) {
            console.error('Failed to lock orientation:', error);
          };
        };

        lockOrientation();

        window.addEventListener('touchstart', swipeBack, { passive: false });
        window.addEventListener('orientationchange', orientationChange, { passive: false });

        return () => {
          window.removeEventListener('touchstart', swipeBack);
          window.removeEventListener('orientationchange', orientationChange);
        };
      };
    };
  }, [isBrowser, isDarkMode, lang]);

  const onRedirectCallback = (appState) => {
    if (isBrowser) {
      const browserLanguage = navigator.language || navigator.userLanguage;
      const isPolish = browserLanguage.toLowerCase() === 'pl';
      const redirectPath = isPolish ? '/auth/pl/moje-konto' : '/auth/en/my-account';
    
      router.replace(appState?.returnTo || redirectPath, { replace: true });
    };
  };

  return (
    <Auth0Provider
      domain={process.env.NEXT_PUBLIC_AUTH_DOMAIN}
      clientId={process.env.NEXT_PUBLIC_AUTH_CLIENT_ID}
      cacheLocation='localstorage'
      useRefreshTokens={true}
      sessionCheckExpiryDays={30}
      onRedirectCallback={onRedirectCallback}
      authorizationParams={{
        redirect_uri: isBrowser ? window.location.origin : ''
      }}
    >
      <CouponProvider>
        <CartProvider>
              <Header isDarkMode={isDarkMode} isBrowser={isBrowser} lang={lang} />
              <main className={content.main}>{children}</main>
              <Footer isDarkMode={isDarkMode} lang={lang} />
        </CartProvider>
      </CouponProvider>
    </Auth0Provider>
  );
};

export default memo(Layout);