import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Widerrufsbelehrung & Widerrufsformular | Bodenjäger',
  description: 'Widerrufsbelehrung und Muster-Widerrufsformular für Verbraucher',
}

export default function WiderrufPage() {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl lg:text-5xl font-bold text-[#1e40af] mb-8">
          Widerrufsbelehrung & Widerrufsformular
        </h1>

        <div className="prose prose-lg max-w-none text-gray-700">
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Widerrufsbelehrung
            </h2>

            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="text-xl font-semibold text-[#1e40af] mb-3">
                Widerrufsrecht
              </h3>
              <p className="mb-4">
                Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen
                diesen Vertrag zu widerrufen.
              </p>
              <p className="mb-4">
                Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag, an dem Sie oder ein
                von Ihnen benannter Dritter, der nicht der Beförderer ist, die Waren in
                Besitz genommen haben bzw. hat.
              </p>
              <p className="mb-4">
                Um Ihr Widerrufsrecht auszuüben, müssen Sie uns
              </p>
              <div className="bg-white p-4 rounded mb-4">
                <p className="font-semibold">Bodenjäger GmbH</p>
                <p>Musterstraße 123</p>
                <p>41836 Hückelhoven</p>
                <p className="mt-2">Telefon: +49 (0) 2433 123456</p>
                <p>Telefax: +49 (0) 2433 123457</p>
                <p>E-Mail: widerruf@bodenjaeger.de</p>
              </div>
              <p className="mb-4">
                mittels einer eindeutigen Erklärung (z.B. ein mit der Post versandter
                Brief, Telefax oder E-Mail) über Ihren Entschluss, diesen Vertrag zu
                widerrufen, informieren. Sie können dafür das beigefügte
                Muster-Widerrufsformular verwenden, das jedoch nicht vorgeschrieben ist.
              </p>
              <p className="mb-4">
                Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung
                über die Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist
                absenden.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="text-xl font-semibold text-[#1e40af] mb-3">
                Folgen des Widerrufs
              </h3>
              <p className="mb-4">
                Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die
                wir von Ihnen erhalten haben, einschließlich der Lieferkosten (mit
                Ausnahme der zusätzlichen Kosten, die sich daraus ergeben, dass Sie eine
                andere Art der Lieferung als die von uns angebotene, günstigste
                Standardlieferung gewählt haben), unverzüglich und spätestens binnen
                vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über
                Ihren Widerruf dieses Vertrags bei uns eingegangen ist.
              </p>
              <p className="mb-4">
                Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei
                der ursprünglichen Transaktion eingesetzt haben, es sei denn, mit Ihnen
                wurde ausdrücklich etwas anderes vereinbart; in keinem Fall werden Ihnen
                wegen dieser Rückzahlung Entgelte berechnet.
              </p>
              <p className="mb-4">
                Wir können die Rückzahlung verweigern, bis wir die Waren wieder
                zurückerhalten haben oder bis Sie den Nachweis erbracht haben, dass Sie
                die Waren zurückgesandt haben, je nachdem, welches der frühere Zeitpunkt
                ist.
              </p>
              <p className="mb-4">
                Sie haben die Waren unverzüglich und in jedem Fall spätestens binnen
                vierzehn Tagen ab dem Tag, an dem Sie uns über den Widerruf dieses
                Vertrags unterrichten, an uns zurückzusenden oder zu übergeben. Die
                Frist ist gewahrt, wenn Sie die Waren vor Ablauf der Frist von vierzehn
                Tagen absenden.
              </p>
              <p className="mb-4">
                Sie tragen die unmittelbaren Kosten der Rücksendung der Waren.
              </p>
              <p className="mb-4">
                Sie müssen für einen etwaigen Wertverlust der Waren nur aufkommen, wenn
                dieser Wertverlust auf einen zur Prüfung der Beschaffenheit,
                Eigenschaften und Funktionsweise der Waren nicht notwendigen Umgang mit
                ihnen zurückzuführen ist.
              </p>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded">
              <h3 className="text-xl font-semibold text-[#1e40af] mb-3">
                Ausschluss bzw. vorzeitiges Erlöschen des Widerrufsrechts
              </h3>
              <p className="mb-4">
                Das Widerrufsrecht besteht nicht bei folgenden Verträgen:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>
                  Verträge zur Lieferung von Waren, die nicht vorgefertigt sind und für
                  deren Herstellung eine individuelle Auswahl oder Bestimmung durch den
                  Verbraucher maßgeblich ist oder die eindeutig auf die persönlichen
                  Bedürfnisse des Verbrauchers zugeschnitten sind
                </li>
                <li>
                  Verträge zur Lieferung versiegelter Waren, die aus Gründen des
                  Gesundheitsschutzes oder der Hygiene nicht zur Rückgabe geeignet sind,
                  wenn ihre Versiegelung nach der Lieferung entfernt wurde
                </li>
                <li>
                  Verträge zur Lieferung von Waren, wenn diese nach der Lieferung
                  aufgrund ihrer Beschaffenheit untrennbar mit anderen Gütern vermischt
                  wurden
                </li>
              </ul>
              <p className="text-sm">
                Das Widerrufsrecht erlischt vorzeitig bei Verträgen zur Lieferung von
                Ton- oder Videoaufnahmen oder Computersoftware in einer versiegelten
                Packung, wenn die Versiegelung nach der Lieferung entfernt wurde.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Muster-Widerrufsformular
            </h2>

            <div className="bg-gray-50 p-8 rounded-lg border-2 border-gray-300">
              <p className="mb-6 text-sm text-gray-600">
                (Wenn Sie den Vertrag widerrufen wollen, dann füllen Sie bitte dieses
                Formular aus und senden Sie es zurück.)
              </p>

              <div className="bg-white p-6 rounded-lg mb-6">
                <p className="mb-4">
                  <strong>An:</strong>
                </p>
                <p>Bodenjäger GmbH</p>
                <p>Musterstraße 123</p>
                <p className="mb-4">41836 Hückelhoven</p>
                <p>E-Mail: widerruf@bodenjaeger.de</p>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="mb-4">
                    Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*)
                    abgeschlossenen Vertrag über den Kauf der folgenden Waren (*) / die
                    Erbringung der folgenden Dienstleistung (*)
                  </p>
                  <div className="border-b-2 border-gray-300 pb-2 mb-2"></div>
                </div>

                <div>
                  <p className="mb-2">Bestellt am (*) / erhalten am (*)</p>
                  <div className="border-b-2 border-gray-300 pb-2 mb-2"></div>
                </div>

                <div>
                  <p className="mb-2">Name des/der Verbraucher(s)</p>
                  <div className="border-b-2 border-gray-300 pb-2 mb-2"></div>
                </div>

                <div>
                  <p className="mb-2">Anschrift des/der Verbraucher(s)</p>
                  <div className="border-b-2 border-gray-300 pb-2 mb-2"></div>
                  <div className="border-b-2 border-gray-300 pb-2 mb-2"></div>
                </div>

                <div>
                  <p className="mb-2">
                    Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier)
                  </p>
                  <div className="border-b-2 border-gray-300 pb-2 mb-6"></div>
                </div>

                <div>
                  <p className="mb-2">Datum</p>
                  <div className="border-b-2 border-gray-300 pb-2 mb-2"></div>
                </div>

                <p className="text-sm text-gray-600 mt-6">
                  (*) Unzutreffendes streichen.
                </p>
              </div>
            </div>

            <div className="mt-6 bg-blue-50 p-4 rounded-lg">
              <p className="text-sm">
                <strong>Hinweis:</strong> Sie können dieses Formular ausdrucken,
                ausfüllen und per Post oder E-Mail an uns senden. Alternativ können Sie
                uns Ihren Widerruf auch formlos per E-Mail oder Brief mitteilen.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Praktische Hinweise zur Rücksendung
            </h2>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-[#1e40af] mb-3">
                Rücksendung der Ware
              </h3>
              <p className="mb-4">
                Bitte senden Sie die Ware vollständig und in der Originalverpackung an
                folgende Adresse zurück:
              </p>
              <div className="bg-white p-4 rounded mb-4">
                <p className="font-semibold">Bodenjäger GmbH</p>
                <p>Retouren</p>
                <p>Musterstraße 123</p>
                <p>41836 Hückelhoven</p>
              </div>

              <h3 className="text-xl font-semibold text-[#1e40af] mb-3 mt-6">
                Wichtige Hinweise
              </h3>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  Verpacken Sie die Ware sorgfältig für den Rückversand
                </li>
                <li>
                  Bewahren Sie den Versandbeleg als Nachweis auf
                </li>
                <li>
                  Versenden Sie die Ware versichert, um sich gegen Verlust oder
                  Beschädigung abzusichern
                </li>
                <li>
                  Legen Sie eine Kopie Ihrer Widerrufserklärung oder Ihre
                  Bestellnummer bei
                </li>
                <li>
                  Nach Eingang und Prüfung der Ware erstatten wir Ihnen den
                  Kaufpreis innerhalb von 14 Tagen
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Fragen zum Widerrufsrecht?
            </h2>
            <p className="mb-4">
              Bei Fragen zum Widerrufsrecht oder zur Rücksendung kontaktieren Sie uns
              gerne:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="mb-2">
                <strong>Telefon:</strong> +49 (0) 2433 123456
              </p>
              <p className="mb-2">
                <strong>E-Mail:</strong> widerruf@bodenjaeger.de
              </p>
              <p className="text-sm text-gray-600 mt-3">
                Montag bis Freitag: 09:00 - 18:00 Uhr
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
