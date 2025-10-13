import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Fachmarkt Hückelhoven | Bodenjäger',
  description: 'Unser Fachmarkt in Hückelhoven - Ihr Spezialist für Bodenbeläge und Raumausstattung',
}

export default function FachmarktHueckelhovenPage() {
  const services = [
    {
      title: 'Verlegeservice',
      description: 'Professionelle Verlegung durch erfahrene Fachhandwerker',
      link: '/fachmarkt-hueckelhoven/verlegeservice',
    },
    {
      title: 'Anhängerverleih',
      description: 'Kostengünstiger Transportservice für Ihre Einkäufe',
      link: '/fachmarkt-hueckelhoven/anhaengerverleih',
    },
    {
      title: 'Warenlagerung',
      description: 'Sichere Aufbewahrung bis zur Verlegung',
      link: '/fachmarkt-hueckelhoven/warenlagerung',
    },
    {
      title: 'Fachberatung',
      description: 'Persönliche Beratung von unseren Experten',
      link: '/fachmarkt-hueckelhoven/fachberatung',
    },
    {
      title: 'Set-Angebote',
      description: 'Komplettlösungen zum Vorteilspreis',
      link: '/fachmarkt-hueckelhoven/set-angebote',
    },
    {
      title: 'Werkzeugverleih',
      description: 'Professionelle Werkzeuge für die Selbstverlegung',
      link: '/fachmarkt-hueckelhoven/werkzeugverleih',
    },
    {
      title: 'Lieferservice',
      description: 'Bequeme Lieferung direkt zu Ihnen nach Hause',
      link: '/fachmarkt-hueckelhoven/lieferservice',
    },
    {
      title: 'Schausonntag',
      description: 'Entspanntes Einkaufen an verkaufsoffenen Sonntagen',
      link: '/fachmarkt-hueckelhoven/schausonntag',
    },
  ]

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <h1 className="text-4xl lg:text-5xl font-bold text-[#1e40af] mb-8">
          Fachmarkt Hückelhoven
        </h1>

        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Willkommen in unserem Fachmarkt
            </h2>
            <p className="text-gray-700 mb-4">
              Besuchen Sie uns in Hückelhoven und entdecken Sie unsere große Auswahl an
              hochwertigen Bodenbelägen, Wandverkleidungen und Raumausstattung. Unser
              erfahrenes Team berät Sie gerne persönlich zu allen Fragen rund um Ihren
              neuen Boden.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-6">
              Unsere Filialvorteile auf einem Blick
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 not-prose">
              {services.map((service) => (
                <div
                  key={service.title}
                  className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-xl font-semibold text-[#1e40af] mb-3">
                    {service.title}
                  </h3>
                  <p className="text-gray-700 text-sm mb-4">{service.description}</p>
                  {service.title !== 'Schausonntag' && (
                    <Link
                      href={service.link}
                      className="text-[#1e40af] font-semibold text-sm hover:underline"
                    >
                      Mehr erfahren &gt;
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Adresse & Kontakt
            </h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="font-semibold text-lg mb-2">Bodenjäger Fachmarkt</p>
              <p className="text-gray-700">Musterstraße 123</p>
              <p className="text-gray-700 mb-4">41836 Hückelhoven</p>

              <p className="text-gray-700">
                <span className="font-semibold">Telefon:</span> +49 (0) 2433 123456
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">E-Mail:</span> info@bodenjaeger.de
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Öffnungszeiten
            </h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold">Montag - Freitag</p>
                  <p className="text-gray-700">09:00 - 18:00 Uhr</p>
                </div>
                <div>
                  <p className="font-semibold">Samstag</p>
                  <p className="text-gray-700">09:00 - 14:00 Uhr</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Unser Service
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Persönliche Fachberatung vor Ort</li>
              <li>Große Ausstellungsfläche zum Anfassen und Erleben</li>
              <li>Professionelle Verlegung durch erfahrene Handwerker</li>
              <li>Aufmaß und Kostenvoranschlag</li>
              <li>Musterservice für Zuhause</li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  )
}
