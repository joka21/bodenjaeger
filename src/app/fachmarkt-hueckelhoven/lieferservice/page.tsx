import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Lieferservice | Fachmarkt Hückelhoven | Bodenjäger',
  description: 'Bequeme Lieferung direkt zu Ihnen nach Hause – Lieferservice im Fachmarkt Hückelhoven',
}

export default function LieferservicePage() {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <nav className="mb-6 text-sm">
          <Link href="/fachmarkt-hueckelhoven" className="text-[#1e40af] hover:underline">
            ← Zurück zum Fachmarkt Hückelhoven
          </Link>
        </nav>

        <h1 className="text-4xl lg:text-5xl font-bold text-[#1e40af] mb-8">
          Lieferservice
        </h1>

        <div className="prose prose-lg max-w-none text-gray-700">
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Bequem nach Hause geliefert
            </h2>
            <p className="mb-4">
              Sie möchten sich den Transport sparen? Nutzen Sie unseren zuverlässigen
              Lieferservice! Wir bringen Ihre Ware sicher und termingerecht direkt zu
              Ihnen nach Hause – ob Laminat, Parkett, Fliesen oder Zubehör.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Lieferoptionen
            </h2>

            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg border-2 border-[#1e40af]">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-semibold text-[#1e40af]">
                    Standard-Lieferung
                  </h3>
                  <span className="bg-[#1e40af] text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Beliebt
                  </span>
                </div>
                <p className="text-sm mb-4">
                  Lieferung bis zur Bordsteinkante oder Hauseingang
                </p>
                <div className="bg-white p-4 rounded mb-4">
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span>Liefergebiet: Hückelhoven + 30 km Umkreis</span>
                      <strong>39,00 €</strong>
                    </li>
                    <li className="flex justify-between">
                      <span>Lieferzeit: 3-7 Werktage</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-green-700">
                        Kostenlos ab 500 € Warenwert
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-[#1e40af] mb-3">
                  Premium-Lieferung
                </h3>
                <p className="text-sm mb-4">
                  Lieferung und Transport in den gewünschten Raum
                </p>
                <div className="bg-white p-4 rounded mb-4">
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span>Liefergebiet: Hückelhoven + 30 km Umkreis</span>
                      <strong>69,00 €</strong>
                    </li>
                    <li className="flex justify-between">
                      <span>Lieferzeit: 3-7 Werktage</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Inkl. Treppentransport (bis 2. OG)</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Inkl. Verpackungsentfernung</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-[#1e40af] mb-3">
                  Express-Lieferung
                </h3>
                <p className="text-sm mb-4">
                  Schnelle Lieferung zum Wunschtermin
                </p>
                <div className="bg-white p-4 rounded mb-4">
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span>Liefergebiet: Hückelhoven + 20 km Umkreis</span>
                      <strong>89,00 €</strong>
                    </li>
                    <li className="flex justify-between">
                      <span>Lieferzeit: 1-2 Werktage</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Wunschtermin nach Verfügbarkeit</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-[#1e40af] mb-3">
                  Speditionsversand
                </h3>
                <p className="text-sm mb-4">
                  Für große Mengen und Palettenware
                </p>
                <div className="bg-white p-4 rounded mb-4">
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span>Deutschlandweit</span>
                      <strong>ab 99,00 €</strong>
                    </li>
                    <li className="flex justify-between">
                      <span>Lieferzeit: 5-10 Werktage</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Telefonische Avisierung</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Kostenlos ab 2.000 € Warenwert</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Liefergebiete
            </h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="mb-6">
                <h3 className="font-semibold text-[#1e40af] mb-3">
                  Kostenlose Lieferung (ab 500 € Warenwert)
                </h3>
                <p className="text-sm mb-2">
                  Hückelhoven und Umgebung (ca. 15 km Radius):
                </p>
                <p className="text-sm text-gray-700">
                  Erkelenz, Heinsberg, Wassenberg, Wegberg, Geilenkirchen, Jülich,
                  Linnich und umliegende Ortschaften
                </p>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-[#1e40af] mb-3">
                  Erweiterte Lieferzone (39,00 € Lieferkosten)
                </h3>
                <p className="text-sm mb-2">Bis ca. 30 km Radius:</p>
                <p className="text-sm text-gray-700">
                  Mönchengladbach, Aachen, Düren, Neuss und weitere Städte im Umkreis
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-[#1e40af] mb-3">
                  Deutschlandweiter Versand
                </h3>
                <p className="text-sm">
                  Per Spedition liefern wir auch deutschlandweit. Preis nach Postleitzahl
                  und Gewicht – kontaktieren Sie uns für ein individuelles Angebot!
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              So funktioniert's
            </h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <ol className="space-y-4">
                <li className="flex gap-4">
                  <span className="font-bold text-[#1e40af] text-xl min-w-[2rem]">1.</span>
                  <div>
                    <p className="font-semibold">Bestellung aufgeben</p>
                    <p className="text-sm">
                      Online, telefonisch oder direkt im Fachmarkt bestellen
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="font-bold text-[#1e40af] text-xl min-w-[2rem]">2.</span>
                  <div>
                    <p className="font-semibold">Lieferoption wählen</p>
                    <p className="text-sm">
                      Wählen Sie Ihre bevorzugte Lieferoption und Wunschtermin
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="font-bold text-[#1e40af] text-xl min-w-[2rem]">3.</span>
                  <div>
                    <p className="font-semibold">Terminbestätigung</p>
                    <p className="text-sm">
                      Sie erhalten eine Bestätigung mit dem Liefertermin
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="font-bold text-[#1e40af] text-xl min-w-[2rem]">4.</span>
                  <div>
                    <p className="font-semibold">Lieferung</p>
                    <p className="text-sm">
                      Wir liefern pünktlich zum vereinbarten Termin
                    </p>
                  </div>
                </li>
              </ol>
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
                    Bitte stellen Sie sicher, dass am Liefertag jemand vor Ort ist
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#1e40af] font-bold">•</span>
                  <span>
                    Bei Speditionslieferung erfolgt eine telefonische Avisierung am
                    Vortag
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#1e40af] font-bold">•</span>
                  <span>
                    Prüfen Sie die Ware bei Anlieferung auf Vollständigkeit und
                    Unversehrtheit
                </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#1e40af] font-bold">•</span>
                  <span>
                    Lassen Sie eventuelle Schäden sofort auf dem Lieferschein vermerken
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#1e40af] font-bold">•</span>
                  <span>
                    Bei Selbstabholung entfallen natürlich alle Lieferkosten
                  </span>
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Zusatzleistungen
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold text-[#1e40af] mb-2">
                  Altmaterial-Entsorgung
                </p>
                <p className="text-sm mb-2">
                  Wir entsorgen Ihren alten Bodenbelag fachgerecht
                </p>
                <p className="text-sm font-semibold">ab 49,00 €</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold text-[#1e40af] mb-2">
                  Verpackungs-Rücknahme
                </p>
                <p className="text-sm mb-2">
                  Wir nehmen Verpackungsmaterial kostenlos mit
                </p>
                <p className="text-sm font-semibold">Kostenlos</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold text-[#1e40af] mb-2">Lagerung</p>
                <p className="text-sm mb-2">
                  Ware bei uns lagern bis zur Verlegung
                </p>
                <p className="text-sm font-semibold">4 Wochen kostenlos</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold text-[#1e40af] mb-2">Wunschzeit</p>
                <p className="text-sm mb-2">Lieferung zu bestimmter Uhrzeit</p>
                <p className="text-sm font-semibold">+25,00 €</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Lieferung anfragen
            </h2>
            <p className="mb-4">
              Möchten Sie unseren Lieferservice nutzen? Kontaktieren Sie uns für ein
              individuelles Angebot!
            </p>
            <div className="flex flex-wrap gap-4 mb-6">
              <Link
                href="/kontakt"
                className="inline-block bg-[#1e40af] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#1e3a8a] transition-colors"
              >
                Kontakt aufnehmen
              </Link>
              <a
                href="tel:+492433123456"
                className="inline-block border-2 border-[#1e40af] text-[#1e40af] px-6 py-3 rounded-lg font-semibold hover:bg-[#1e40af] hover:text-white transition-colors"
              >
                Anrufen: +49 (0) 2433 123456
              </a>
            </div>

            <div className="bg-green-50 p-4 rounded">
              <p className="text-sm">
                <strong>Tipp:</strong> Bei Buchung unseres Verlegeservice ist die
                Lieferung zum Verlegetermin bereits inklusive!
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
