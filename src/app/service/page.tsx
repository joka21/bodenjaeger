import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Servicebereich | Bodenjäger',
  description: 'Unsere Services rund um Bodenbeläge - Von der Beratung bis zur Verlegung',
}

export default function ServicePage() {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl lg:text-5xl font-bold text-[#1e40af] mb-8">
          Servicebereich
        </h1>

        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Ihr Rundum-Service für perfekte Böden
            </h2>
            <p className="text-gray-700 mb-4">
              Bei Bodenjäger erhalten Sie nicht nur hochwertige Bodenbeläge, sondern auch
              umfassende Serviceleistungen aus einer Hand. Von der ersten Beratung über
              die Planung bis zur fachgerechten Verlegung und darüber hinaus – wir
              begleiten Sie auf dem gesamten Weg zu Ihrem Traumboden.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Unsere Serviceleistungen
            </h2>

            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-[#1e40af] mb-3">
                  Persönliche Fachberatung
                </h3>
                <p className="text-gray-700 mb-3">
                  Unsere erfahrenen Bodenexperten beraten Sie individuell und kompetent zu
                  allen Fragen rund um Bodenbeläge. Wir helfen Ihnen bei der Auswahl des
                  passenden Materials für Ihre Räume und Anforderungen.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Produktberatung für alle Bodenarten</li>
                  <li>Raumanalyse und Bedarfsermittlung</li>
                  <li>Material- und Farbberatung</li>
                  <li>Kostenvoranschlag und Budgetplanung</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-[#1e40af] mb-3">
                  Aufmaßservice
                </h3>
                <p className="text-gray-700 mb-3">
                  Für eine präzise Kalkulation nehmen wir vor Ort bei Ihnen Maß. So
                  vermeiden wir Materialverschwendung und Sie erhalten einen exakten
                  Kostenvoranschlag.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Professionelle Raumvermessung</li>
                  <li>Berechnung des Materialbedarfs</li>
                  <li>Detaillierter Kostenvoranschlag</li>
                  <li>Berücksichtigung baulicher Besonderheiten</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-[#1e40af] mb-3">
                  Musterservice
                </h3>
                <p className="text-gray-700 mb-3">
                  Überzeugen Sie sich in Ihren eigenen vier Wänden von Qualität und Optik.
                  Wir stellen Ihnen gerne Muster zur Verfügung, damit Sie den perfekten
                  Boden für Ihr Zuhause finden.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Kostenlose Musterboxen zum Mitnehmen</li>
                  <li>Großflächige Musterstücke auf Anfrage</li>
                  <li>Muster im Originalformat</li>
                  <li>Vergleich verschiedener Materialien</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-[#1e40af] mb-3">
                  Professionelle Verlegung
                </h3>
                <p className="text-gray-700 mb-3">
                  Unsere geschulten Bodenleger verlegen Ihren neuen Boden fachgerecht und
                  sauber. Jahrelange Erfahrung und handwerkliches Können garantieren ein
                  perfektes Ergebnis.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Fachgerechte Verlegung aller Bodenarten</li>
                  <li>Untergrundvorbereitung und Spachteln</li>
                  <li>Sockelleisten-Montage</li>
                  <li>Türen anpassen und kürzen</li>
                  <li>Übergangsprofile und Abschlussarbeiten</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-[#1e40af] mb-3">
                  Demontage & Entsorgung
                </h3>
                <p className="text-gray-700 mb-3">
                  Wir kümmern uns um die fachgerechte Demontage Ihres alten Bodenbelags
                  und die umweltgerechte Entsorgung – so müssen Sie sich um nichts
                  kümmern.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Entfernung alter Bodenbeläge</li>
                  <li>Demontage von Sockelleisten</li>
                  <li>Umweltgerechte Entsorgung</li>
                  <li>Reinigung der Baustelle</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-[#1e40af] mb-3">
                  Reparatur & Pflege
                </h3>
                <p className="text-gray-700 mb-3">
                  Auch nach der Verlegung sind wir für Sie da. Wir bieten Reparaturservice
                  und beraten Sie zur optimalen Pflege Ihres Bodens.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Ausbesserung von Beschädigungen</li>
                  <li>Austausch einzelner Elemente</li>
                  <li>Pflegeberatung und -produkte</li>
                  <li>Auffrischung und Versiegelung</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Unser Serviceablauf
            </h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <ol className="space-y-4">
                <li className="flex gap-4">
                  <span className="font-bold text-[#1e40af] text-xl">1.</span>
                  <div>
                    <p className="font-semibold text-[#1e40af]">
                      Beratungsgespräch & Planung
                    </p>
                    <p className="text-gray-700">
                      Vereinbaren Sie einen Termin in unserem Fachmarkt oder bei Ihnen vor
                      Ort. Wir besprechen Ihre Wünsche und Vorstellungen.
                    </p>
                  </div>
                </li>

                <li className="flex gap-4">
                  <span className="font-bold text-[#1e40af] text-xl">2.</span>
                  <div>
                    <p className="font-semibold text-[#1e40af]">Aufmaß & Angebot</p>
                    <p className="text-gray-700">
                      Wir nehmen präzise Maß und erstellen Ihnen ein detailliertes,
                      transparentes Angebot.
                    </p>
                  </div>
                </li>

                <li className="flex gap-4">
                  <span className="font-bold text-[#1e40af] text-xl">3.</span>
                  <div>
                    <p className="font-semibold text-[#1e40af]">Auftragserteilung</p>
                    <p className="text-gray-700">
                      Nach Ihrer Zusage bestellen wir das Material und koordinieren den
                      Verlegetermin.
                    </p>
                  </div>
                </li>

                <li className="flex gap-4">
                  <span className="font-bold text-[#1e40af] text-xl">4.</span>
                  <div>
                    <p className="font-semibold text-[#1e40af]">Vorbereitung</p>
                    <p className="text-gray-700">
                      Falls gewünscht, demontieren wir den alten Boden und bereiten den
                      Untergrund vor.
                    </p>
                  </div>
                </li>

                <li className="flex gap-4">
                  <span className="font-bold text-[#1e40af] text-xl">5.</span>
                  <div>
                    <p className="font-semibold text-[#1e40af]">Verlegung</p>
                    <p className="text-gray-700">
                      Unsere Fachhandwerker verlegen Ihren neuen Boden sauber und
                      termingerecht.
                    </p>
                  </div>
                </li>

                <li className="flex gap-4">
                  <span className="font-bold text-[#1e40af] text-xl">6.</span>
                  <div>
                    <p className="font-semibold text-[#1e40af]">Abnahme & Einweisung</p>
                    <p className="text-gray-700">
                      Gemeinsam mit Ihnen prüfen wir das Ergebnis und geben Ihnen
                      Pflegehinweise.
                    </p>
                  </div>
                </li>
              </ol>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Warum Bodenjäger?
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold text-[#1e40af] mb-2">Erfahrung</p>
                <p className="text-gray-700 text-sm">
                  Über 20 Jahre Expertise in Bodenbelägen und Raumausstattung
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold text-[#1e40af] mb-2">Qualität</p>
                <p className="text-gray-700 text-sm">
                  Hochwertige Produkte namhafter Hersteller
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold text-[#1e40af] mb-2">Fachkompetenz</p>
                <p className="text-gray-700 text-sm">
                  Ausgebildete Bodenleger und geschulte Fachberater
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold text-[#1e40af] mb-2">Service</p>
                <p className="text-gray-700 text-sm">
                  Rundum-Betreuung von der Planung bis zur Fertigstellung
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Service anfragen
            </h2>
            <p className="text-gray-700 mb-4">
              Interessiert an unseren Serviceleistungen? Kontaktieren Sie uns für ein
              unverbindliches Beratungsgespräch!
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="/kontakt"
                className="inline-block bg-[#1e40af] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#1e3a8a] transition-colors"
              >
                Kontakt aufnehmen
              </a>
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
