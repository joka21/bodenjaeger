import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Versand & Lieferzeit | Bodenjäger',
  description: 'Informationen zu Versand und Lieferzeiten bei Bodenjäger',
}

export default function VersandLieferzeitPage() {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl lg:text-5xl font-bold text-[#1e40af] mb-8">
          Versand & Lieferzeit
        </h1>

        <div className="prose prose-lg max-w-none text-gray-700">
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Versandinformationen
            </h2>
            <p className="mb-4">
              Wir liefern Ihre Bestellung schnell, sicher und zuverlässig. Je nach
              Produktart und Bestellumfang bieten wir verschiedene Versandoptionen an,
              damit Sie Ihre Ware so schnell wie möglich erhalten.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Lieferzeiten
            </h2>

            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="text-xl font-semibold text-[#1e40af] mb-3">
                Standardversand
              </h3>
              <p className="mb-3">
                Die reguläre Lieferzeit für lagernde Artikel beträgt:
              </p>
              <div className="bg-white p-4 rounded mb-4">
                <p className="font-semibold text-[#1e40af] mb-2">
                  Deutschland (Festland)
                </p>
                <p className="mb-1">
                  <strong>3-7 Werktage</strong> nach Zahlungseingang
                </p>
                <p className="text-sm text-gray-600">
                  Montag bis Freitag (außer an Feiertagen)
                </p>
              </div>
              <p className="text-sm text-gray-600">
                Die Lieferzeit beginnt bei Zahlung per Vorkasse am Tag nach Erteilung
                des Zahlungsauftrags an das überweisende Kreditinstitut bzw. bei anderen
                Zahlungsarten am Tag nach Vertragsschluss.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="text-xl font-semibold text-[#1e40af] mb-3">
                Expressversand
              </h3>
              <p className="mb-3">
                Benötigen Sie Ihre Ware schneller? Wir bieten gegen Aufpreis einen
                Expressversand an:
              </p>
              <div className="bg-white p-4 rounded mb-4">
                <p className="font-semibold text-[#1e40af] mb-2">
                  Express-Lieferung
                </p>
                <p className="mb-1">
                  <strong>1-2 Werktage</strong> nach Zahlungseingang
                </p>
                <p className="text-sm text-gray-600">
                  Aufpreis: 19,90 € (nur für Kleinteile und Muster)
                </p>
              </div>
              <p className="text-sm text-gray-600">
                Express-Versand ist nur für ausgewählte Produkte verfügbar. Die Option
                wird Ihnen im Bestellvorgang angezeigt, wenn sie für Ihre Artikel
                verfügbar ist.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-[#1e40af] mb-3">
                Speditionsversand
              </h3>
              <p className="mb-3">
                Große oder schwere Artikel (z.B. Paletten mit Fliesen, große
                Laminatmengen) werden per Spedition geliefert:
              </p>
              <div className="bg-white p-4 rounded mb-4">
                <p className="font-semibold text-[#1e40af] mb-2">
                  Speditionslieferung
                </p>
                <p className="mb-1">
                  <strong>5-10 Werktage</strong> nach Zahlungseingang
                </p>
                <p className="text-sm text-gray-600">
                  Die Spedition kontaktiert Sie telefonisch zur Terminvereinbarung
                </p>
              </div>
              <p className="text-sm text-gray-600">
                Bei Speditionslieferungen erfolgt die Lieferung bis zur Bordsteinkante.
                Gegen Aufpreis bieten wir auch Lieferung bis zur Wohnungstür an.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Versandkosten
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full bg-gray-50 rounded-lg overflow-hidden">
                <thead className="bg-[#1e40af] text-white">
                  <tr>
                    <th className="px-6 py-3 text-left">Versandart</th>
                    <th className="px-6 py-3 text-left">Kosten</th>
                    <th className="px-6 py-3 text-left">Ab Warenwert</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-300">
                  <tr>
                    <td className="px-6 py-4">Standardversand (Paket)</td>
                    <td className="px-6 py-4">5,90 €</td>
                    <td className="px-6 py-4">kostenlos ab 100 €</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4">Expressversand</td>
                    <td className="px-6 py-4">19,90 €</td>
                    <td className="px-6 py-4">-</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4">Speditionsversand (Bordsteinkante)</td>
                    <td className="px-6 py-4">ab 49,00 €</td>
                    <td className="px-6 py-4">kostenlos ab 500 €</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4">Speditionsversand (Wohnungstür)</td>
                    <td className="px-6 py-4">ab 89,00 €</td>
                    <td className="px-6 py-4">-</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-sm text-gray-600 mt-4">
              Alle Preise verstehen sich inkl. der gesetzlichen Mehrwertsteuer. Die
              genauen Versandkosten werden im Warenkorb berechnet und vor Abschluss der
              Bestellung angezeigt.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Liefergebiete
            </h2>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-[#1e40af] mb-3">Deutschland</h3>
              <p className="mb-4">
                Wir liefern innerhalb Deutschlands an alle Adressen auf dem Festland.
                Lieferungen auf deutsche Inseln sind grundsätzlich möglich, können jedoch
                eine längere Lieferzeit in Anspruch nehmen.
              </p>

              <h3 className="text-xl font-semibold text-[#1e40af] mb-3">
                Selbstabholung
              </h3>
              <p className="mb-2">
                Sie können Ihre Bestellung auch kostenlos in unserem Fachmarkt in
                Hückelhoven abholen:
              </p>
              <div className="bg-white p-4 rounded">
                <p className="font-semibold mb-1">Bodenjäger GmbH</p>
                <p className="text-sm">Musterstraße 123</p>
                <p className="text-sm mb-3">41836 Hückelhoven</p>
                <p className="text-sm text-gray-600">
                  Nach Zahlungseingang erhalten Sie eine E-Mail, sobald Ihre Bestellung
                  zur Abholung bereit ist (in der Regel innerhalb von 1-2 Werktagen).
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Besondere Hinweise
            </h2>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-[#1e40af] mb-2">
                  Sonderanfertigungen
                </h3>
                <p className="text-sm">
                  Bei Sonderanfertigungen und Maßanfertigungen kann die Lieferzeit
                  abweichen. Die voraussichtliche Lieferzeit wird Ihnen vor
                  Vertragsabschluss mitgeteilt.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-[#1e40af] mb-2">
                  Artikel mit unterschiedlichen Lieferzeiten
                </h3>
                <p className="text-sm">
                  Bestellen Sie Artikel mit unterschiedlichen Lieferzeiten, erfolgt die
                  Lieferung in einer gemeinsamen Sendung, sofern keine abweichende
                  Vereinbarung getroffen wurde. Die Lieferzeit bestimmt sich nach dem
                  Artikel mit der längsten Lieferzeit.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-[#1e40af] mb-2">Fehlende Artikel</h3>
                <p className="text-sm">
                  Sollte ein Artikel nicht verfügbar sein, informieren wir Sie umgehend
                  und bieten Ihnen eine Alternative an oder erstatten den Kaufpreis.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Sendungsverfolgung
            </h2>
            <p className="mb-4">
              Nach Versand Ihrer Bestellung erhalten Sie eine Versandbestätigung per
              E-Mail mit einem Link zur Sendungsverfolgung. So können Sie jederzeit den
              aktuellen Status Ihrer Lieferung nachvollziehen.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Annahme der Lieferung
            </h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="mb-4">
                Bitte beachten Sie folgende Hinweise bei der Annahme Ihrer Lieferung:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  Prüfen Sie die Ware unmittelbar bei Anlieferung auf Vollständigkeit und
                  Unversehrtheit
                </li>
                <li>
                  Bei sichtbaren Transportschäden verweigern Sie bitte die Annahme oder
                  lassen Sie den Schaden auf dem Lieferschein vermerken
                </li>
                <li>
                  Melden Sie Transportschäden unverzüglich (spätestens innerhalb von 7
                  Tagen) schriftlich
                </li>
                <li>
                  Bewahren Sie die Originalverpackung auf, bis die Ware vollständig
                  geprüft wurde
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Fragen zum Versand?
            </h2>
            <p className="mb-4">
              Bei Fragen zu Ihrer Lieferung oder Problemen mit dem Versand kontaktieren
              Sie uns gerne:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="mb-2">
                <strong>Telefon:</strong> +49 (0) 2433 123456
              </p>
              <p className="mb-2">
                <strong>E-Mail:</strong> versand@bodenjaeger.de
              </p>
              <p className="text-sm text-gray-600">
                Montag bis Freitag: 09:00 - 18:00 Uhr
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
