'use client';

import { useEffect, useRef } from 'react';
import { useCookieConsent } from '@/contexts/CookieConsentContext';

const ROOMVO_SCRIPT_SRC = 'https://cdn.roomvo.com/static/scripts/b2b/bodenfachmarktjaegerde.js';
const ROOMVO_SCRIPT_ID = 'roomvo-script';

/**
 * Roomvo Raumvisualisierer - DSGVO-konform
 *
 * - Laedt das Script NUR, nachdem der Nutzer in der Kategorie
 *   "functional" eingewilligt hat (CookieConsentContext.isAllowed('functional')).
 * - Roomvo bietet (anders als TikTok ttq) keine grant/revoke-API.
 *   Daher: einmal geladen bleibt geladen. Bei Widerruf vor erstem Laden
 *   wird das Script schlicht nicht eingefuegt. Kein Teardown.
 * - Das Script wird nur ein einziges Mal eingefuegt (idempotent ueber
 *   useRef + Pruefung auf vorhandene Script-ID).
 */
export default function Roomvo() {
  const { isAllowed } = useCookieConsent();
  const functionalAllowed = isAllowed('functional');
  const isLoadedRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!functionalAllowed) return;
    if (isLoadedRef.current) return;

    const existing = document.getElementById(ROOMVO_SCRIPT_ID);
    if (existing) {
      isLoadedRef.current = true;
      return;
    }

    const script = document.createElement('script');
    script.id = ROOMVO_SCRIPT_ID;
    script.type = 'text/javascript';
    script.async = true;
    script.src = ROOMVO_SCRIPT_SRC;
    document.head.appendChild(script);
    isLoadedRef.current = true;
  }, [functionalAllowed]);

  return null;
}
