'use client';

import type { ReactNode } from 'react';
import { useCookieConsent } from '@/contexts/CookieConsentContext';

interface CookieSettingsLinkProps {
  /** Styling kommt vom Aufrufer — Footer-Spalte und Bottom-Bar nutzen denselben Button. */
  className?: string;
  /** Eigener Inhalt (z. B. Pfeil + Label). Ohne Angabe nur der Text. */
  children?: ReactNode;
}

/**
 * Öffnet das Consent-Layer. Muss ein <button> bleiben (kein <a href>), weil
 * es keine Zielseite gibt.
 */
export default function CookieSettingsLink({
  className,
  children,
}: CookieSettingsLinkProps) {
  const { openBanner } = useCookieConsent();

  return (
    <button type="button" onClick={openBanner} className={className}>
      {children ?? 'Cookie-Einstellungen'}
    </button>
  );
}
