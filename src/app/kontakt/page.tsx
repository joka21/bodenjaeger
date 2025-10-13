import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kontakt | Bodenjäger',
  description: 'Kontaktieren Sie uns - Wir sind für Sie da',
}

export default function KontaktPage() {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl lg:text-5xl font-bold text-[#1e40af] mb-8">
          Kontakt
        </h1>

        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Wir sind für Sie da
            </h2>
            <p className="text-gray-700 mb-4">
              Haben Sie Fragen zu unseren Produkten oder Dienstleistungen? Möchten Sie
              einen Beratungstermin vereinbaren? Unser Team steht Ihnen gerne zur
              Verfügung. Kontaktieren Sie uns per Telefon, E-Mail oder besuchen Sie uns
              direkt in unserem Fachmarkt.
            </p>
          </section>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <section>
              <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
                Kontaktdaten
              </h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="font-semibold text-lg mb-4">Bodenjäger GmbH</p>

                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-[#1e40af]">Adresse</p>
                    <p className="text-gray-700">Musterstraße 123</p>
                    <p className="text-gray-700">41836 Hückelhoven</p>
                  </div>

                  <div>
                    <p className="font-semibold text-[#1e40af]">Telefon</p>
                    <p className="text-gray-700">+49 (0) 2433 123456</p>
                  </div>

                  <div>
                    <p className="font-semibold text-[#1e40af]">Fax</p>
                    <p className="text-gray-700">+49 (0) 2433 123457</p>
                  </div>

                  <div>
                    <p className="font-semibold text-[#1e40af]">E-Mail</p>
                    <p className="text-gray-700">info@bodenjaeger.de</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
                Öffnungszeiten
              </h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-[#1e40af]">Montag - Freitag</p>
                    <p className="text-gray-700">09:00 - 18:00 Uhr</p>
                  </div>

                  <div>
                    <p className="font-semibold text-[#1e40af]">Samstag</p>
                    <p className="text-gray-700">09:00 - 14:00 Uhr</p>
                  </div>

                  <div>
                    <p className="font-semibold text-[#1e40af]">Sonntag</p>
                    <p className="text-gray-700">Geschlossen</p>
                  </div>

                  <div className="pt-2 border-t border-gray-300">
                    <p className="text-sm text-gray-600">
                      An Feiertagen gelten abweichende Öffnungszeiten
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Kontaktformular
            </h2>
            <div className="bg-gray-50 p-8 rounded-lg">
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-semibold text-[#1e40af] mb-2"
                    >
                      Vorname *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-semibold text-[#1e40af] mb-2"
                    >
                      Nachname *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-[#1e40af] mb-2"
                  >
                    E-Mail-Adresse *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-semibold text-[#1e40af] mb-2"
                  >
                    Telefon
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-semibold text-[#1e40af] mb-2"
                  >
                    Betreff *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-semibold text-[#1e40af] mb-2"
                  >
                    Ihre Nachricht *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
                  />
                </div>

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="privacy"
                    name="privacy"
                    required
                    className="mt-1 mr-3"
                  />
                  <label htmlFor="privacy" className="text-sm text-gray-700">
                    Ich habe die{' '}
                    <a href="/datenschutz" className="text-[#1e40af] underline">
                      Datenschutzerklärung
                    </a>{' '}
                    zur Kenntnis genommen. Ich stimme zu, dass meine Angaben zur
                    Kontaktaufnahme und für Rückfragen gespeichert werden. *
                  </label>
                </div>

                <div>
                  <button
                    type="submit"
                    className="bg-[#1e40af] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#1e3a8a] transition-colors"
                  >
                    Nachricht senden
                  </button>
                </div>

                <p className="text-sm text-gray-600">* Pflichtfelder</p>
              </form>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Anfahrt
            </h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 mb-4">
                Unser Fachmarkt liegt zentral in Hückelhoven und ist bequem mit dem Auto
                oder öffentlichen Verkehrsmitteln erreichbar.
              </p>
              <div className="mb-4">
                <p className="font-semibold text-[#1e40af] mb-2">Mit dem Auto</p>
                <p className="text-gray-700">
                  Über die A46 Abfahrt Hückelhoven, dann Richtung Zentrum. Kostenlose
                  Parkplätze sind direkt vor Ort verfügbar.
                </p>
              </div>
              <div>
                <p className="font-semibold text-[#1e40af] mb-2">
                  Mit öffentlichen Verkehrsmitteln
                </p>
                <p className="text-gray-700">
                  Bushaltestelle „Hückelhoven Zentrum" ca. 200m entfernt (Linien 401, 404)
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Beratungstermin vereinbaren
            </h2>
            <p className="text-gray-700 mb-4">
              Für eine ausführliche Beratung empfehlen wir Ihnen, vorab einen Termin zu
              vereinbaren. So können wir uns optimal auf Ihre Wünsche und Fragen
              vorbereiten und Ihnen die bestmögliche Beratung bieten.
            </p>
            <p className="text-gray-700">
              Rufen Sie uns einfach an oder schreiben Sie uns eine E-Mail mit Ihrem
              Wunschtermin.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
