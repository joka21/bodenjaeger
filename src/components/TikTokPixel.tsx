'use client';

import { useEffect, useRef } from 'react';
import { useCookieConsent } from '@/contexts/CookieConsentContext';

const TIKTOK_PIXEL_ID = 'D81DK7JC77U44OJJ3250';

declare global {
  interface Window {
    ttq?: {
      load: (id: string) => void;
      page: () => void;
      track: (event: string, params?: Record<string, unknown>) => void;
      identify: (params: Record<string, unknown>) => void;
      grantConsent?: () => void;
      revokeConsent?: () => void;
      holdConsent?: () => void;
      [key: string]: unknown;
    };
    TiktokAnalyticsObject?: string;
  }
}

/**
 * TikTok Pixel - DSGVO-konform
 *
 * - Laedt das Pixel-Script NUR, nachdem der Nutzer in der Kategorie
 *   "marketing" eingewilligt hat (CookieConsentContext.isAllowed('marketing')).
 * - Bei Widerruf nach erfolgter Einwilligung wird ttq.revokeConsent() aufgerufen.
 * - Bei erneuter Einwilligung nach Widerruf wird ttq.grantConsent() aufgerufen.
 * - Das Script wird nur ein einziges Mal eingefuegt (idempotent ueber Ref).
 */
export default function TikTokPixel() {
  const { isAllowed } = useCookieConsent();
  const marketingAllowed = isAllowed('marketing');
  const isLoadedRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Erstmaliges Laden: nur wenn Marketing erlaubt und noch nicht geladen
    if (marketingAllowed && !isLoadedRef.current) {
      const existing = document.getElementById('tiktok-pixel-base');
      if (existing) {
        isLoadedRef.current = true;
        return;
      }

      const script = document.createElement('script');
      script.id = 'tiktok-pixel-base';
      script.innerHTML = `
!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script")
;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
  ttq.load('${TIKTOK_PIXEL_ID}');
  ttq.page();
}(window, document, 'ttq');
      `;
      document.head.appendChild(script);
      isLoadedRef.current = true;
      return;
    }

    // Folgeaenderungen nach erstem Laden: grant / revoke
    if (isLoadedRef.current && window.ttq) {
      if (marketingAllowed) {
        window.ttq.grantConsent?.();
      } else {
        window.ttq.revokeConsent?.();
      }
    }
  }, [marketingAllowed]);

  return null;
}
