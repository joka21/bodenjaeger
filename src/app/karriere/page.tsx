import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Jobs & Karriere | Bodenjäger',
  description: 'Karrieremöglichkeiten bei Bodenjäger - Werden Sie Teil unseres Teams',
}

export default function KarrierePage() {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl lg:text-5xl font-bold text-[#1e40af] mb-8">
          Jobs & Karriere
        </h1>

        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Werden Sie Teil unseres Teams
            </h2>
            <p className="text-gray-700 mb-4">
              Bei Bodenjäger arbeiten Sie in einem dynamischen Umfeld mit einem
              engagierten Team, das täglich daran arbeitet, unseren Kunden die besten
              Lösungen für ihre Böden zu bieten. Wir suchen Menschen, die mit
              Leidenschaft und Fachkenntnis unser Unternehmen voranbringen möchten.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Was wir bieten
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Ein motiviertes und kollegiales Team</li>
              <li>Attraktive Vergütung und Sozialleistungen</li>
              <li>Weiterbildungs- und Entwicklungsmöglichkeiten</li>
              <li>Modernes Arbeitsumfeld</li>
              <li>Vielseitige und spannende Aufgaben</li>
              <li>Flache Hierarchien und kurze Entscheidungswege</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Aktuelle Stellenangebote
            </h2>

            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="text-xl font-semibold text-[#1e40af] mb-2">
                Bodenleger (m/w/d)
              </h3>
              <p className="text-gray-600 mb-2">Vollzeit | Hückelhoven</p>
              <p className="text-gray-700 mb-4">
                Wir suchen einen erfahrenen Bodenleger zur Verstärkung unseres
                Verlegeteams. Sie verfügen über fundierte Kenntnisse in der Verlegung
                verschiedener Bodenbeläge und arbeiten sorgfältig und kundenorientiert.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="text-xl font-semibold text-[#1e40af] mb-2">
                Fachberater (m/w/d) für Bodenbeläge
              </h3>
              <p className="text-gray-600 mb-2">Vollzeit | Hückelhoven</p>
              <p className="text-gray-700 mb-4">
                Zur Verstärkung unseres Verkaufsteams suchen wir einen Fachberater mit
                Begeisterung für Bodenbeläge. Sie beraten unsere Kunden kompetent und
                freundlich und finden für jeden die passende Lösung.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-[#1e40af] mb-2">
                Auszubildende (m/w/d)
              </h3>
              <p className="text-gray-600 mb-2">Ausbildung | Hückelhoven</p>
              <p className="text-gray-700 mb-4">
                Starte deine Karriere mit einer Ausbildung bei Bodenjäger! Wir bilden aus
                zum Bodenleger, Raumausstatter oder Kaufmann im Einzelhandel. Bewirb dich
                jetzt für das kommende Ausbildungsjahr.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Initiativbewerbung
            </h2>
            <p className="text-gray-700 mb-4">
              Sie haben Ihre Traumstelle nicht gefunden? Senden Sie uns gerne eine
              Initiativbewerbung. Wir freuen uns darauf, Sie kennenzulernen!
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Kontakt
            </h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 mb-2">
                Senden Sie Ihre Bewerbungsunterlagen bitte an:
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">E-Mail:</span> jobs@bodenjaeger.de
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Telefon:</span> +49 (0) 2433 123456
              </p>
              <p className="text-gray-700 mt-4">
                Bei Fragen zu unseren Stellenangeboten stehen wir Ihnen gerne zur
                Verfügung.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
