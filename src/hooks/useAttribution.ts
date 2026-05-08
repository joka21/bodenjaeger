'use client';

import { useEffect, useState } from 'react';
import { loadAttribution, type AttributionData } from '@/lib/attribution';
import { useCookieConsent } from '@/contexts/CookieConsentContext';

/**
 * Liest Attribution-Daten aus dem localStorage. Liefert null, wenn
 * kein analytics-Consent vorliegt oder noch nichts gespeichert wurde.
 *
 * Verwendung im Checkout: `const attribution = useAttribution();`
 * → Wird mit dem create-order-Request mitgeschickt.
 */
export function useAttribution(): AttributionData | null {
  const [data, setData] = useState<AttributionData | null>(null);
  const { isAllowed, consent } = useCookieConsent();

  useEffect(() => {
    if (!isAllowed('analytics')) {
      setData(null);
      return;
    }
    setData(loadAttribution());
  }, [isAllowed, consent]);

  return data;
}
