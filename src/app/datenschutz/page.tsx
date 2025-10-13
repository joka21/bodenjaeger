import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Datenschutzerklärung | Bodenjäger',
  description: 'Datenschutzerklärung von Bodenjäger - Informationen zum Umgang mit Ihren Daten',
}

export default function DatenschutzPage() {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl lg:text-5xl font-bold text-[#1e40af] mb-8">
          Datenschutzerklärung
        </h1>

        <div className="prose prose-lg max-w-none text-gray-700">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              1. Datenschutz auf einen Blick
            </h2>

            <h3 className="text-xl font-semibold text-[#1e40af] mb-3">
              Allgemeine Hinweise
            </h3>
            <p className="mb-4">
              Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit
              Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen.
              Personenbezogene Daten sind alle Daten, mit denen Sie persönlich
              identifiziert werden können. Ausführliche Informationen zum Thema
              Datenschutz entnehmen Sie unserer unter diesem Text aufgeführten
              Datenschutzerklärung.
            </p>

            <h3 className="text-xl font-semibold text-[#1e40af] mb-3">
              Datenerfassung auf dieser Website
            </h3>
            <p className="mb-4">
              <strong>Wer ist verantwortlich für die Datenerfassung auf dieser Website?</strong>
            </p>
            <p className="mb-4">
              Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber.
              Dessen Kontaktdaten können Sie dem Impressum dieser Website entnehmen.
            </p>

            <p className="mb-4">
              <strong>Wie erfassen wir Ihre Daten?</strong>
            </p>
            <p className="mb-4">
              Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen.
              Hierbei kann es sich z.B. um Daten handeln, die Sie in ein Kontaktformular
              eingeben. Andere Daten werden automatisch oder nach Ihrer Einwilligung beim
              Besuch der Website durch unsere IT-Systeme erfasst. Das sind vor allem
              technische Daten (z.B. Internetbrowser, Betriebssystem oder Uhrzeit des
              Seitenaufrufs).
            </p>

            <p className="mb-4">
              <strong>Wofür nutzen wir Ihre Daten?</strong>
            </p>
            <p className="mb-4">
              Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der
              Website zu gewährleisten. Andere Daten können zur Analyse Ihres
              Nutzerverhaltens verwendet werden.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              2. Hosting
            </h2>
            <p className="mb-4">
              Wir hosten die Inhalte unserer Website bei folgendem Anbieter:
            </p>
            <p className="mb-4">
              Diese Website wird extern gehostet. Die personenbezogenen Daten, die auf
              dieser Website erfasst werden, werden auf den Servern des Hosters
              gespeichert. Hierbei kann es sich v.a. um IP-Adressen, Kontaktanfragen,
              Meta- und Kommunikationsdaten, Vertragsdaten, Kontaktdaten, Namen,
              Websitezugriffe und sonstige Daten, die über eine Website generiert werden,
              handeln.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              3. Allgemeine Hinweise und Pflichtinformationen
            </h2>

            <h3 className="text-xl font-semibold text-[#1e40af] mb-3">
              Datenschutz
            </h3>
            <p className="mb-4">
              Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr
              ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und
              entsprechend den gesetzlichen Datenschutzvorschriften sowie dieser
              Datenschutzerklärung.
            </p>
            <p className="mb-4">
              Wenn Sie diese Website benutzen, werden verschiedene personenbezogene Daten
              erhoben. Die vorliegende Datenschutzerklärung erläutert, welche Daten wir
              erheben und wofür wir sie nutzen. Sie erläutert auch, wie und zu welchem
              Zweck das geschieht.
            </p>

            <h3 className="text-xl font-semibold text-[#1e40af] mb-3">
              Hinweis zur verantwortlichen Stelle
            </h3>
            <p className="mb-4">
              Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:
            </p>
            <div className="bg-gray-50 p-4 rounded mb-4">
              <p className="font-semibold">Bodenjäger GmbH</p>
              <p>Musterstraße 123</p>
              <p>41836 Hückelhoven</p>
              <p className="mt-2">Telefon: +49 (0) 2433 123456</p>
              <p>E-Mail: info@bodenjaeger.de</p>
            </div>
            <p className="mb-4">
              Verantwortliche Stelle ist die natürliche oder juristische Person, die
              allein oder gemeinsam mit anderen über die Zwecke und Mittel der
              Verarbeitung von personenbezogenen Daten (z.B. Namen, E-Mail-Adressen o.Ä.)
              entscheidet.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              4. Datenerfassung auf dieser Website
            </h2>

            <h3 className="text-xl font-semibold text-[#1e40af] mb-3">
              Cookies
            </h3>
            <p className="mb-4">
              Unsere Internetseiten verwenden so genannte „Cookies". Cookies sind kleine
              Textdateien und richten auf Ihrem Endgerät keinen Schaden an. Sie werden
              entweder vorübergehend für die Dauer einer Sitzung (Session-Cookies) oder
              dauerhaft (permanente Cookies) auf Ihrem Endgerät gespeichert.
            </p>

            <h3 className="text-xl font-semibold text-[#1e40af] mb-3">
              Server-Log-Dateien
            </h3>
            <p className="mb-4">
              Der Provider der Seiten erhebt und speichert automatisch Informationen in
              so genannten Server-Log-Dateien, die Ihr Browser automatisch an uns
              übermittelt. Dies sind:
            </p>
            <ul className="list-disc list-inside mb-4 space-y-1">
              <li>Browsertyp und Browserversion</li>
              <li>verwendetes Betriebssystem</li>
              <li>Referrer URL</li>
              <li>Hostname des zugreifenden Rechners</li>
              <li>Uhrzeit der Serveranfrage</li>
              <li>IP-Adresse</li>
            </ul>
            <p className="mb-4">
              Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht
              vorgenommen.
            </p>

            <h3 className="text-xl font-semibold text-[#1e40af] mb-3">
              Kontaktformular
            </h3>
            <p className="mb-4">
              Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre
              Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen
              Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von
              Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre
              Einwilligung weiter.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              5. Ihre Rechte
            </h2>
            <p className="mb-4">
              Sie haben das Recht:
            </p>
            <ul className="list-disc list-inside mb-4 space-y-1">
              <li>gemäß Art. 15 DSGVO Auskunft über Ihre von uns verarbeiteten
                personenbezogenen Daten zu verlangen</li>
              <li>gemäß Art. 16 DSGVO unverzüglich die Berichtigung unrichtiger oder
                Vervollständigung Ihrer bei uns gespeicherten personenbezogenen Daten zu
                verlangen</li>
              <li>gemäß Art. 17 DSGVO die Löschung Ihrer bei uns gespeicherten
                personenbezogenen Daten zu verlangen</li>
              <li>gemäß Art. 18 DSGVO die Einschränkung der Verarbeitung Ihrer
                personenbezogenen Daten zu verlangen</li>
              <li>gemäß Art. 20 DSGVO Ihre personenbezogenen Daten in einem
                strukturierten, gängigen und maschinenlesbaren Format zu erhalten</li>
              <li>gemäß Art. 77 DSGVO sich bei einer Aufsichtsbehörde zu beschweren</li>
            </ul>
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
