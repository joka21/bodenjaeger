'use client';

import { useEffect, useRef } from 'react';

const ROOMVO_SCRIPT_SRC = 'https://cdn.roomvo.com/static/scripts/b2b/bodenfachmarktjaegerde.js';
const ROOMVO_SCRIPT_ID = 'roomvo-script';

/**
 * Roomvo Raumvisualisierer (3D-Bodenplaner)
 *
 * - Wird bewusst OHNE Cookie-Consent geladen: der Planer soll fuer jeden
 *   Besucher sofort sichtbar und nutzbar sein, auch vor einer Entscheidung
 *   im Cookie-Banner. (Vorher war das Script hinter isAllowed('functional')
 *   gated — dadurch war der Planer ohne Consent unsichtbar.)
 * - Das Script wird nur ein einziges Mal eingefuegt (idempotent ueber
 *   useRef + Pruefung auf vorhandene Script-ID).
 */
export default function Roomvo() {
  const isLoadedRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
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
  }, []);

  return null;
}
