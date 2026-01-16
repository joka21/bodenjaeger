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
            Interne Aufgabenliste • Letzte Aktualisierung: 12. Januar 2026
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
            <div className="text-3xl font-bold text-red-600 mb-1">3</div>
            <div className="text-sm" style={{ color: 'var(--color-text-dark)' }}>Kritisch</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
            <div className="text-3xl font-bold text-orange-600 mb-1">3</div>
            <div className="text-sm" style={{ color: 'var(--color-text-dark)' }}>Wichtig</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
            <div className="text-3xl font-bold text-yellow-600 mb-1">7</div>
            <div className="text-sm" style={{ color: 'var(--color-text-dark)' }}>Design & UX</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="text-3xl font-bold text-green-600 mb-1">4</div>
            <div className="text-sm" style={{ color: 'var(--color-text-dark)' }}>Nice-to-have</div>
          </div>
        </div>

        {/* 🔴 KRITISCH */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">🔴</span>
            <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
              Kritisch (Blocker für Launch)
            </h2>
          </div>

          <ul className="space-y-4">
            <li className="flex items-start gap-3 p-4 border-l-4 border-red-500 bg-red-50 rounded-r-lg">
              <input type="checkbox" className="mt-1 w-5 h-5" style={{ accentColor: 'var(--color-primary)' }} />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                    WooCommerce Checkout-Integration
                  </h3>
                  <span className="text-xs px-2 py-1 bg-red-600 text-white rounded">Aufwand: Hoch</span>
                </div>
                <p className="text-sm mb-2" style={{ color: 'var(--color-text-dark)' }}>
                  Backend-Integration für Bestellprozess komplett fehlt
                </p>
                <ul className="text-xs space-y-1 ml-4 list-disc" style={{ color: 'var(--color-text-dark)' }}>
                  <li>Warenkorb → WooCommerce Order Sync</li>
                  <li>Order-Erstellung über WooCommerce API</li>
                  <li>Zahlungs-Gateway Integration (PayPal, Stripe, etc.)</li>
                  <li>E-Mail Bestellbestätigungen</li>
                </ul>
              </div>
            </li>

            <li className="flex items-start gap-3 p-4 border-l-4 border-red-500 bg-red-50 rounded-r-lg">
              <input type="checkbox" className="mt-1 w-5 h-5" style={{ accentColor: 'var(--color-primary)' }} />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                    "In den Warenkorb" Button implementieren
                  </h3>
                  <span className="text-xs px-2 py-1 bg-orange-600 text-white rounded">Aufwand: Niedrig</span>
                </div>
                <p className="text-sm" style={{ color: 'var(--color-text-dark)' }}>
                  Button auf Produktseite fehlt komplett. Set-Angebote können nicht in Warenkorb gelegt werden.
                </p>
              </div>
            </li>

            <li className="flex items-start gap-3 p-4 border-l-4 border-red-500 bg-red-50 rounded-r-lg">
              <input type="checkbox" className="mt-1 w-5 h-5" style={{ accentColor: 'var(--color-primary)' }} />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                    Backend: verrechnung Feld hinzufügen
                  </h3>
                  <span className="text-xs px-2 py-1 bg-yellow-600 text-white rounded">Aufwand: Mittel</span>
                </div>
                <p className="text-sm" style={{ color: 'var(--color-text-dark)' }}>
                  Essentiell für Premium-Produkt Preisberechnung. Frontend hat Fallback, aber Backend sollte liefern.
                  <br />
                  <span className="text-xs italic">Siehe: backend/VERRECHNUNG_FELD_BACKEND.md</span>
                </p>
              </div>
            </li>
          </ul>
        </div>

        {/* 🟠 WICHTIG */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">🟠</span>
            <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
              Wichtig (Für professionellen Launch)
            </h2>
          </div>

          <ul className="space-y-4">
            <li className="flex items-start gap-3 p-4 border-l-4 border-orange-500 bg-orange-50 rounded-r-lg">
              <input type="checkbox" className="mt-1 w-5 h-5" style={{ accentColor: 'var(--color-primary)' }} />
              <div className="flex-1">
                <h3 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  Produkt-Suche & Filter
                </h3>
                <p className="text-sm" style={{ color: 'var(--color-text-dark)' }}>
                  Filter nach Preis, Farbe, Eigenschaften, Verfügbarkeit fehlen komplett
                </p>
              </div>
            </li>

            <li className="flex items-start gap-3 p-4 border-l-4 border-orange-500 bg-orange-50 rounded-r-lg">
              <input type="checkbox" className="mt-1 w-5 h-5" style={{ accentColor: 'var(--color-primary)' }} />
              <div className="flex-1">
                <h3 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  Kategorieseiten optimieren
                </h3>
                <p className="text-sm" style={{ color: 'var(--color-text-dark)' }}>
                  Pagination, Sortierung, Grid/Listen-Ansicht fehlen
                </p>
              </div>
            </li>

            <li className="flex items-start gap-3 p-4 border-l-4 border-orange-500 bg-orange-50 rounded-r-lg">
              <input type="checkbox" className="mt-1 w-5 h-5" style={{ accentColor: 'var(--color-primary)' }} />
              <div className="flex-1">
                <h3 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  SEO Optimierung
                </h3>
                <p className="text-sm" style={{ color: 'var(--color-text-dark)' }}>
                  Structured Data (JSON-LD), vollständige Meta-Tags, Sitemap.xml
                </p>
              </div>
            </li>
          </ul>
        </div>

        {/* 🎨 DESIGN & UX */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">🎨</span>
            <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
              Design & UX Verbesserungen
            </h2>
          </div>

          <ul className="space-y-4">
            <li className="flex items-start gap-3 p-4 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg">
              <input type="checkbox" className="mt-1 w-5 h-5" style={{ accentColor: 'var(--color-primary)' }} />
              <div className="flex-1">
                <h3 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  Miniwarenkorb nach Vorlage anpassen
                </h3>
                <p className="text-sm" style={{ color: 'var(--color-text-dark)' }}>
                  Mini-Cart Dropdown im Header mit Design der Vorlage
                </p>
              </div>
            </li>

            <li className="flex items-start gap-3 p-4 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg">
              <input type="checkbox" className="mt-1 w-5 h-5" style={{ accentColor: 'var(--color-primary)' }} />
              <div className="flex-1">
                <h3 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  Startseite letzte Section
                </h3>
                <p className="text-sm" style={{ color: 'var(--color-text-dark)' }}>
                  Letzte Section auf der Startseite erstellen/anpassen
                </p>
              </div>
            </li>

            <li className="flex items-start gap-3 p-4 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg">
              <input type="checkbox" className="mt-1 w-5 h-5" style={{ accentColor: 'var(--color-primary)' }} />
              <div className="flex-1">
                <h3 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  Einzelproduktansicht anpassen
                </h3>
                <p className="text-sm" style={{ color: 'var(--color-text-dark)' }}>
                  Unterschiedliche Ansichten: Böden (mit Set-Angebot) vs. Zubehör (einfache Ansicht)
                </p>
              </div>
            </li>

            <li className="flex items-start gap-3 p-4 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg">
              <input type="checkbox" className="mt-1 w-5 h-5" style={{ accentColor: 'var(--color-primary)' }} />
              <div className="flex-1">
                <h3 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  Design-Anpassungen Mobile Set-Ansicht
                </h3>
                <p className="text-sm mb-2" style={{ color: 'var(--color-text-dark)' }}>
                  Set-Angebot Mobile optimieren:
                </p>
                <ul className="text-xs space-y-1 ml-4 list-disc" style={{ color: 'var(--color-text-dark)' }}>
                  <li>Badge: Roter kompakter Badge mit abgerundeten Ecken</li>
                  <li>Produktbilder: Quadratisch und größer im Verhältnis</li>
                  <li>Preise: Streichpreis grau, Rabattpreis rot, rechtsbündig</li>
                  <li>Rabatt-Badge: Kleine rote Pille (z.B. "-21%") neben Preis</li>
                  <li>Trennlinien: Klare horizontale Linien zwischen Produkten</li>
                  <li>Button: Grüner "In den Warenkorb"-Button, volle Breite</li>
                </ul>
              </div>
            </li>

            <li className="flex items-start gap-3 p-4 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg">
              <input type="checkbox" className="mt-1 w-5 h-5" style={{ accentColor: 'var(--color-primary)' }} />
              <div className="flex-1">
                <h3 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  Mobile Optimierung allgemein
                </h3>
                <p className="text-sm" style={{ color: 'var(--color-text-dark)' }}>
                  Touch-Gestures, Mobile Filter-Drawer, iOS/Android spezifische Fixes
                </p>
              </div>
            </li>

            <li className="flex items-start gap-3 p-4 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg">
              <input type="checkbox" className="mt-1 w-5 h-5" style={{ accentColor: 'var(--color-primary)' }} />
              <div className="flex-1">
                <h3 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  Unterseiten alle fertigstellen
                </h3>
                <p className="text-sm" style={{ color: 'var(--color-text-dark)' }}>
                  Alle Unterseiten finalisieren und Content prüfen (AGB, Impressum, etc.)
                </p>
              </div>
            </li>

            <li className="flex items-start gap-3 p-4 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg">
              <input type="checkbox" className="mt-1 w-5 h-5" style={{ accentColor: 'var(--color-primary)' }} />
              <div className="flex-1">
                <h3 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  Warenkorb-Features erweitern
                </h3>
                <p className="text-sm" style={{ color: 'var(--color-text-dark)' }}>
                  Gutschein-Codes, Versandkosten-Berechnung, Cross-Sell Produkte
                </p>
              </div>
            </li>
          </ul>
        </div>

        {/* ⚙️ TECHNICAL */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">⚙️</span>
            <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
              Technische Qualität
            </h2>
          </div>

          <ul className="space-y-4">
            <li className="flex items-start gap-3 p-4 border-l-4 border-purple-500 bg-purple-50 rounded-r-lg">
              <input type="checkbox" className="mt-1 w-5 h-5" style={{ accentColor: 'var(--color-primary)' }} />
              <div className="flex-1">
                <h3 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  Preisberechnung kontrollieren
                </h3>
                <p className="text-sm" style={{ color: 'var(--color-text-dark)' }}>
                  Alle Set-Angebot Kalkulationen prüfen und verifizieren
                </p>
              </div>
            </li>

            <li className="flex items-start gap-3 p-4 border-l-4 border-purple-500 bg-purple-50 rounded-r-lg">
              <input type="checkbox" className="mt-1 w-5 h-5" style={{ accentColor: 'var(--color-primary)' }} />
              <div className="flex-1">
                <h3 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  Einheiten kontrollieren
                </h3>
                <p className="text-sm" style={{ color: 'var(--color-text-dark)' }}>
                  Alle Produkteinheiten (m², Stk., lfm) überprüfen und vereinheitlichen
                </p>
              </div>
            </li>

            <li className="flex items-start gap-3 p-4 border-l-4 border-purple-500 bg-purple-50 rounded-r-lg">
              <input type="checkbox" className="mt-1 w-5 h-5" style={{ accentColor: 'var(--color-primary)' }} />
              <div className="flex-1">
                <h3 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  TypeScript Fehler beheben
                </h3>
                <p className="text-sm" style={{ color: 'var(--color-text-dark)' }}>
                  PageProps Error in category/[slug]/page.tsx:17 fixen
                </p>
              </div>
            </li>

            <li className="flex items-start gap-3 p-4 border-l-4 border-purple-500 bg-purple-50 rounded-r-lg">
              <input type="checkbox" className="mt-1 w-5 h-5" style={{ accentColor: 'var(--color-primary)' }} />
              <div className="flex-1">
                <h3 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  Testing Setup
                </h3>
                <p className="text-sm" style={{ color: 'var(--color-text-dark)' }}>
                  Unit Tests für setCalculations.ts, E2E Tests für Checkout-Flow
                </p>
              </div>
            </li>
          </ul>
        </div>

        {/* Documentation Link */}
        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">📚</span>
            <div>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                Vollständige Dokumentation
              </h3>
              <p className="text-sm mb-2" style={{ color: 'var(--color-text-dark)' }}>
                Für detaillierte Informationen zu allen Features, Aufwänden und Priorisierungen:
              </p>
              <code className="text-xs bg-white px-3 py-1 rounded" style={{ color: 'var(--color-text-primary)' }}>
                FEHLENDE_FEATURES.md
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
