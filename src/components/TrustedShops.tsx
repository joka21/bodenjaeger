'use client';

import { useEffect } from 'react';
import { useCookieConsent } from '@/contexts/CookieConsentContext';

const TRUSTBADGE_ID = 'XC194F1E7AC0A4EF1D2945E1A065D9618';
const SCRIPT_ID = 'trustedshops-trustbadge';
const CONTENT_MAX_WIDTH = 1400;
const PADDING = 10;
const EXTRA_LEFT_OFFSET = 60;
const MOBILE_BREAKPOINT = 768;

const DATA_ATTRS: Record<string, string> = {
  'data-desktop-y-offset': '100',
  'data-mobile-y-offset': '80',
  'data-desktop-disable-reviews': 'false',
  'data-desktop-enable-custom': 'false',
  'data-desktop-position': 'left',
  'data-desktop-custom-width': '156',
  'data-desktop-enable-fadeout': 'false',
  'data-disable-mobile': 'false',
  'data-disable-trustbadge': 'false',
  'data-mobile-custom-width': '156',
  'data-mobile-disable-reviews': 'false',
  'data-mobile-enable-custom': 'false',
  'data-mobile-position': 'left',
  'data-mobile-enable-topbar': 'false',
  'data-mobile-enable-fadeout': 'true',
  'data-color-scheme': 'light',
};

function computeLeftOffset(viewport: number): number | null {
  if (viewport < MOBILE_BREAKPOINT) return null;
  if (viewport >= CONTENT_MAX_WIDTH + 2 * PADDING) {
    return (viewport - CONTENT_MAX_WIDTH) / 2 - PADDING + EXTRA_LEFT_OFFSET;
  }
  return PADDING + EXTRA_LEFT_OFFSET;
}

export default function TrustedShops() {
  const { isAllowed } = useCookieConsent();
  const allowed = isAllowed('functional');

  useEffect(() => {
    if (!allowed) return;

    if (!document.getElementById(SCRIPT_ID)) {
      const script = document.createElement('script');
      script.id = SCRIPT_ID;
      script.async = true;
      script.charset = 'UTF-8';
      script.src = `https://widgets.trustedshops.com/js/${TRUSTBADGE_ID}.js`;
      for (const [key, value] of Object.entries(DATA_ATTRS)) {
        script.setAttribute(key, value);
      }
      document.body.appendChild(script);
    }

    let container: HTMLElement | null = null;
    let observer: MutationObserver | null = null;

    const applyPosition = () => {
      if (!container) return;
      const offset = computeLeftOffset(window.innerWidth);
      container.style.removeProperty('right');
      if (offset === null) {
        container.style.removeProperty('left');
      } else {
        container.style.setProperty('left', `${offset}px`, 'important');
      }
    };

    const tryAttach = (): boolean => {
      const found = document.querySelector<HTMLElement>('[id^="trustbadge-container-"]');
      if (!found) return false;
      container = found;
      applyPosition();
      return true;
    };

    if (!tryAttach()) {
      observer = new MutationObserver(() => {
        if (tryAttach()) {
          observer?.disconnect();
          observer = null;
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }

    window.addEventListener('resize', applyPosition);

    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', applyPosition);
    };
  }, [allowed]);

  return null;
}
