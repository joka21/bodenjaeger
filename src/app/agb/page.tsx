import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AGB | Bodenjäger',
  description: 'Allgemeine Geschäftsbedingungen von Bodenjäger',
}

export default function AGBPage() {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl lg:text-5xl font-bold text-[#1e40af] mb-8">
          Allgemeine Geschäftsbedingungen
        </h1>

        <div className="prose prose-lg max-w-none text-gray-700">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              1. Geltungsbereich
            </h2>
            <p className="mb-4">
              Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Verträge über
              die Lieferung von Waren und Dienstleistungen, die zwischen der Bodenjäger
              GmbH (nachfolgend &bdquo;Verkäufer&ldquo; genannt) und dem Kunden (nachfolgend &bdquo;Käufer&ldquo;
              genannt) geschlossen werden.
            </p>
            <p className="mb-4">
              Abweichende, entgegenstehende oder ergänzende Allgemeine
              Geschäftsbedingungen des Käufers werden nur dann und insoweit
              Vertragsbestandteil, als der Verkäufer ihrer Geltung ausdrücklich
              schriftlich zugestimmt hat.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              2. Vertragsschluss
            </h2>
            <p className="mb-4">
              Die Darstellung der Produkte im Online-Shop stellt kein rechtlich bindendes
              Angebot, sondern eine Aufforderung zur Bestellung dar. Durch Anklicken des
              Buttons &bdquo;Kaufen&ldquo; oder &bdquo;Bestellen&ldquo; gibt der Käufer ein verbindliches Angebot
              zum Kaufvertragsschluss ab.
            </p>
            <p className="mb-4">
              Der Verkäufer bestätigt den Eingang der Bestellung per E-Mail. Diese
              Auftragsbestätigung stellt noch keine Annahme des Angebots dar, sondern
              dient lediglich der Information, dass die Bestellung beim Verkäufer
              eingegangen ist. Die Erklärung der Annahme des Angebots erfolgt durch die
              Auslieferung der Ware oder eine ausdrückliche Annahmeerklärung.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              3. Preise und Zahlungsbedingungen
            </h2>
            <p className="mb-4">
              Alle Preise verstehen sich inklusive der gesetzlichen Mehrwertsteuer. Die
              Versandkosten werden im Bestellvorgang gesondert ausgewiesen.
            </p>
            <p className="mb-4">
              Die Zahlung erfolgt wahlweise per:
            </p>
            <ul className="list-disc list-inside mb-4 space-y-1">
              <li>Vorkasse/Überweisung</li>
              <li>Kreditkarte</li>
              <li>PayPal</li>
              <li>Rechnung (nach Prüfung der Bonität)</li>
            </ul>
            <p className="mb-4">
              Bei Zahlung per Vorkasse ist der Kaufpreis innerhalb von 7 Tagen nach
              Vertragsschluss zur Zahlung fällig.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              4. Lieferung und Versand
            </h2>
            <p className="mb-4">
              Die Lieferung erfolgt an die vom Käufer angegebene Lieferadresse. Der
              Verkäufer ist zu Teillieferungen berechtigt, soweit dies für den Käufer
              zumutbar ist.
            </p>
            <p className="mb-4">
              Die Lieferzeit beträgt in der Regel 3-7 Werktage, sofern nicht in der
              Produktbeschreibung eine abweichende Lieferzeit angegeben ist. Bei Zahlung
              per Vorkasse beginnt die Lieferzeit nach Zahlungseingang.
            </p>
            <p className="mb-4">
              Die Gefahr des zufälligen Untergangs und der zufälligen Verschlechterung
              geht mit der Übergabe der Ware an den Käufer oder eine empfangsberechtigte
              Person über.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              5. Eigentumsvorbehalt
            </h2>
            <p className="mb-4">
              Die gelieferte Ware bleibt bis zur vollständigen Bezahlung des Kaufpreises
              Eigentum des Verkäufers.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              6. Widerrufsrecht für Verbraucher
            </h2>
            <p className="mb-4">
              Verbraucher haben ein vierzehntägiges Widerrufsrecht. Die Widerrufsfrist
              beträgt vierzehn Tage ab dem Tag, an dem Sie oder ein von Ihnen benannter
              Dritter, der nicht der Beförderer ist, die Waren in Besitz genommen haben
              bzw. hat.
            </p>
            <p className="mb-4">
              Um Ihr Widerrufsrecht auszuüben, müssen Sie uns mittels einer eindeutigen
              Erklärung (z.B. ein mit der Post versandter Brief oder E-Mail) über Ihren
              Entschluss, diesen Vertrag zu widerrufen, informieren.
            </p>
            <div className="bg-gray-50 p-6 rounded-lg mb-4">
              <p className="font-semibold mb-2">Widerrufsadresse:</p>
              <p>Bodenjäger GmbH</p>
              <p>Musterstraße 123</p>
              <p>41836 Hückelhoven</p>
              <p className="mt-2">E-Mail: widerruf@bodenjaeger.de</p>
            </div>
            <p className="mb-4">
              Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung über
              die Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist absenden.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              7. Gewährleistung
            </h2>
            <p className="mb-4">
              Es gelten die gesetzlichen Gewährleistungsrechte. Die Verjährungsfrist für
              Gewährleistungsansprüche beträgt bei Verbrauchern zwei Jahre, bei
              Unternehmern ein Jahr, jeweils beginnend mit der Ablieferung der Ware.
            </p>
            <p className="mb-4">
              Bei berechtigten Beanstandungen erfolgt nach Wahl des Verkäufers Nacherfüllung
              durch Beseitigung des Mangels (Nachbesserung) oder durch Lieferung einer
              mangelfreien Sache (Ersatzlieferung).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              8. Haftung
            </h2>
            <p className="mb-4">
              Der Verkäufer haftet unbeschränkt für Vorsatz und grobe Fahrlässigkeit. Bei
              leichter Fahrlässigkeit haftet der Verkäufer nur bei Verletzung einer
              wesentlichen Vertragspflicht (Kardinalpflicht), deren Erfüllung die
              ordnungsgemäße Durchführung des Vertrages überhaupt erst ermöglicht und auf
              deren Einhaltung der Vertragspartner regelmäßig vertrauen darf.
            </p>
            <p className="mb-4">
              Die Haftung für Schäden aus der Verletzung des Lebens, des Körpers oder der
              Gesundheit und nach dem Produkthaftungsgesetz bleibt unberührt.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              9. Verlegungsleistungen
            </h2>
            <p className="mb-4">
              Soweit der Verkäufer Verlegungsleistungen anbietet, werden diese auf
              Grundlage eines separaten Vertrages erbracht. Die Leistungen werden nach den
              anerkannten Regeln der Technik und fachgerecht ausgeführt.
            </p>
            <p className="mb-4">
              Voraussetzung für eine fachgerechte Verlegung ist ein für die jeweilige
              Bodenbelagsart geeigneter Untergrund. Der Käufer stellt sicher, dass der
              Untergrund vor Beginn der Verlegung die erforderlichen Eigenschaften
              aufweist.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              10. Streitbeilegung
            </h2>
            <p className="mb-4">
              Die Europäische Kommission stellt eine Plattform zur
              Online-Streitbeilegung (OS) bereit, die Sie unter{' '}
              <a
                href="https://ec.europa.eu/consumers/odr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1e40af] underline"
              >
                https://ec.europa.eu/consumers/odr
              </a>{' '}
              finden.
            </p>
            <p className="mb-4">
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor
              einer Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              11. Schlussbestimmungen
            </h2>
            <p className="mb-4">
              Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des
              UN-Kaufrechts. Bei Verbrauchern gilt diese Rechtswahl nur insoweit, als
              nicht der gewährte Schutz durch zwingende Bestimmungen des Rechts des
              Staates, in dem der Verbraucher seinen gewöhnlichen Aufenthalt hat,
              entzogen wird.
            </p>
            <p className="mb-4">
              Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, bleibt
              die Wirksamkeit der übrigen Bestimmungen hiervon unberührt.
            </p>
          </section>

          <section>
            <p className="text-sm text-gray-600">
              Stand: Januar 2025
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
