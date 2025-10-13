import StandardProductCard from '@/components/StandardProductCard';
import { mockProducts } from '@/lib/mock-products';

/**
 * Showcase-Seite für StandardProductCard Komponente
 *
 * Route: /product-cards
 *
 * Zeigt alle verfügbaren Produktkarten-Varianten mit verschiedenen:
 * - Rabatt-Stufen
 * - Aktions-Badges
 * - Preisstrukturen
 * - Bild-Anzahlen
 * - Einheiten (m², lfm)
 */
export default function ProductCardsShowcase() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Standard-Produktkarten
          </h1>
          <p className="text-gray-600">
            Showcase aller StandardProductCard-Varianten für den Bodenjäger Shop
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Statistiken */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl font-bold text-red-600 mb-2">
              {mockProducts.length}
            </div>
            <div className="text-sm text-gray-600">Gesamt Produkte</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {mockProducts.filter((p) => p._show_setangebot === 'yes').length}
            </div>
            <div className="text-sm text-gray-600">Set-Angebote</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {mockProducts.filter((p) => p._aktion).length}
            </div>
            <div className="text-sm text-gray-600">Mit Aktion</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {Math.max(
                ...mockProducts.map((p) => p._setangebot_ersparnis_prozent || 0)
              )}
              %
            </div>
            <div className="text-sm text-gray-600">Max. Rabatt</div>
          </div>
        </div>

        {/* Sektion: Alle Produkte */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Alle Produktkarten
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mockProducts.map((product) => (
              <StandardProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Sektion: Hohe Rabatte */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Produkte mit hohem Rabatt (&gt; 25%)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mockProducts
              .filter((p) => (p._setangebot_ersparnis_prozent || 0) > 25)
              .map((product) => (
                <StandardProductCard key={product.id} product={product} />
              ))}
          </div>
        </section>

        {/* Sektion: Aktions-Produkte */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Produkte mit Aktions-Badge
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mockProducts
              .filter((p) => p._aktion)
              .map((product) => (
                <StandardProductCard key={product.id} product={product} />
              ))}
          </div>
        </section>

        {/* Sektion: Laufmeter Produkte */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Laufmeter-Produkte (Sockelleisten)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mockProducts
              .filter((p) => p._einheit_short === 'lfm')
              .map((product) => (
                <StandardProductCard key={product.id} product={product} />
              ))}
          </div>
        </section>

        {/* Sektion: Responsive Demo */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Responsive Layout Demo
          </h2>
          <div className="space-y-8">
            {/* Mobile (1 Spalte) */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Mobile (1 Spalte)
              </h3>
              <div className="grid grid-cols-1 gap-6 max-w-md">
                <StandardProductCard product={mockProducts[0]} />
              </div>
            </div>

            {/* Tablet (2 Spalten) */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Tablet (2 Spalten)
              </h3>
              <div className="grid grid-cols-2 gap-6 max-w-3xl">
                <StandardProductCard product={mockProducts[0]} />
                <StandardProductCard product={mockProducts[1]} />
              </div>
            </div>

            {/* Desktop (3 Spalten) */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Desktop (3 Spalten)
              </h3>
              <div className="grid grid-cols-3 gap-6 max-w-5xl">
                <StandardProductCard product={mockProducts[0]} />
                <StandardProductCard product={mockProducts[1]} />
                <StandardProductCard product={mockProducts[2]} />
              </div>
            </div>

            {/* Large Desktop (4 Spalten) */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Large Desktop (4 Spalten)
              </h3>
              <div className="grid grid-cols-4 gap-6">
                <StandardProductCard product={mockProducts[0]} />
                <StandardProductCard product={mockProducts[1]} />
                <StandardProductCard product={mockProducts[2]} />
                <StandardProductCard product={mockProducts[3]} />
              </div>
            </div>
          </div>
        </section>

        {/* Feature-Liste */}
        <section className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Implementierte Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <svg
                className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <div className="font-semibold text-gray-900">Multi-Image Slider</div>
                <div className="text-sm text-gray-600">
                  Prev/Next Navigation mit Hover-Effekt
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <svg
                className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <div className="font-semibold text-gray-900">Badge-System</div>
                <div className="text-sm text-gray-600">
                  Rabatt-Badge + Aktions-Badge (überlagert)
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <svg
                className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <div className="font-semibold text-gray-900">
                  Deutsche Preisformatierung
                </div>
                <div className="text-sm text-gray-600">XX,XX € mit Komma</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <svg
                className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <div className="font-semibold text-gray-900">Responsive Design</div>
                <div className="text-sm text-gray-600">
                  1-4 Spalten Grid je nach Viewport
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <svg
                className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <div className="font-semibold text-gray-900">Hover-Effekte</div>
                <div className="text-sm text-gray-600">
                  Shadow + Navigation-Pfeile bei Hover
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <svg
                className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <div className="font-semibold text-gray-900">
                  TypeScript Interfaces
                </div>
                <div className="text-sm text-gray-600">
                  Vollständig typisiert nach Backend-Doku
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <svg
                className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <div className="font-semibold text-gray-900">
                  Klickbare Produktkarte
                </div>
                <div className="text-sm text-gray-600">
                  Link zu /products/[slug]
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <svg
                className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <div className="font-semibold text-gray-900">Line Clamp</div>
                <div className="text-sm text-gray-600">
                  Produktname auf 2 Zeilen begrenzt
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Technische Details */}
        <section className="bg-gray-900 text-white p-8 rounded-lg shadow-md mt-12">
          <h2 className="text-2xl font-bold mb-6">Technische Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h3 className="font-semibold text-lg mb-3 text-red-400">
                Komponenten
              </h3>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <code className="bg-gray-800 px-2 py-1 rounded">
                    StandardProductCard.tsx
                  </code>
                </li>
                <li>
                  <code className="bg-gray-800 px-2 py-1 rounded">
                    mock-products.ts
                  </code>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-3 text-red-400">
                Backend-Felder
              </h3>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <code className="bg-gray-800 px-2 py-1 rounded">
                    _show_setangebot
                  </code>
                </li>
                <li>
                  <code className="bg-gray-800 px-2 py-1 rounded">
                    _setangebot_einzelpreis
                  </code>
                </li>
                <li>
                  <code className="bg-gray-800 px-2 py-1 rounded">
                    _setangebot_gesamtpreis
                  </code>
                </li>
                <li>
                  <code className="bg-gray-800 px-2 py-1 rounded">
                    _setangebot_ersparnis_prozent
                  </code>
                </li>
                <li>
                  <code className="bg-gray-800 px-2 py-1 rounded">_aktion</code>
                </li>
                <li>
                  <code className="bg-gray-800 px-2 py-1 rounded">
                    _einheit_short
                  </code>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
