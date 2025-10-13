import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Fachberatung | Fachmarkt Hückelhoven | Bodenjäger',
  description: 'Persönliche Fachberatung von unseren Bodenexperten im Fachmarkt Hückelhoven',
}

export default function FachberatungPage() {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <nav className="mb-6 text-sm">
          <Link href="/fachmarkt-hueckelhoven" className="text-[#1e40af] hover:underline">
            ← Zurück zum Fachmarkt Hückelhoven
          </Link>
        </nav>

        <h1 className="text-4xl lg:text-5xl font-bold text-[#1e40af] mb-8">
          Fachberatung
        </h1>

        <div className="prose prose-lg max-w-none text-gray-700">
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Kompetente Beratung für Ihren perfekten Boden
            </h2>
            <p className="mb-4">
              Die Auswahl des richtigen Bodenbelags ist eine wichtige Entscheidung.
              Unsere erfahrenen Fachberater nehmen sich Zeit für Sie und helfen Ihnen,
              den idealen Boden für Ihre Bedürfnisse zu finden – individuell,
              kompetent und herstellerunabhängig.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Unsere Beratungsthemen
            </h2>

            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-[#1e40af] mb-3">
                  Materialauswahl
                </h3>
                <p className="text-sm mb-3">
                  Wir erklären Ihnen die Unterschiede zwischen Laminat, Parkett, Vinyl,
                  Fliesen und anderen Bodenbelägen und finden gemeinsam das passende
                  Material für Ihre Räume.
                </p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Eigenschaften und Vorteile verschiedener Materialien</li>
                  <li>Eignung für spezielle Räume (Bad, Küche, Wohnbereich)</li>
                  <li>Pflegeaufwand und Langlebigkeit</li>
                  <li>Preis-Leistungs-Verhältnis</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-[#1e40af] mb-3">
                  Design & Optik
                </h3>
                <p className="text-sm mb-3">
                  Farbe, Struktur und Format beeinflussen die Raumwirkung erheblich.
                  Wir zeigen Ihnen, wie Sie mit dem richtigen Boden Räume optisch
                  vergrößern oder gemütlicher gestalten können.
                </p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Farbauswahl passend zur Einrichtung</li>
                  <li>Oberflächenstrukturen (matt, glänzend, gebürstet)</li>
                  <li>Verlegemuster und deren Wirkung</li>
                  <li>Aktuelle Trends und zeitlose Klassiker</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-[#1e40af] mb-3">
                  Technische Beratung
                </h3>
                <p className="text-sm mb-3">
                  Fußbodenheizung, Feuchträume oder starke Beanspruchung – wir klären
                  alle technischen Fragen und finden die optimale Lösung.
                </p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Eignung für Fußbodenheizung</li>
                  <li>Untergrundvorbereitung und Anforderungen</li>
                  <li>Trittschalldämmung und Akustik</li>
                  <li>Feuchtigkeitsschutz in Bad und Küche</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-[#1e40af] mb-3">
                  Kostenplanung
                </h3>
                <p className="text-sm mb-3">
                  Wir erstellen Ihnen eine transparente Kostenübersicht mit allen
                  Posten – von Material über Verlegung bis zum Zubehör.
                </p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Materialkosten pro Quadratmeter</li>
                  <li>Verlegekosten und Zusatzleistungen</li>
                  <li>Notwendiges Zubehör (Sockelleisten, Übergangsprofile)</li>
                  <li>Alternative Lösungen in verschiedenen Preisklassen</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Unsere Berater
            </h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="mb-4">
                Unser Beratungsteam besteht aus ausgebildeten Fachkräften mit
                langjähriger Erfahrung im Bodenbereich:
              </p>
              <ul className="space-y-2">
                <li className="flex gap-3">
                  <span className="text-[#1e40af] font-bold">✓</span>
                  <span>Geprüfte Bodenleger mit Meisterbrief</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#1e40af] font-bold">✓</span>
                  <span>Geschulte Fachverkäufer</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#1e40af] font-bold">✓</span>
                  <span>Regelmäßige Hersteller-Schulungen</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#1e40af] font-bold">✓</span>
                  <span>Über 20 Jahre Erfahrung im Fachhandel</span>
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Beratungsablauf
            </h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <ol className="space-y-4">
                <li className="flex gap-4">
                  <span className="font-bold text-[#1e40af] text-xl min-w-[2rem]">1.</span>
                  <div>
                    <p className="font-semibold">Bedarfsanalyse</p>
                    <p className="text-sm">
                      Wir besprechen Ihre Wünsche, Anforderungen und Ihr Budget
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="font-bold text-[#1e40af] text-xl min-w-[2rem]">2.</span>
                  <div>
                    <p className="font-semibold">Produktvorstellung</p>
                    <p className="text-sm">
                      Wir zeigen Ihnen passende Bodenbeläge in unserer Ausstellung
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="font-bold text-[#1e40af] text-xl min-w-[2rem]">3.</span>
                  <div>
                    <p className="font-semibold">Musterauswahl</p>
                    <p className="text-sm">
                      Sie können Muster mit nach Hause nehmen zum Vergleichen
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="font-bold text-[#1e40af] text-xl min-w-[2rem]">4.</span>
                  <div>
                    <p className="font-semibold">Kostenvoranschlag</p>
                    <p className="text-sm">
                      Wir erstellen Ihnen ein detailliertes Angebot (bei Bedarf mit
                      Aufmaß vor Ort)
                    </p>
                  </div>
                </li>
              </ol>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Beratungstermin vereinbaren
            </h2>
            <p className="mb-4">
              Für eine ausführliche Beratung empfehlen wir einen Termin zu vereinbaren.
              So können wir uns optimal Zeit für Sie nehmen. Natürlich sind Sie auch
              ohne Termin jederzeit willkommen!
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-[#1e40af] mb-3">
                  Mit Termin (empfohlen)
                </h3>
                <p className="text-sm mb-4">
                  Garantierte Beratung ohne Wartezeit, auch außerhalb der regulären
                  Öffnungszeiten möglich
                </p>
                <a
                  href="tel:+492433123456"
                  className="inline-block bg-[#1e40af] text-white px-4 py-2 rounded text-sm font-semibold hover:bg-[#1e3a8a] transition-colors"
                >
                  Termin vereinbaren
                </a>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-[#1e40af] mb-3">Ohne Termin</h3>
                <p className="text-sm mb-4">
                  Kommen Sie spontan vorbei – wir beraten Sie gerne (ggf. Wartezeit
                  möglich)
                </p>
                <Link
                  href="/fachmarkt-hueckelhoven"
                  className="inline-block border-2 border-[#1e40af] text-[#1e40af] px-4 py-2 rounded text-sm font-semibold hover:bg-[#1e40af] hover:text-white transition-colors"
                >
                  Öffnungszeiten ansehen
                </Link>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Kostenlose Beratung
            </h2>
            <div className="bg-blue-50 border-l-4 border-[#1e40af] p-6 rounded">
              <p className="mb-2">
                <strong>Unsere Beratung ist selbstverständlich kostenlos und
                unverbindlich!</strong>
              </p>
              <p className="text-sm">
                Sie entscheiden in Ruhe, ob und wann Sie bei uns kaufen möchten. Auch
                wenn Sie nur Informationen sammeln – wir helfen gerne!
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
