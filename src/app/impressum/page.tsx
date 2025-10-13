import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Impressum | Bodenjäger',
  description: 'Impressum und rechtliche Informationen von Bodenjäger',
}

export default function ImpressumPage() {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl lg:text-5xl font-bold text-[#1e40af] mb-8">
          Impressum
        </h1>

        <div className="prose prose-lg max-w-none text-gray-700">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Angaben gemäß § 5 TMG
            </h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="font-semibold text-lg mb-2">Bodenjäger GmbH</p>
              <p>Musterstraße 123</p>
              <p className="mb-4">41836 Hückelhoven</p>

              <p className="mb-2">
                <span className="font-semibold">Handelsregister:</span> HRB 12345
              </p>
              <p className="mb-2">
                <span className="font-semibold">Registergericht:</span> Amtsgericht Aachen
              </p>
              <p className="mb-4">
                <span className="font-semibold">Umsatzsteuer-ID:</span> DE123456789
              </p>

              <p className="mb-2">
                <span className="font-semibold">Vertreten durch:</span>
              </p>
              <p className="mb-4">Geschäftsführer: Max Mustermann</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Kontakt
            </h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="mb-2">
                <span className="font-semibold">Telefon:</span> +49 (0) 2433 123456
              </p>
              <p className="mb-2">
                <span className="font-semibold">Telefax:</span> +49 (0) 2433 123457
              </p>
              <p className="mb-2">
                <span className="font-semibold">E-Mail:</span> info@bodenjaeger.de
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Umsatzsteuer-ID
            </h2>
            <p className="mb-4">
              Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:
              <br />
              <strong>DE123456789</strong>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Redaktionell verantwortlich
            </h2>
            <p className="mb-4">
              Max Mustermann
              <br />
              Musterstraße 123
              <br />
              41836 Hückelhoven
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              EU-Streitschlichtung
            </h2>
            <p className="mb-4">
              Die Europäische Kommission stellt eine Plattform zur
              Online-Streitbeilegung (OS) bereit:{' '}
              <a
                href="https://ec.europa.eu/consumers/odr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1e40af] underline"
              >
                https://ec.europa.eu/consumers/odr
              </a>
              .
            </p>
            <p className="mb-4">
              Unsere E-Mail-Adresse finden Sie oben im Impressum.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Verbraucherstreitbeilegung/Universalschlichtungsstelle
            </h2>
            <p className="mb-4">
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor
              einer Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Haftung für Inhalte
            </h2>
            <p className="mb-4">
              Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf
              diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis
              10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte
              oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu
              forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
            </p>
            <p className="mb-4">
              Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen
              nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine
              diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer
              konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden
              Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Haftung für Links
            </h2>
            <p className="mb-4">
              Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte
              wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte
              auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist
              stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die
              verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche
              Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der
              Verlinkung nicht erkennbar.
            </p>
            <p className="mb-4">
              Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne
              konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei
              Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend
              entfernen.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Urheberrecht
            </h2>
            <p className="mb-4">
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen
              Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung,
              Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen
              des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen
              Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den
              privaten, nicht kommerziellen Gebrauch gestattet.
            </p>
            <p className="mb-4">
              Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden,
              werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte
              Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine
              Urheberrechtsverletzung aufmerksam werden, bitten wir um einen
              entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir
              derartige Inhalte umgehend entfernen.
            </p>
          </section>

          <section>
            <p className="text-sm text-gray-600">
              Quelle: eRecht24
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
