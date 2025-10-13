import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Set-Angebote | Fachmarkt Hückelhoven | Bodenjäger',
  description: 'Komplettlösungen zum Vorteilspreis – Set-Angebote im Fachmarkt Hückelhoven',
}

export default function SetAngebotePage() {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <nav className="mb-6 text-sm">
          <Link href="/fachmarkt-hueckelhoven" className="text-[#1e40af] hover:underline">
            ← Zurück zum Fachmarkt Hückelhoven
          </Link>
        </nav>

        <h1 className="text-4xl lg:text-5xl font-bold text-[#1e40af] mb-8">
          Set-Angebote
        </h1>

        <div className="prose prose-lg max-w-none text-gray-700">
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Alles aus einer Hand zum Vorteilspreis
            </h2>
            <p className="mb-4">
              Mit unseren Set-Angeboten erhalten Sie Komplettlösungen, die perfekt
              aufeinander abgestimmt sind. Von Bodenbelag über Verlegematerial bis zur
              Fußleiste – alles was Sie brauchen in einem Paket zum attraktiven
              Gesamtpreis. Sparen Sie Zeit und Geld!
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Aktuelle Set-Angebote
            </h2>

            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg border-2 border-[#1e40af]">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-semibold text-[#1e40af]">
                    Starter-Set Laminat
                  </h3>
                  <span className="bg-[#1e40af] text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Bestseller
                  </span>
                </div>
                <p className="text-sm mb-4">
                  Ideal für Einsteiger – komplettes Laminat-Set für ca. 20 m²
                </p>
                <div className="bg-white p-4 rounded mb-4">
                  <p className="font-semibold mb-2">Set-Inhalt:</p>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>Laminatboden (AC4, 8 mm) – 22 m²</li>
                    <li>Trittschalldämmung – 22 m²</li>
                    <li>Sockelleisten weiß – 35 laufende Meter</li>
                    <li>Verlegewerkzeug-Set (leihweise)</li>
                    <li>Pflegeset (Reiniger + Mikrofasertuch)</li>
                  </ul>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm line-through text-gray-500">
                      Einzelpreis: 589,00 €
                    </p>
                    <p className="text-2xl font-bold text-[#1e40af]">Set-Preis: 499,00 €</p>
                  </div>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded font-semibold text-sm">
                    Ersparnis: 90,00 €
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-[#1e40af] mb-3">
                  Komplett-Set Vinyl
                </h3>
                <p className="text-sm mb-4">
                  Hochwertiges Vinyl-Set mit allem Zubehör für ca. 25 m²
                </p>
                <div className="bg-white p-4 rounded mb-4">
                  <p className="font-semibold mb-2">Set-Inhalt:</p>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>Vinyl-Planken (Klick, 5 mm) – 27 m²</li>
                    <li>Vinyl-Unterlagsmatte – 27 m²</li>
                    <li>Vinyl-Sockelleisten – 40 laufende Meter</li>
                    <li>Übergangsprofile (3 Stück)</li>
                    <li>Dehnungsfugen-Set</li>
                  </ul>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm line-through text-gray-500">
                      Einzelpreis: 849,00 €
                    </p>
                    <p className="text-2xl font-bold text-[#1e40af]">Set-Preis: 749,00 €</p>
                  </div>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded font-semibold text-sm">
                    Ersparnis: 100,00 €
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-[#1e40af] mb-3">
                  Premium-Set Parkett
                </h3>
                <p className="text-sm mb-4">
                  Edles Eichenparkett-Set für anspruchsvolle Wohnräume (ca. 30 m²)
                </p>
                <div className="bg-white p-4 rounded mb-4">
                  <p className="font-semibold mb-2">Set-Inhalt:</p>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>Eiche-Parkett geölt (14 mm) – 32 m²</li>
                    <li>Premium Trittschalldämmung – 32 m²</li>
                    <li>Echtholz-Sockelleisten Eiche – 45 laufende Meter</li>
                    <li>Parkettöl für Erstbehandlung (1 Liter)</li>
                    <li>Pflegeset Premium</li>
                  </ul>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm line-through text-gray-500">
                      Einzelpreis: 2.299,00 €
                    </p>
                    <p className="text-2xl font-bold text-[#1e40af]">
                      Set-Preis: 1.999,00 €
                    </p>
                  </div>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded font-semibold text-sm">
                    Ersparnis: 300,00 €
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-[#1e40af] mb-3">
                  Komplett-Set mit Verlegung
                </h3>
                <p className="text-sm mb-4">
                  Rundum-Sorglos-Paket inkl. professioneller Verlegung (ca. 20 m²)
                </p>
                <div className="bg-white p-4 rounded mb-4">
                  <p className="font-semibold mb-2">Set-Inhalt:</p>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>Laminat oder Vinyl nach Wahl – 22 m²</li>
                    <li>Trittschalldämmung – 22 m²</li>
                    <li>Sockelleisten nach Wahl – 35 laufende Meter</li>
                    <li>Professionelle Verlegung inkl. Material</li>
                    <li>Entsorgung alter Bodenbelag</li>
                    <li>2 Jahre Garantie auf Verlegung</li>
                  </ul>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm line-through text-gray-500">
                      Einzelpreis: 1.299,00 €
                    </p>
                    <p className="text-2xl font-bold text-[#1e40af]">
                      Set-Preis: 1.099,00 €
                    </p>
                  </div>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded font-semibold text-sm">
                    Ersparnis: 200,00 €
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Individuelle Set-Zusammenstellung
            </h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="mb-4">
                Die Standard-Sets passen nicht ganz zu Ihren Bedürfnissen? Kein Problem!
                Wir stellen Ihnen gerne ein individuelles Set zusammen:
              </p>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <span className="text-[#1e40af] font-bold">1.</span>
                  <span>
                    Wählen Sie Ihren Wunsch-Bodenbelag aus unserem Sortiment
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#1e40af] font-bold">2.</span>
                  <span>Wir beraten Sie zu passendem Zubehör und Material</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#1e40af] font-bold">3.</span>
                  <span>
                    Sie erhalten einen Set-Rabatt auf das Gesamtpaket (5-15%)
                  </span>
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Vorteile unserer Set-Angebote
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold text-[#1e40af] mb-2">Preisersparnis</p>
                <p className="text-sm">
                  Bis zu 20% günstiger als Einzelkauf
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold text-[#1e40af] mb-2">Perfekt abgestimmt</p>
                <p className="text-sm">Alle Komponenten passen zusammen</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold text-[#1e40af] mb-2">Zeitersparnis</p>
                <p className="text-sm">Keine aufwendige Einzelsuche nötig</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold text-[#1e40af] mb-2">Alles dabei</p>
                <p className="text-sm">Nichts vergessen, direkt loslegen</p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Wichtige Hinweise
            </h2>
            <div className="bg-blue-50 border-l-4 border-[#1e40af] p-6 rounded">
              <ul className="space-y-2">
                <li>• Set-Angebote gelten nur bei komplettem Kauf aller Komponenten</li>
                <li>• Preise verstehen sich inkl. MwSt.</li>
                <li>
                  • Mengenangaben sind Richtwerte, tatsächlicher Bedarf wird vor Ort
                  ermittelt
                </li>
                <li>• Solange Vorrat reicht, einzelne Sets zeitlich begrenzt</li>
                <li>
                  • Kostenlose Warenlagerung bis zur Verlegung bei allen Sets ab 500 €
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Set-Angebot anfragen
            </h2>
            <p className="mb-4">
              Interessiert an einem unserer Set-Angebote? Kontaktieren Sie uns oder
              kommen Sie direkt in unserem Fachmarkt vorbei. Wir beraten Sie gerne!
            </p>
            <div className="flex flex-wrap gap-4">
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
          </section>
        </div>
      </div>
    </main>
  )
}
