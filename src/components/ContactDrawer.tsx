'use client';

import { useEffect } from 'react';
import Link from 'next/link';

interface ContactDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactDrawer({ isOpen, onClose }: ContactDrawerProps) {
  // Escape key handler
  useEffect(() => {
    if (isOpen) {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleEscape);

      // Prevent body scroll when drawer is open
      document.body.style.overflow = 'hidden';

      return () => {
        window.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen, onClose]);

  // Check if currently open (Mo-Fr 9-18:30, Sa 9-14, So closed)
  const isCurrentlyOpen = () => {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 6 = Saturday
    const hour = now.getHours();
    const minutes = now.getMinutes();
    const currentTime = hour + minutes / 60;

    if (day === 0) return false; // Sonntag geschlossen
    if (day === 6) return currentTime >= 9 && currentTime < 14; // Samstag 9-14
    return currentTime >= 9 && currentTime < 18.5; // Mo-Fr 9-18:30
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 bottom-0 w-full md:w-[420px] bg-white z-50 shadow-2xl overflow-y-auto transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-drawer-title"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 id="contact-drawer-title" className="text-2xl font-bold text-[#2e2d32]">
            Kontakt
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:text-[#ed1b24] transition-colors rounded-full hover:bg-gray-100"
            aria-label="Kontakt schließen"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Intro Text */}
          <p className="text-base text-[#2e2d32]">
            Du brauchst Hilfe oder hast Fragen? Unser Team freut sich darauf, dir weiterzuhelfen!
          </p>

          {/* Availability Indicator */}
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <span
              className={`w-3 h-3 rounded-full ${
                isCurrentlyOpen() ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
            <span className="text-sm font-medium text-[#2e2d32]">
              {isCurrentlyOpen() ? 'Wir sind jetzt erreichbar' : 'Aktuell geschlossen'}
            </span>
          </div>

          {/* Call Section */}
          <div className="space-y-3 p-4 bg-[#f9f9fb] rounded-lg">
            <h3 className="text-lg font-bold text-[#2e2d32]">Ruf uns an:</h3>
            <p className="text-sm text-[#666666]">
              Unsere Experten beraten dich gerne persönlich.
            </p>
            <a
              href="tel:02433938884"
              className="text-3xl font-bold text-[#2e2d32] hover:text-[#ed1b24] transition-colors block"
            >
              02433 938884
            </a>
            <a
              href="tel:02433938884"
              className="inline-block w-full text-center bg-[#ed1b24] text-white px-6 py-3 rounded hover:bg-[#d11820] transition-colors shadow-sm hover:shadow-md font-medium"
            >
              Jetzt anrufen
            </a>
          </div>

          {/* Email Section */}
          <div className="space-y-3 p-4 bg-[#f9f9fb] rounded-lg">
            <h3 className="text-lg font-bold text-[#2e2d32]">Schreibe uns:</h3>
            <p className="text-sm text-[#666666]">
              Sende uns eine Nachricht, und wir antworten dir so schnell wie möglich.
            </p>
            <Link
              href="/kontakt"
              onClick={onClose}
              className="inline-block w-full text-center bg-[#ed1b24] text-white px-6 py-3 rounded hover:bg-[#d11820] transition-colors shadow-sm hover:shadow-md font-medium"
            >
              Zum Kontaktformular
            </Link>
          </div>

          {/* Opening Hours Section */}
          <div className="space-y-3 p-4 border border-gray-200 rounded-lg">
            <h3 className="text-lg font-bold text-[#2e2d32]">Service- und Beratungszeiten:</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#666666]">Mo. bis Fr.</span>
                <span className="font-medium text-[#2e2d32]">9:00 - 18:30 Uhr</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#666666]">Sa.</span>
                <span className="font-medium text-[#2e2d32]">9:00 - 14:00 Uhr</span>
              </div>
            </div>
          </div>

          {/* Additional Contact Options */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-[#2e2d32]">Weitere Kontaktmöglichkeiten:</h3>

            {/* Address */}
            <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <svg
                className="w-6 h-6 text-[#ed1b24] flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <div>
                <p className="font-medium text-[#2e2d32]">Fachmarkt Hückelhoven</p>
                <p className="text-sm text-[#666666]">Parkhofstraße 61</p>
                <p className="text-sm text-[#666666]">41836 Hückelhoven</p>
              </div>
            </div>

            {/* Email */}
            <a
              href="mailto:info@bodenjaeger.de"
              className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <svg
                className="w-6 h-6 text-[#ed1b24] flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <div>
                <p className="font-medium text-[#2e2d32]">E-Mail</p>
                <p className="text-sm text-[#ed1b24] hover:underline">info@bodenjaeger.de</p>
              </div>
            </a>
          </div>

          {/* Quick Links */}
          <div className="pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/fachmarkt-hueckelhoven"
                onClick={onClose}
                className="text-center px-4 py-2 border border-gray-300 rounded hover:border-[#ed1b24] hover:text-[#ed1b24] transition-colors text-sm font-medium"
              >
                Fachmarkt
              </Link>
              <Link
                href="/service"
                onClick={onClose}
                className="text-center px-4 py-2 border border-gray-300 rounded hover:border-[#ed1b24] hover:text-[#ed1b24] transition-colors text-sm font-medium"
              >
                Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
