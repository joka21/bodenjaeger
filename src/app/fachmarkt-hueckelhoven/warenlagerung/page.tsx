import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Warenlagerung | Fachmarkt Hückelhoven | Bodenjäger',
  description: 'Sichere und kostenlose Warenlagerung bis zur Verlegung im Fachmarkt Hückelhoven',
}

export default function WarenlagerungPage() {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <nav className="mb-6 text-sm">
          <Link href="/fachmarkt-hueckelhoven" className="text-[#1e40af] hover:underline">
            ← Zurück zum Fachmarkt Hückelhoven
          </Link>
        </nav>

        <h1 className="text-4xl lg:text-5xl font-bold text-[#1e40af] mb-8">
          Warenlagerung
        </h1>

        <div className="prose prose-lg max-w-none text-gray-700">
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Sichere Aufbewahrung bis zur Verlegung
            </h2>
            <p className="mb-4">
              Sie haben bei uns gekauft, aber Ihre Baustelle ist noch nicht bereit?
              Kein Problem! Wir lagern Ihre Ware kostenlos in unserem trockenen und
              sicheren Lager, bis Sie sie benötigen. So haben Sie die Gewissheit, dass
              Ihre Bodenbeläge optimal aufbewahrt werden.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Vorteile unserer Warenlagerung
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-[#1e40af] mb-3">
                  Optimale Lagerbedingungen
                </h3>
                <p className="text-sm">
                  Trockene und temperierte Räume sorgen für ideale Bedingungen.
                  Besonders wichtig für Holz- und Parkettböden.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-[#1e40af] mb-3">
                  Sichere Aufbewahrung
                </h3>
                <p className="text-sm">
                  Videoüberwachung und Alarmanlagen schützen Ihre Ware rund um die Uhr.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-[#1e40af] mb-3">
                  Flexible Abholung
                </h3>
                <p className="text-sm">
                  Sie können Ihre Ware während unserer Geschäftszeiten jederzeit
                  abholen – auch in Teilmengen.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-[#1e40af] mb-3">
                  Kein Platzmangel
                </h3>
                <p className="text-sm">
                  Nutzen Sie Ihren Wohnraum und lassen Sie sperrige Pakete bei uns
                  lagern.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Konditionen
            </h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-[#1e40af] mb-2">Kostenlose Lagerung</p>
                  <p className="text-sm">
                    Die ersten <strong>4 Wochen</strong> lagern wir Ihre Ware völlig
                    kostenlos.
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-[#1e40af] mb-2">Verlängerte Lagerung</p>
                  <p className="text-sm mb-2">
                    Benötigen Sie mehr Zeit? Kein Problem:
                  </p>
                  <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                    <li>Woche 5-8: 10,00 € pro Woche</li>
                    <li>Ab Woche 9: 15,00 € pro Woche</li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold text-[#1e40af] mb-2">
                    Verlegeservice-Kunden
                  </p>
                  <p className="text-sm">
                    Bei Beauftragung unseres Verlegeservice ist die Lagerung bis zum
                    Verlegetermin <strong>kostenlos</strong> – unabhängig von der Dauer!
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Wichtige Hinweise
            </h2>
            <div className="bg-blue-50 border-l-4 border-[#1e40af] p-6 rounded">
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <span className="text-[#1e40af] font-bold">•</span>
                  <span>
                    Die Ware wird versichert gelagert (Versicherungsschutz bis 10.000 €)
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#1e40af] font-bold">•</span>
                  <span>
                    Bei Abholung bitte Kaufbeleg oder Kundennummer mitbringen
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#1e40af] font-bold">•</span>
                  <span>
                    Teilabholungen sind möglich, bitte vorher telefonisch anmelden
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#1e40af] font-bold">•</span>
                  <span>
                    Maximal haltung: 6 Monate (danach erfolgt Rückfrage)
                  </span>
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Abholung koordinieren
            </h2>
            <p className="mb-4">
              Für eine reibungslose Abholung empfehlen wir, sich vorher telefonisch
              anzumelden. So können wir Ihre Ware bereitstellen und Sie sparen
              Wartezeit.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="mb-2">
                <strong>Telefon:</strong> +49 (0) 2433 123456
              </p>
              <p className="text-sm text-gray-600">
                Montag bis Freitag: 09:00 - 18:00 Uhr | Samstag: 09:00 - 14:00 Uhr
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Alternative: Direktlieferung
            </h2>
            <p className="mb-4">
              Sie möchten die Ware lieber direkt geliefert bekommen, wenn Ihre
              Baustelle bereit ist? Sprechen Sie uns auf unseren{' '}
              <Link
                href="/fachmarkt-hueckelhoven/lieferservice"
                className="text-[#1e40af] font-semibold hover:underline"
              >
                Lieferservice
              </Link>{' '}
              an – wir koordinieren die Lieferung zum gewünschten Termin!
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Häufig gelagerte Produkte
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold text-[#1e40af]">Laminat & Parkett</p>
                <p className="text-sm text-gray-600">
                  Muss vor Verlegung akklimatisieren
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold text-[#1e40af]">Fliesen & Naturstein</p>
                <p className="text-sm text-gray-600">Schwer und sperrig</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold text-[#1e40af]">Vinyl-Planken</p>
                <p className="text-sm text-gray-600">
                  Temperaturempfindlich
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold text-[#1e40af]">Verlegematerial</p>
                <p className="text-sm text-gray-600">
                  Kleber, Spachtelmasse, Zubehör
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
