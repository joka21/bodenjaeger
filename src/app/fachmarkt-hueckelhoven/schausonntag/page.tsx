import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Schausonntag | Fachmarkt Hückelhoven | Bodenjäger',
  description: 'Verkaufsoffene Sonntage und Schausonntage im Fachmarkt Hückelhoven',
}

export default function SchausonntagPage() {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <nav className="mb-6 text-sm">
          <Link href="/fachmarkt-hueckelhoven" className="text-[#1e40af] hover:underline">
            ← Zurück zum Fachmarkt Hückelhoven
          </Link>
        </nav>

        <h1 className="text-4xl lg:text-5xl font-bold text-[#1e40af] mb-8">
          Schausonntag
        </h1>

        <div className="prose prose-lg max-w-none text-gray-700">
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Entspannt einkaufen am Sonntag
            </h2>
            <p className="mb-4">
              Nutzen Sie unsere verkaufsoffenen Sonntage für einen entspannten Besuch in
              unserem Fachmarkt. Ohne Zeitdruck können Sie unsere umfangreiche
              Ausstellung erkunden, Muster vergleichen und sich ausführlich von unseren
              Experten beraten lassen.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Nächste Termine 2025
            </h2>

            <div className="space-y-4">
              <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-[#1e40af]">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-2xl font-bold text-[#1e40af]">23. März 2025</p>
                    <p className="text-sm text-gray-600">Frühjahrs-Schausonntag</p>
                  </div>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                    Nächster Termin
                  </span>
                </div>
                <p className="text-lg font-semibold mb-2">13:00 - 18:00 Uhr</p>
                <p className="text-sm">
                  Entdecken Sie unsere neuen Frühjahrs-Kollektionen mit exklusiven
                  Sonntagsrabatten!
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-2xl font-bold text-[#1e40af]">15. Juni 2025</p>
                    <p className="text-sm text-gray-600">Sommer-Aktionstag</p>
                  </div>
                </div>
                <p className="text-lg font-semibold mb-2">13:00 - 18:00 Uhr</p>
                <p className="text-sm">
                  Sommerfest mit Grillen, Getränken und besonderen Angeboten für Outdoor-
                  und Terrassenbeläge
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-2xl font-bold text-[#1e40af]">
                      28. September 2025
                    </p>
                    <p className="text-sm text-gray-600">Herbst-Schausonntag</p>
                  </div>
                </div>
                <p className="text-lg font-semibold mb-2">13:00 - 18:00 Uhr</p>
                <p className="text-sm">
                  Herbstliche Inspirationen mit Fokus auf warme Holztöne und gemütliche
                  Wohnraumgestaltung
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-2xl font-bold text-[#1e40af]">
                      30. November 2025
                    </p>
                    <p className="text-sm text-gray-600">Advents-Shopping</p>
                  </div>
                </div>
                <p className="text-lg font-semibold mb-2">13:00 - 18:00 Uhr</p>
                <p className="text-sm">
                  Weihnachtlicher Schausonntag mit Glühwein, Plätzchen und
                  Winter-Spezialangeboten
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Das erwartet Sie an unseren Schausonntagen
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-[#1e40af] mb-3">
                  Umfangreiche Ausstellung
                </h3>
                <p className="text-sm">
                  Erkunden Sie in Ruhe unsere große Ausstellung mit hunderten Mustern
                  aller Bodenbeläge. Nehmen Sie sich Zeit zum Vergleichen und
                  Ausprobieren.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-[#1e40af] mb-3">
                  Fachberatung
                </h3>
                <p className="text-sm">
                  Unser gesamtes Beraterteam steht Ihnen zur Verfügung. Lassen Sie sich
                  ausführlich und ohne Zeitdruck zu allen Fragen rund um Ihren neuen
                  Boden beraten.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-[#1e40af] mb-3">
                  Sonntags-Specials
                </h3>
                <p className="text-sm">
                  Profitieren Sie von exklusiven Sonntagsangeboten und Aktionspreisen,
                  die es nur an diesen besonderen Tagen gibt.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-[#1e40af] mb-3">
                  Für die ganze Familie
                </h3>
                <p className="text-sm">
                  Kinderecke mit Mal- und Spielmöglichkeiten, Kaffee und Kuchen – so
                  wird der Einkauf zum Familienausflug!
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Besondere Aktionen
            </h2>
            <div className="space-y-4">
              <div className="bg-blue-50 border-l-4 border-[#1e40af] p-6 rounded">
                <p className="font-semibold text-[#1e40af] mb-2">
                  Live-Verlegedemonstrationen
                </p>
                <p className="text-sm">
                  Unsere Bodenleger zeigen Ihnen live, wie verschiedene Bodenbeläge
                  fachgerecht verlegt werden. Stellen Sie Ihre Fragen direkt an die
                  Profis!
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  Uhrzeiten: 14:00 Uhr und 16:00 Uhr
                </p>
              </div>

              <div className="bg-blue-50 border-l-4 border-[#1e40af] p-6 rounded">
                <p className="font-semibold text-[#1e40af] mb-2">Gewinnspiel</p>
                <p className="text-sm">
                  Nehmen Sie an unserem Schausonntags-Gewinnspiel teil und gewinnen Sie
                  attraktive Preise rund um Ihren Boden!
                </p>
              </div>

              <div className="bg-blue-50 border-l-4 border-[#1e40af] p-6 rounded">
                <p className="font-semibold text-[#1e40af] mb-2">
                  Kostenlose Raumplanung
                </p>
                <p className="text-sm">
                  Bringen Sie Ihre Raummaße mit und lassen Sie sich kostenlos eine
                  Materialberechnung erstellen – inklusive Visualisierung am Computer!
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Wichtige Informationen
            </h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <span className="text-[#1e40af] font-bold">•</span>
                  <span>
                    <strong>Parkplätze:</strong> Ausreichend kostenfreie Parkplätze
                    direkt vor Ort
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#1e40af] font-bold">•</span>
                  <span>
                    <strong>Barrierefreiheit:</strong> Unser Fachmarkt ist barrierefrei
                    zugänglich
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#1e40af] font-bold">•</span>
                  <span>
                    <strong>Zahlung:</strong> Alle gängigen Zahlungsmethoden möglich
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#1e40af] font-bold">•</span>
                  <span>
                    <strong>Sofortkauf:</strong> Kleine Artikel können direkt
                    mitgenommen werden
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#1e40af] font-bold">•</span>
                  <span>
                    <strong>Bestellungen:</strong> Größere Mengen werden termingerecht
                    geliefert
                  </span>
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Newsletter abonnieren
            </h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="mb-4">
                Verpassen Sie keinen Schausonntag mehr! Melden Sie sich für unseren
                Newsletter an und erhalten Sie rechtzeitig alle Termine und
                Sonderaktionen.
              </p>
              <Link
                href="/kontakt"
                className="inline-block bg-[#1e40af] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#1e3a8a] transition-colors"
              >
                Zum Newsletter anmelden
              </Link>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Kontakt & Anfahrt
            </h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="font-semibold mb-3">Bodenjäger Fachmarkt Hückelhoven</p>
              <p className="text-sm mb-1">Musterstraße 123</p>
              <p className="text-sm mb-4">41836 Hückelhoven</p>
              <p className="text-sm mb-1">
                <strong>Telefon:</strong> +49 (0) 2433 123456
              </p>
              <p className="text-sm mb-4">
                <strong>E-Mail:</strong> info@bodenjaeger.de
              </p>
              <Link
                href="/fachmarkt-hueckelhoven"
                className="text-[#1e40af] font-semibold text-sm hover:underline"
              >
                Anfahrt & weitere Informationen →
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
