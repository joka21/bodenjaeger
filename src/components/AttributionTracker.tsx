'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useCookieConsent } from '@/contexts/CookieConsentContext';
import {
  loadAttribution,
  saveAttribution,
  clearAttribution,
  updateOnPageView,
} from '@/lib/attribution';

/**
 * Sammelt Attribution-Daten (UTM, Referrer, Session) gegated hinter
 * `analytics`-Consent. Bei Consent-Widerruf wird der lokale Eintrag
 * gelöscht. Re-evaluiert bei Pathname- oder Consent-Wechsel.
 *
 * Rendert nichts.
 */
export default function AttributionTracker() {
  const pathname = usePathname();
  const { isAllowed, consent } = useCookieConsent();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!isAllowed('analytics')) {
      clearAttribution();
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const hasUTM =
      !!params.get('utm_source') ||
      !!params.get('utm_medium') ||
      !!params.get('utm_campaign');

    const existing = loadAttribution();
    const updated = updateOnPageView(existing, hasUTM);
    saveAttribution(updated);
    // `consent` als Dep, damit auch ein Wechsel der Kategorien re-evaluiert
  }, [pathname, consent, isAllowed]);

  return null;
}
