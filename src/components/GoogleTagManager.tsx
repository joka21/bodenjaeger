'use client';

import Script from 'next/script';
import { useCookieConsent } from '@/contexts/CookieConsentContext';

const GTM_ID = 'GTM-MW5G8DXD';

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

// Pragmatischer Default: GTM laedt nur bei erteiltem Analytics-Consent.
// Spaeter umstellbar auf Consent Mode v2 (gtag('consent', 'update', ...)) —
// dann wuerde GTM immer laden, aber einzelne Tags warten auf Consent-Signale.
export default function GoogleTagManager() {
  const { isAllowed } = useCookieConsent();

  if (!isAllowed('analytics')) {
    return null;
  }

  return (
    <>
      <Script id="gtm-init" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
      </Script>
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>
    </>
  );
}
