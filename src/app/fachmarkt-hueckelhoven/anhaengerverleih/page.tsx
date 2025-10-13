import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Anhängerverleih | Fachmarkt Hückelhoven | Bodenjäger',
  description: 'Kostengünstiger Anhängerverleih für Ihre Einkäufe im Fachmarkt Hückelhoven',
}

export default function AnhaengerverleihPage() {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <nav className="mb-6 text-sm">
          <Link href="/fachmarkt-hueckelhoven" className="text-[#1e40af] hover:underline">
            ← Zurück zum Fachmarkt Hückelhoven
          </Link>
        </nav>

        <h1 className="text-4xl lg:text-5xl font-bold text-[#1e40af] mb-8">
          Anhängerverleih
        </h1>

        <div className="prose prose-lg max-w-none text-gray-700">
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Günstiger Transport für Ihre Einkäufe
            </h2>
            <p className="mb-4">
              Sie haben bei uns eingekauft und möchten Ihre Ware selbst abholen?
              Nutzen Sie unseren kostengünstigen Anhängerverleih! Unsere robusten
              Transportanhänger bieten ausreichend Platz für Ihre Bodenbeläge und
              Materialien.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Unsere Anhänger
            </h2>

            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-[#1e40af] mb-3">
                  Standard-Anhänger
                </h3>
                <ul className="list-disc list-inside space-y-2 mb-3">
                  <li>Ladefläche: 2,50 m x 1,25 m</li>
                  <li>Zulässiges Gesamtgewicht: 750 kg</li>
                  <li>Bordwände: ca. 30 cm hoch</li>
                  <li>Plane und Befestigungsgurte inklusive</li>
                </ul>
                <p className="font-semibold text-[#1e40af]">
                  Tagespreis: 15,00 € (für Kunden kostenlos ab 500 € Einkaufswert)
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-[#1e40af] mb-3">
                  Hochlader-Anhänger
                </h3>
                <ul className="list-disc list-inside space-y-2 mb-3">
                  <li>Ladefläche: 2,50 m x 1,25 m</li>
                  <li>Zulässiges Gesamtgewicht: 1.300 kg</li>
                  <li>Bordwände: ca. 80 cm hoch</li>
                  <li>Plane und Befestigungsgurte inklusive</li>
                </ul>
                <p className="font-semibold text-[#1e40af]">Tagespreis: 25,00 €</p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Mietbedingungen
            </h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <span className="text-[#1e40af] font-bold">•</span>
                  <span>
                    <strong>Führerschein:</strong> Klasse B (PKW-Führerschein) ausreichend
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#1e40af] font-bold">•</span>
                  <span>
                    <strong>Kaution:</strong> 100,00 € (Rückzahlung bei Rückgabe)
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#1e40af] font-bold">•</span>
                  <span>
                    <strong>Mietdauer:</strong> Tagesmiete (Abholung und Rückgabe am selben Tag)
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#1e40af] font-bold">•</span>
                  <span>
                    <strong>Öffnungszeiten:</strong> Abholung und Rückgabe nur während der
                    Geschäftszeiten
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#1e40af] font-bold">•</span>
                  <span>
                    <strong>Versicherung:</strong> Haftpflichtversicherung über Ihr Zugfahrzeug
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#1e40af] font-bold">•</span>
                  <span>
                    <strong>Selbstbeteiligung:</strong> 500,00 € bei Schäden am Anhänger
                  </span>
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Wichtige Hinweise
            </h2>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded">
              <ul className="space-y-2">
                <li>
                  • Prüfen Sie vor Fahrtantritt die korrekte Befestigung der Ladung
                </li>
                <li>• Beachten Sie die zulässige Gesamtmasse Ihres Fahrzeugs</li>
                <li>• Passen Sie Ihre Fahrweise dem beladenen Anhänger an</li>
                <li>• Kontrollieren Sie regelmäßig die Beleuchtung des Anhängers</li>
                <li>
                  • Geben Sie den Anhänger gereinigt und im gleichen Zustand zurück
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Reservierung
            </h2>
            <p className="mb-4">
              Anhänger können telefonisch oder direkt im Fachmarkt reserviert werden.
              Wir empfehlen eine rechtzeitige Reservierung, besonders an Samstagen und
              vor Feiertagen.
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

          <section>
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Alternative: Lieferservice
            </h2>
            <p className="mb-4">
              Sie möchten sich den Transport sparen? Nutzen Sie unseren{' '}
              <Link
                href="/fachmarkt-hueckelhoven/lieferservice"
                className="text-[#1e40af] font-semibold hover:underline"
              >
                Lieferservice
              </Link>{' '}
              – wir bringen Ihre Ware direkt zu Ihnen nach Hause!
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
