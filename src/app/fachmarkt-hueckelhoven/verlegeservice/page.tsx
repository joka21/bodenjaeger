import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Verlegeservice | Fachmarkt Hückelhoven | Bodenjäger',
  description: 'Professioneller Verlegeservice durch erfahrene Fachhandwerker im Fachmarkt Hückelhoven',
}

export default function VerlegeservicePage() {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <nav className="mb-6 text-sm">
          <Link href="/fachmarkt-hueckelhoven" className="text-[#1e40af] hover:underline">
            ← Zurück zum Fachmarkt Hückelhoven
          </Link>
        </nav>

        <h1 className="text-4xl lg:text-5xl font-bold text-[#1e40af] mb-8">
          Verlegeservice
        </h1>

        <div className="prose prose-lg max-w-none text-gray-700">
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Professionelle Verlegung vom Fachmann
            </h2>
            <p className="mb-4">
              Verlassen Sie sich auf die Expertise unserer erfahrenen Bodenleger! Wir
              verlegen Ihren neuen Bodenbelag fachgerecht, termingerecht und sauber.
              Mit jahrelanger Erfahrung und handwerklichem Können garantieren wir Ihnen
              ein perfektes Ergebnis, an dem Sie lange Freude haben werden.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Unsere Verlegeleistungen
            </h2>

            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-[#1e40af] mb-3">
                  Laminat & Parkett
                </h3>
                <p className="mb-3">
                  Fachgerechte Verlegung von Klick-Laminat, verklebtem Laminat und
                  Parkettböden in allen Varianten. Inkl. Trittschalldämmung und
                  Sockelleistenmontage.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-[#1e40af] mb-3">
                  Vinyl & Designböden
                </h3>
                <p className="mb-3">
                  Professionelle Verlegung von Vinyl-Planken, Designböden und
                  elastischen Bodenbelägen – verklebt oder schwimmend verlegt.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-[#1e40af] mb-3">
                  Teppichboden
                </h3>
                <p className="mb-3">
                  Verlegung aller Teppichboden-Arten – von der klassischen Auslegeware
                  bis zu modernen Teppichfliesen.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-[#1e40af] mb-3">
                  Kork & Linoleum
                </h3>
                <p className="mb-3">
                  Fachgerechte Verlegung ökologischer Bodenbeläge wie Kork und Linoleum
                  für ein gesundes Wohnklima.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Zusätzliche Leistungen
            </h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Untergrundvorbereitung und Spachteln</li>
              <li>Entfernung alter Bodenbeläge</li>
              <li>Sockelleisten-Montage in verschiedenen Designs</li>
              <li>Türen kürzen und anpassen</li>
              <li>Übergangsprofile und Abschlussleisten</li>
              <li>Treppenbelegung</li>
              <li>Fußleisten streichen oder beschichten</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              So läuft&apos;s ab
            </h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <ol className="space-y-4">
                <li className="flex gap-4">
                  <span className="font-bold text-[#1e40af] text-xl min-w-[2rem]">1.</span>
                  <div>
                    <p className="font-semibold">Beratungsgespräch</p>
                    <p className="text-sm">
                      Wir besprechen Ihre Wünsche und nehmen Maß vor Ort
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="font-bold text-[#1e40af] text-xl min-w-[2rem]">2.</span>
                  <div>
                    <p className="font-semibold">Angebot</p>
                    <p className="text-sm">
                      Sie erhalten ein detailliertes Festpreisangebot
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="font-bold text-[#1e40af] text-xl min-w-[2rem]">3.</span>
                  <div>
                    <p className="font-semibold">Terminvereinbarung</p>
                    <p className="text-sm">
                      Wir koordinieren einen passenden Verlegetermin
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="font-bold text-[#1e40af] text-xl min-w-[2rem]">4.</span>
                  <div>
                    <p className="font-semibold">Verlegung</p>
                    <p className="text-sm">
                      Unsere Profis verlegen Ihren Boden fachgerecht
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="font-bold text-[#1e40af] text-xl min-w-[2rem]">5.</span>
                  <div>
                    <p className="font-semibold">Abnahme</p>
                    <p className="text-sm">
                      Gemeinsame Endabnahme und Pflegehinweise
                    </p>
                  </div>
                </li>
              </ol>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Ihre Vorteile
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold text-[#1e40af] mb-2">Festpreisgarantie</p>
                <p className="text-sm">Keine versteckten Kosten</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold text-[#1e40af] mb-2">Erfahrene Profis</p>
                <p className="text-sm">Langjährige Expertise</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold text-[#1e40af] mb-2">Termintreue</p>
                <p className="text-sm">Verlässliche Absprachen</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold text-[#1e40af] mb-2">Gewährleistung</p>
                <p className="text-sm">2 Jahre Garantie auf Verlegung</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Jetzt Verlegung anfragen
            </h2>
            <p className="mb-4">
              Kontaktieren Sie uns für ein unverbindliches Angebot oder vereinbaren Sie
              einen Beratungstermin in unserem Fachmarkt.
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
