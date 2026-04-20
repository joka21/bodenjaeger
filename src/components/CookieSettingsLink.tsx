'use client';

import { useCookieConsent } from '@/contexts/CookieConsentContext';

export default function CookieSettingsLink() {
  const { openBanner } = useCookieConsent();

  return (
    <button
      type="button"
      onClick={openBanner}
      className="text-xl hover:underline flex items-start text-left"
    >
      <span className="mr-2">&gt;</span>
      <span>Cookie-Einstellungen</span>
    </button>
  );
}
