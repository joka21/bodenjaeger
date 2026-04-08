import { Metadata } from 'next';

// Block search engines from indexing this page
export const metadata: Metadata = {
  title: 'Todo | Bodenjäger',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function TodoPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg-light)' }}>
      <div className="content-container py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
            Projekt Todo-Liste
          </h1>
          <p style={{ color: 'var(--color-text-dark)' }}>
            Interne Aufgabenliste &bull; Letzte Aktualisierung: 8. April 2026
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
            <div className="text-3xl font-bold text-red-600 mb-1">5</div>
            <div className="text-sm" style={{ color: 'var(--color-text-dark)' }}>Kritisch</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
            <div className="text-3xl font-bold text-orange-600 mb-1">3</div>
            <div className="text-sm" style={{ color: 'var(--color-text-dark)' }}>Wichtig</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="text-3xl font-bold text-blue-600 mb-1">4</div>
            <div className="text-sm" style={{ color: 'var(--color-text-dark)' }}>Backend / WP</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <div className="text-3xl font-bold text-purple-600 mb-1">4</div>
            <div className="text-sm" style={{ color: 'var(--color-text-dark)' }}>Aufräumen</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="text-3xl font-bold text-green-600 mb-1">4</div>
            <div className="text-sm" style={{ color: 'var(--color-text-dark)' }}>Features</div>
          </div>
        </div>

        {/* 🔴 KRITISCH */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-4 h-4 rounded-full bg-red-500 flex-shrink-0"></span>
            <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
              Kritisch &mdash; Blocker für Live-Betrieb
            </h2>
          </div>

          <ul className="space-y-4">
            <li className="flex items-start gap-3 p-4 border-l-4 border-red-500 bg-red-50 rounded-r-lg">
              <input type="checkbox" disabled className="mt-1 w-5 h-5" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                    Gutschein-Button funktioniert nicht
                  </h3>
                  <span className="text-xs px-2 py-0.5 bg-red-600 text-white rounded">Frontend</span>
                </div>
                <p className="text-sm" style={{ color: 'var(--color-text-dark)' }}>
                  Der Gutschein-Button im Checkout hat keinen onClick-Handler. Codes werden nie angewendet.
                </p>
                <p className="text-xs mt-1 font-mono" style={{ color: 'var(--color-text-dark)' }}>
                  Datei: OrderSummary.tsx
                </p>
              </div>
            </li>

            <li className="flex items-start gap-3 p-4 border-l-4 border-red-500 bg-red-50 rounded-r-lg">
              <input type="checkbox" disabled className="mt-1 w-5 h-5" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                    Muster-Preise falsch nach Entfernen
                  </h3>
                  <span className="text-xs px-2 py-0.5 bg-red-600 text-white rounded">Frontend</span>
                </div>
                <p className="text-sm" style={{ color: 'var(--color-text-dark)' }}>
                  Wenn man ein gratis Muster entfernt, werden die Preise der übrigen Muster nicht neu berechnet (erste 3 gratis, danach 3&euro;).
                </p>
                <p className="text-xs mt-1 font-mono" style={{ color: 'var(--color-text-dark)' }}>
                  Datei: CartContext.tsx
                </p>
              </div>
            </li>

            <li className="flex items-start gap-3 p-4 border-l-4 border-red-500 bg-red-50 rounded-r-lg">
              <input type="checkbox" disabled className="mt-1 w-5 h-5" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                    Warenkorb wird vor Zahlung nicht geleert
                  </h3>
                  <span className="text-xs px-2 py-0.5 bg-red-600 text-white rounded">Frontend</span>
                </div>
                <p className="text-sm" style={{ color: 'var(--color-text-dark)' }}>
                  Nach Bestellerstellung wird der Warenkorb nicht sofort geleert &mdash; Doppelbestellungen möglich wenn Redirect fehlschlägt.
                </p>
                <p className="text-xs mt-1 font-mono" style={{ color: 'var(--color-text-dark)' }}>
                  Datei: checkout/page.tsx
                </p>
              </div>
            </li>

            <li className="flex items-start gap-3 p-4 border-l-4 border-red-500 bg-red-50 rounded-r-lg">
              <input type="checkbox" disabled className="mt-1 w-5 h-5" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                    removeFromCart() entfernt falsche Produkte
                  </h3>
                  <span className="text-xs px-2 py-0.5 bg-red-600 text-white rounded">Frontend</span>
                </div>
                <p className="text-sm" style={{ color: 'var(--color-text-dark)' }}>
                  Wenn dasselbe Produkt als Set-Item UND als Einzelprodukt im Warenkorb liegt, werden beide entfernt statt nur eins.
                </p>
                <p className="text-xs mt-1 font-mono" style={{ color: 'var(--color-text-dark)' }}>
                  Datei: CartContext.tsx
                </p>
              </div>
            </li>

            <li className="flex items-start gap-3 p-4 border-l-4 border-red-500 bg-red-50 rounded-r-lg">
              <input type="checkbox" disabled className="mt-1 w-5 h-5" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                    100+ console.log Statements im Code
                  </h3>
                  <span className="text-xs px-2 py-0.5 bg-red-600 text-white rounded">Frontend</span>
                </div>
                <p className="text-sm" style={{ color: 'var(--color-text-dark)' }}>
                  Debug-Logging überall im Produktionscode. Performance-Einbußen und mögliches Informationsleck.
                </p>
              </div>
            </li>
          </ul>
        </div>

        {/* 🟠 WICHTIG */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-4 h-4 rounded-full bg-orange-500 flex-shrink-0"></span>
            <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
              Wichtig &mdash; UX-Probleme
            </h2>
          </div>

          <ul className="space-y-4">
            <li className="flex items-start gap-3 p-4 border-l-4 border-orange-500 bg-orange-50 rounded-r-lg">
              <input type="checkbox" disabled className="mt-1 w-5 h-5" />
              <div className="flex-1">
                <h3 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  Versandkosten-Diskrepanz
                </h3>
                <p className="text-sm" style={{ color: 'var(--color-text-dark)' }}>
                  Warenkorb zeigt immer &quot;Kostenlos&quot;, aber beim Checkout kommen plötzlich bis zu 50&euro; Versandkosten. Kundenverwirrung.
                </p>
                <p className="text-xs mt-1 font-mono" style={{ color: 'var(--color-text-dark)' }}>
                  Dateien: cart-utils.ts vs. shippingConfig.ts
                </p>
              </div>
            </li>

            <li className="flex items-start gap-3 p-4 border-l-4 border-orange-500 bg-orange-50 rounded-r-lg">
              <input type="checkbox" disabled className="mt-1 w-5 h-5" />
              <div className="flex-1">
                <h3 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  Ersparnis wird nie angezeigt
                </h3>
                <p className="text-sm" style={{ color: 'var(--color-text-dark)' }}>
                  calculateSavings() gibt immer 0 zurück, obwohl Set-Angebote Rabatte bieten.
                </p>
                <p className="text-xs mt-1 font-mono" style={{ color: 'var(--color-text-dark)' }}>
                  Datei: cart-utils.ts
                </p>
              </div>
            </li>

            <li className="flex items-start gap-3 p-4 border-l-4 border-orange-500 bg-orange-50 rounded-r-lg">
              <input type="checkbox" disabled className="mt-1 w-5 h-5" />
              <div className="flex-1">
                <h3 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  Preis-Inkonsistenz Warenkorb vs. Checkout
                </h3>
                <p className="text-sm" style={{ color: 'var(--color-text-dark)' }}>
                  CartContext nutzt prices.price (Cents als String), OrderSummary nutzt price (Euro als Number). Mögliche Preisunterschiede.
                </p>
                <p className="text-xs mt-1 font-mono" style={{ color: 'var(--color-text-dark)' }}>
                  Dateien: CartContext.tsx vs. OrderSummary.tsx
                </p>
              </div>
            </li>
          </ul>
        </div>

        {/* 🔵 BACKEND / WORDPRESS */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-4 h-4 rounded-full bg-blue-500 flex-shrink-0"></span>
            <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
              Backend / WordPress
            </h2>
          </div>

          <ul className="space-y-4">
            <li className="flex items-start gap-3 p-4 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg">
              <input type="checkbox" disabled className="mt-1 w-5 h-5" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                    Bezahlarten in WooCommerce installieren
                  </h3>
                  <span className="text-xs px-2 py-0.5 bg-blue-600 text-white rounded">WordPress</span>
                </div>
                <p className="text-sm mb-2" style={{ color: 'var(--color-text-dark)' }}>
                  Nicht alle Bezahlarten sind im WordPress-Backend aktiviert/konfiguriert.
                </p>
                <ul className="text-xs space-y-1 ml-4 list-disc" style={{ color: 'var(--color-text-dark)' }}>
                  <li>Stripe Plugin installieren &amp; konfigurieren</li>
                  <li>PayPal Plugin installieren &amp; konfigurieren</li>
                  <li>Sofortüberweisung (Klarna) aktivieren</li>
                  <li>BACS (Banküberweisung) Kontodaten hinterlegen</li>
                </ul>
              </div>
            </li>

            <li className="flex items-start gap-3 p-4 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg">
              <input type="checkbox" disabled className="mt-1 w-5 h-5" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                    verrechnung Feld im Backend hinzufügen
                  </h3>
                  <span className="text-xs px-2 py-0.5 bg-blue-600 text-white rounded">WordPress</span>
                </div>
                <p className="text-sm" style={{ color: 'var(--color-text-dark)' }}>
                  Essentiell für Premium-Produkt Preisberechnung. Frontend hat Fallback, aber Backend sollte das Feld liefern.
                </p>
                <p className="text-xs mt-1 font-mono" style={{ color: 'var(--color-text-dark)' }}>
                  Doku: backend/VERRECHNUNG_FELD_BACKEND.md
                </p>
              </div>
            </li>

            <li className="flex items-start gap-3 p-4 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg">
              <input type="checkbox" disabled className="mt-1 w-5 h-5" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                    Newsletter-Endpoint fertigstellen
                  </h3>
                  <span className="text-xs px-2 py-0.5 bg-blue-600 text-white rounded">WordPress</span>
                </div>
                <p className="text-sm" style={{ color: 'var(--color-text-dark)' }}>
                  Newsletter-API gibt derzeit immer &quot;Erfolg&quot; zurück, auch wenn WordPress-Endpoint fehlt. Anmeldungen gehen verloren.
                </p>
              </div>
            </li>

            <li className="flex items-start gap-3 p-4 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg">
              <input type="checkbox" disabled className="mt-1 w-5 h-5" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                    Umzug auf neuen Vercel-Account &amp; WordPress-Backend
                  </h3>
                  <span className="text-xs px-2 py-0.5 bg-blue-600 text-white rounded">Infrastruktur</span>
                </div>
                <p className="text-sm" style={{ color: 'var(--color-text-dark)' }}>
                  Projekt muss auf neuen Vercel-Account und neues WordPress-Backend umziehen. Domain, Env-Variablen und API-URLs anpassen.
                </p>
              </div>
            </li>
          </ul>
        </div>

        {/* 🟣 AUFRÄUMEN */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-4 h-4 rounded-full bg-purple-500 flex-shrink-0"></span>
            <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
              Aufräumen &mdash; Tech Debt
            </h2>
          </div>

          <ul className="space-y-4">
            <li className="flex items-start gap-3 p-4 border-l-4 border-purple-500 bg-purple-50 rounded-r-lg">
              <input type="checkbox" disabled className="mt-1 w-5 h-5" />
              <div className="flex-1">
                <h3 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  CheckoutContext.tsx entfernen (Dead Code)
                </h3>
                <p className="text-sm" style={{ color: 'var(--color-text-dark)' }}>
                  Existiert aber ist nicht im Provider-Tree gemountet. Checkout-Page nutzt eigenes useState.
                </p>
              </div>
            </li>

            <li className="flex items-start gap-3 p-4 border-l-4 border-purple-500 bg-purple-50 rounded-r-lg">
              <input type="checkbox" disabled className="mt-1 w-5 h-5" />
              <div className="flex-1">
                <h3 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  adapters.ts entfernen oder aktualisieren
                </h3>
                <p className="text-sm" style={{ color: 'var(--color-text-dark)' }}>
                  Liest veraltete jaeger_meta.* Pfade statt Root-Level Felder. Migrations-Artefakt.
                </p>
              </div>
            </li>

            <li className="flex items-start gap-3 p-4 border-l-4 border-purple-500 bg-purple-50 rounded-r-lg">
              <input type="checkbox" disabled className="mt-1 w-5 h-5" />
              <div className="flex-1">
                <h3 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  Test-Order Route entfernen
                </h3>
                <p className="text-sm" style={{ color: 'var(--color-text-dark)' }}>
                  Development-Endpoint api/test-order erstellt Dummy-Bestellungen. In Produktion blockiert, aber sollte entfernt werden.
                </p>
              </div>
            </li>

            <li className="flex items-start gap-3 p-4 border-l-4 border-purple-500 bg-purple-50 rounded-r-lg">
              <input type="checkbox" disabled className="mt-1 w-5 h-5" />
              <div className="flex-1">
                <h3 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  Unused Variables bereinigen (ESLint Warnings)
                </h3>
                <p className="text-sm" style={{ color: 'var(--color-text-dark)' }}>
                  Nicht verwendete Variablen in ProductPageContent.tsx, SetAngebot.tsx, konto/adressen/page.tsx.
                </p>
              </div>
            </li>
          </ul>
        </div>

        {/* 🟢 FEATURES */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-4 h-4 rounded-full bg-green-500 flex-shrink-0"></span>
            <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
              Fehlende Features
            </h2>
          </div>

          <ul className="space-y-4">
            <li className="flex items-start gap-3 p-4 border-l-4 border-green-500 bg-green-50 rounded-r-lg">
              <input type="checkbox" disabled className="mt-1 w-5 h-5" />
              <div className="flex-1">
                <h3 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  Produkt-Suche &amp; Filter
                </h3>
                <p className="text-sm" style={{ color: 'var(--color-text-dark)' }}>
                  Filter nach Preis, Farbe, Eigenschaften, Verfügbarkeit fehlen komplett.
                </p>
              </div>
            </li>

            <li className="flex items-start gap-3 p-4 border-l-4 border-green-500 bg-green-50 rounded-r-lg">
              <input type="checkbox" disabled className="mt-1 w-5 h-5" />
              <div className="flex-1">
                <h3 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  Kategorieseiten Pagination &amp; Sortierung
                </h3>
                <p className="text-sm" style={{ color: 'var(--color-text-dark)' }}>
                  Pagination, Sortieroptionen und Grid/Listen-Ansicht fehlen.
                </p>
              </div>
            </li>

            <li className="flex items-start gap-3 p-4 border-l-4 border-green-500 bg-green-50 rounded-r-lg">
              <input type="checkbox" disabled className="mt-1 w-5 h-5" />
              <div className="flex-1">
                <h3 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  SEO Structured Data (JSON-LD)
                </h3>
                <p className="text-sm" style={{ color: 'var(--color-text-dark)' }}>
                  Produkt-Schema, Breadcrumbs, Organisation &mdash; für bessere Google-Darstellung.
                </p>
              </div>
            </li>

            <li className="flex items-start gap-3 p-4 border-l-4 border-green-500 bg-green-50 rounded-r-lg">
              <input type="checkbox" disabled className="mt-1 w-5 h-5" />
              <div className="flex-1">
                <h3 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  Bewertungen / Produktrezensionen
                </h3>
                <p className="text-sm" style={{ color: 'var(--color-text-dark)' }}>
                  Kundenbewertungen auf Produktseiten anzeigen und neue Bewertungen ermöglichen.
                </p>
              </div>
            </li>
          </ul>
        </div>

        {/* Footer Note */}
        <div className="bg-gray-100 rounded-lg p-6 text-center">
          <p className="text-sm" style={{ color: 'var(--color-text-dark)' }}>
            Diese Seite ist nicht öffentlich und wird von Suchmaschinen nicht indexiert.
          </p>
        </div>
      </div>
    </div>
  );
}
