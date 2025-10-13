import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sitemap | Bodenjäger',
  description: 'Übersicht aller Seiten auf bodenjäger.de',
}

export default function SitemapPage() {
  const pages = [
    {
      category: 'Hauptseiten',
      links: [
        { title: 'Startseite', url: '/' },
        { title: 'Produkte', url: '/products' },
        { title: 'Warenkorb', url: '/cart' },
        { title: 'Kontakt', url: '/kontakt' },
        { title: 'Blog', url: '/blog' },
      ],
    },
    {
      category: 'Fachmarkt Hückelhoven',
      links: [
        { title: 'Fachmarkt Hückelhoven - Übersicht', url: '/fachmarkt-hueckelhoven' },
        { title: 'Verlegeservice', url: '/fachmarkt-hueckelhoven/verlegeservice' },
        { title: 'Anhängerverleih', url: '/fachmarkt-hueckelhoven/anhaengerverleih' },
        { title: 'Warenlagerung', url: '/fachmarkt-hueckelhoven/warenlagerung' },
        { title: 'Fachberatung', url: '/fachmarkt-hueckelhoven/fachberatung' },
        { title: 'Set-Angebote', url: '/fachmarkt-hueckelhoven/set-angebote' },
        { title: 'Werkzeugverleih', url: '/fachmarkt-hueckelhoven/werkzeugverleih' },
        { title: 'Lieferservice', url: '/fachmarkt-hueckelhoven/lieferservice' },
        { title: 'Schausonntag', url: '/fachmarkt-hueckelhoven/schausonntag' },
      ],
    },
    {
      category: 'Service & Information',
      links: [
        { title: 'Servicebereich', url: '/service' },
        { title: 'Versand & Lieferzeit', url: '/versand-lieferzeit' },
        { title: 'Widerrufsbelehrung & Widerrufsformular', url: '/widerruf' },
        { title: 'Jobs & Karriere', url: '/karriere' },
      ],
    },
    {
      category: 'Rechtliches',
      links: [
        { title: 'Impressum', url: '/impressum' },
        { title: 'Datenschutzerklärung', url: '/datenschutz' },
        { title: 'AGB', url: '/agb' },
      ],
    },
  ]

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <h1 className="text-4xl lg:text-5xl font-bold text-[#1e40af] mb-4">
          Sitemap
        </h1>
        <p className="text-gray-700 mb-12 text-lg">
          Übersicht aller Seiten auf bodenjäger.de
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {pages.map((section) => (
            <div key={section.category} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-[#1e40af] mb-4 border-b-2 border-[#1e40af] pb-2">
                {section.category}
              </h2>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.url}>
                    <Link
                      href={link.url}
                      className="text-gray-700 hover:text-[#1e40af] hover:underline flex items-center group"
                    >
                      <span className="mr-2 text-[#1e40af] group-hover:translate-x-1 transition-transform">
                        →
                      </span>
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-blue-50 border-l-4 border-[#1e40af] p-6 rounded">
          <h3 className="text-xl font-semibold text-[#1e40af] mb-2">
            Seite nicht gefunden?
          </h3>
          <p className="text-gray-700 mb-4">
            Falls Sie eine bestimmte Seite nicht finden, nutzen Sie gerne unsere Suche
            oder kontaktieren Sie uns direkt.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/kontakt"
              className="inline-block bg-[#1e40af] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#1e3a8a] transition-colors"
            >
              Kontakt
            </Link>
            <Link
              href="/"
              className="inline-block border-2 border-[#1e40af] text-[#1e40af] px-6 py-2 rounded-lg font-semibold hover:bg-[#1e40af] hover:text-white transition-colors"
            >
              Zur Startseite
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Letzte Aktualisierung: Januar 2025
          </p>
        </div>
      </div>
    </main>
  )
}
