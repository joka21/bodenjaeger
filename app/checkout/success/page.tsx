'use client';

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    // If no order ID is present, redirect to home
    if (!orderId) {
      router.push('/');
    }
  }, [orderId, router]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-6">
          <Link href="/" className="flex items-center space-x-2">
            <div className="font-bold text-2xl text-[#2e2d32]">Bodenjäger</div>
          </Link>
        </div>
      </header>

      {/* Success Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Success Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-[#4CAF50] rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          {/* Success Message */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#2e2d32] mb-4">
              Vielen Dank für Ihre Bestellung!
            </h1>
            <p className="text-lg text-gray-700 mb-2">
              Ihre Bestellung wurde erfolgreich aufgegeben.
            </p>
            {orderId && (
              <p className="text-gray-600">
                Bestellnummer: <span className="font-semibold text-[#2e2d32]">#{orderId}</span>
              </p>
            )}
          </div>

          {/* Order Confirmation Details */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-xl font-bold text-[#2e2d32] mb-6">Was passiert jetzt?</h2>

            <div className="space-y-6">
              {/* Step 1 */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-[#4CAF50] text-white rounded-full flex items-center justify-center font-semibold">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-[#2e2d32] mb-1">
                    Bestellbestätigung per E-Mail
                  </h3>
                  <p className="text-gray-600">
                    Sie erhalten in Kürze eine E-Mail mit allen Details zu Ihrer Bestellung.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-[#4CAF50] text-white rounded-full flex items-center justify-center font-semibold">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-[#2e2d32] mb-1">Bearbeitung</h3>
                  <p className="text-gray-600">
                    Wir bearbeiten Ihre Bestellung und bereiten den Versand vor.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-[#4CAF50] text-white rounded-full flex items-center justify-center font-semibold">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-[#2e2d32] mb-1">Versand</h3>
                  <p className="text-gray-600">
                    Sobald Ihre Bestellung versandt wurde, erhalten Sie eine Versandbestätigung mit
                    Tracking-Nummer.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-[#4CAF50] text-white rounded-full flex items-center justify-center font-semibold">
                  4
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-[#2e2d32] mb-1">Lieferung</h3>
                  <p className="text-gray-600">
                    Ihre Bestellung wird in den nächsten Tagen bei Ihnen eintreffen.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-[#2e2d32] mb-3">Wichtige Informationen</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 text-[#4CAF50] mr-2 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Überprüfen Sie Ihren Posteingang (auch den Spam-Ordner) für die
                Bestellbestätigung
              </li>
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 text-[#4CAF50] mr-2 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Sie haben 14 Tage Widerrufsrecht ab Erhalt der Ware
              </li>
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 text-[#4CAF50] mr-2 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Bei Fragen kontaktieren Sie uns jederzeit über unser Kontaktformular
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-8 py-3 bg-[#2e2d32] text-white font-semibold rounded-lg hover:bg-[#1e1d22] focus:outline-none focus:ring-4 focus:ring-[#2e2d32]/30 transition-all text-center"
            >
              Zurück zur Startseite
            </Link>
            <Link
              href="/products"
              className="px-8 py-3 bg-white text-[#2e2d32] font-semibold rounded-lg border-2 border-[#2e2d32] hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-[#2e2d32]/30 transition-all text-center"
            >
              Weiter einkaufen
            </Link>
          </div>

          {/* Support Info */}
          <div className="text-center mt-12 pt-8 border-t border-gray-200">
            <h3 className="font-semibold text-[#2e2d32] mb-2">Brauchen Sie Hilfe?</h3>
            <p className="text-gray-600 mb-4">
              Unser Kundenservice steht Ihnen gerne zur Verfügung.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
              <a
                href="mailto:support@bodenjaeger.de"
                className="text-[#4CAF50] hover:underline flex items-center justify-center"
              >
                <svg
                  className="w-5 h-5 mr-2"
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
                support@bodenjaeger.de
              </a>
              <a
                href="tel:+491234567890"
                className="text-[#4CAF50] hover:underline flex items-center justify-center"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                +49 123 456 7890
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
            <Link href="/agb" className="hover:text-[#2e2d32] transition-colors">
              AGB
            </Link>
            <Link href="/datenschutz" className="hover:text-[#2e2d32] transition-colors">
              Datenschutz
            </Link>
            <Link href="/widerruf" className="hover:text-[#2e2d32] transition-colors">
              Widerrufsbelehrung
            </Link>
            <Link href="/impressum" className="hover:text-[#2e2d32] transition-colors">
              Impressum
            </Link>
          </div>
          <div className="text-center text-sm text-gray-500 mt-4">
            © {new Date().getFullYear()} Bodenjäger. Alle Rechte vorbehalten.
          </div>
        </div>
      </footer>
    </div>
  );
}
