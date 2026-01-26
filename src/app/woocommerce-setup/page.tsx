import Link from 'next/link';

export default function WooCommerceSetupPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-6">
          <Link href="/" className="flex items-center space-x-2">
            <div className="font-bold text-2xl text-[#2e2d32]">Bodenjäger</div>
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-[#2e2d32] mb-4">
          WooCommerce Backend Setup
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Komplette Checkliste für WordPress/WooCommerce Backend-Konfiguration
        </p>

        {/* Status Box */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-12">
          <h2 className="text-xl font-bold text-[#2e2d32] mb-3">📊 Wichtig</h2>
          <p className="text-gray-700">
            Diese Einstellungen müssen im <strong>WordPress Backend</strong> unter{' '}
            <a
              href="https://plan-dein-ding.de/wp-admin"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline font-semibold"
            >
              plan-dein-ding.de/wp-admin
            </a>{' '}
            vorgenommen werden.
          </p>
        </div>

        {/* Schritt 1: WooCommerce Seiten */}
        <section className="mb-12">
          <div className="bg-[#7f54b3] text-white p-6 rounded-t-lg">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <span>📄</span> Schritt 1: WooCommerce Seiten einrichten
            </h2>
          </div>
          <div className="border-2 border-gray-200 rounded-b-lg p-6">
            <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 mb-6">
              <p className="text-red-800 font-semibold mb-2">
                ⚠️ PFLICHT: Ohne diese Seiten funktioniert der Checkout nicht!
              </p>
              <p className="text-red-700 text-sm">
                WooCommerce benötigt spezielle Seiten für Shop, Warenkorb, Kasse und Kundenkonto.
              </p>
            </div>

            <h3 className="text-xl font-bold text-[#2e2d32] mb-4">Navigation:</h3>
            <div className="bg-gray-100 px-4 py-2 rounded-lg mb-6 font-mono text-sm">
              WooCommerce → Einstellungen → Erweitert → Seiteneinrichtung
            </div>

            <h3 className="text-xl font-bold text-[#2e2d32] mb-4">Benötigte Seiten:</h3>
            <div className="space-y-4">
              <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">🛒</span>
                  <h4 className="font-bold text-lg">Shop-Seite</h4>
                </div>
                <p className="text-gray-700 text-sm">
                  <strong>Slug:</strong> <code className="bg-gray-100 px-2 py-1 rounded">/shop</code> oder{' '}
                  <code className="bg-gray-100 px-2 py-1 rounded">/produkte</code>
                  <br />
                  <strong>Funktion:</strong> Hauptseite für alle Produkte
                </p>
              </div>

              <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">🛍️</span>
                  <h4 className="font-bold text-lg">Warenkorb-Seite</h4>
                </div>
                <p className="text-gray-700 text-sm">
                  <strong>Slug:</strong> <code className="bg-gray-100 px-2 py-1 rounded">/warenkorb</code> oder{' '}
                  <code className="bg-gray-100 px-2 py-1 rounded">/cart</code>
                  <br />
                  <strong>Funktion:</strong> Warenkorb-Übersicht
                  <br />
                  <strong>Shortcode:</strong> <code className="bg-gray-100 px-2 py-1 rounded">[woocommerce_cart]</code>
                </p>
              </div>

              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">💳</span>
                  <h4 className="font-bold text-lg">Kasse-Seite (WICHTIGSTE SEITE!)</h4>
                </div>
                <p className="text-gray-700 text-sm">
                  <strong>Slug:</strong> <code className="bg-gray-100 px-2 py-1 rounded">/kasse</code> oder{' '}
                  <code className="bg-gray-100 px-2 py-1 rounded">/checkout</code>
                  <br />
                  <strong>Funktion:</strong> Checkout-Formular für Bestellabschluss
                  <br />
                  <strong>Shortcode:</strong> <code className="bg-gray-100 px-2 py-1 rounded">[woocommerce_checkout]</code>
                </p>
              </div>

              <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">👤</span>
                  <h4 className="font-bold text-lg">Mein Konto-Seite</h4>
                </div>
                <p className="text-gray-700 text-sm">
                  <strong>Slug:</strong> <code className="bg-gray-100 px-2 py-1 rounded">/mein-konto</code> oder{' '}
                  <code className="bg-gray-100 px-2 py-1 rounded">/my-account</code>
                  <br />
                  <strong>Funktion:</strong> Kundenbereich mit Bestellübersicht
                  <br />
                  <strong>Shortcode:</strong> <code className="bg-gray-100 px-2 py-1 rounded">[woocommerce_my_account]</code>
                </p>
              </div>

              <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">📜</span>
                  <h4 className="font-bold text-lg">Geschäftsbedingungen (AGB)</h4>
                </div>
                <p className="text-gray-700 text-sm">
                  <strong>Slug:</strong> <code className="bg-gray-100 px-2 py-1 rounded">/agb</code>
                  <br />
                  <strong>Funktion:</strong> AGB - muss im Checkout akzeptiert werden (Pflicht!)
                  <br />
                  <strong>Wichtig:</strong> In WooCommerce → Einstellungen → Erweitert → Geschäftsbedingungen auswählen
                </p>
              </div>
            </div>

            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mt-6">
              <p className="text-green-800 font-semibold mb-2">✅ Seiten automatisch erstellen:</p>
              <p className="text-green-700 text-sm">
                WooCommerce → Einstellungen → Erweitert → Seiteneinrichtung → &quot;Seiten erstellen&quot;
                <br />
                WooCommerce erstellt automatisch alle benötigten Seiten mit den richtigen Shortcodes.
              </p>
            </div>
          </div>
        </section>

        {/* Schritt 2: Versandeinstellungen */}
        <section className="mb-12">
          <div className="bg-[#2563eb] text-white p-6 rounded-t-lg">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <span>📦</span> Schritt 2: Versandeinstellungen
            </h2>
          </div>
          <div className="border-2 border-gray-200 rounded-b-lg p-6">
            <h3 className="text-xl font-bold text-[#2e2d32] mb-4">Navigation:</h3>
            <div className="bg-gray-100 px-4 py-2 rounded-lg mb-6 font-mono text-sm">
              WooCommerce → Einstellungen → Versand
            </div>

            <h3 className="text-xl font-bold text-[#2e2d32] mb-4">Einstellungen:</h3>
            <ol className="list-decimal list-inside space-y-4 text-gray-700">
              <li>
                <strong>Versandzone erstellen:</strong>
                <ul className="list-disc list-inside ml-6 mt-2 space-y-1 text-sm">
                  <li>Name: &quot;Deutschland&quot;</li>
                  <li>Region: Deutschland</li>
                </ul>
              </li>
              <li>
                <strong>Versandmethode hinzufügen:</strong>
                <ul className="list-disc list-inside ml-6 mt-2 space-y-1 text-sm">
                  <li>Methode: &quot;Pauschalpreis&quot; (Flat Rate)</li>
                  <li>Titel: &quot;Standard Versand&quot;</li>
                  <li>Kosten: 49,00 €</li>
                </ul>
              </li>
              <li>
                <strong>Kostenloser Versand (optional):</strong>
                <ul className="list-disc list-inside ml-6 mt-2 space-y-1 text-sm">
                  <li>Methode: &quot;Kostenloser Versand&quot; (Free Shipping)</li>
                  <li>Bedingung: Mindestbestellwert 999,00 €</li>
                </ul>
              </li>
            </ol>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mt-6">
              <p className="text-blue-800 font-semibold mb-2">💡 Aktuelle Frontend-Logik:</p>
              <p className="text-blue-700 text-sm">
                Das Next.js Frontend berechnet aktuell:
                <br />
                <code className="bg-white px-2 py-1 rounded">
                  Versandkosten = Bestellwert &gt;= 999€ ? 0€ : 49€
                </code>
                <br />
                Diese Logik muss mit den WooCommerce-Einstellungen übereinstimmen!
              </p>
            </div>
          </div>
        </section>

        {/* Schritt 3: Zahlungsmethoden */}
        <section className="mb-12">
          <div className="bg-[#10b981] text-white p-6 rounded-t-lg">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <span>💰</span> Schritt 3: Zahlungsmethoden aktivieren
            </h2>
          </div>
          <div className="border-2 border-gray-200 rounded-b-lg p-6">
            <h3 className="text-xl font-bold text-[#2e2d32] mb-4">Navigation:</h3>
            <div className="bg-gray-100 px-4 py-2 rounded-lg mb-6 font-mono text-sm">
              WooCommerce → Einstellungen → Zahlungen
            </div>

            <h3 className="text-xl font-bold text-[#2e2d32] mb-4">Verfügbare Methoden:</h3>

            <div className="space-y-4">
              {/* BACS */}
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">✅</span>
                  <h4 className="font-bold text-lg">Vorkasse / Überweisung (BACS)</h4>
                </div>
                <p className="text-gray-700 text-sm mb-3">
                  <strong>Status:</strong> Funktioniert sofort, keine externe Integration nötig
                </p>
                <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
                  <li>Aktivieren durch Toggle-Switch</li>
                  <li>&quot;Verwalten&quot; klicken</li>
                  <li>Kontodaten eingeben:
                    <ul className="list-disc list-inside ml-6 mt-1">
                      <li>Kontoinhaber</li>
                      <li>IBAN</li>
                      <li>Bank-Name</li>
                      <li>BIC (optional)</li>
                    </ul>
                  </li>
                  <li>Anweisungen für Kunden eingeben (z.B. &quot;Bitte Bestellnummer als Verwendungszweck angeben&quot;)</li>
                  <li>Speichern</li>
                </ol>
                <div className="bg-white border border-green-300 rounded p-3 mt-3">
                  <p className="text-green-800 text-sm">
                    <strong>Empfehlung:</strong> Als erste Zahlungsmethode aktivieren, damit du sofort testen kannst!
                  </p>
                </div>
              </div>

              {/* Stripe */}
              <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">💳</span>
                  <h4 className="font-bold text-lg">Kreditkarte (Stripe) - Optional</h4>
                </div>
                <p className="text-gray-700 text-sm mb-3">
                  <strong>Voraussetzung:</strong> Stripe Plugin installiert + API Keys konfiguriert
                </p>
                <p className="text-gray-700 text-sm">
                  <strong>Details:</strong> Siehe{' '}
                  <Link href="/payment-setup" className="text-blue-600 hover:underline font-semibold">
                    /payment-setup
                  </Link>
                </p>
              </div>

              {/* PayPal */}
              <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">💰</span>
                  <h4 className="font-bold text-lg">PayPal - Optional</h4>
                </div>
                <p className="text-gray-700 text-sm mb-3">
                  <strong>Voraussetzung:</strong> PayPal Business Account + API Credentials
                </p>
                <p className="text-gray-700 text-sm">
                  <strong>Details:</strong> Siehe{' '}
                  <Link href="/payment-setup" className="text-blue-600 hover:underline font-semibold">
                    /payment-setup
                  </Link>
                </p>
              </div>

              {/* Nachnahme */}
              <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">📮</span>
                  <h4 className="font-bold text-lg">Nachnahme (COD) - Optional</h4>
                </div>
                <p className="text-gray-700 text-sm">
                  Aktivieren und Nachnahmegebühr festlegen (z.B. 5,00 €)
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Schritt 4: E-Mail-Templates */}
        <section className="mb-12">
          <div className="bg-[#f59e0b] text-white p-6 rounded-t-lg">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <span>📧</span> Schritt 4: E-Mail-Templates konfigurieren
            </h2>
          </div>
          <div className="border-2 border-gray-200 rounded-b-lg p-6">
            <h3 className="text-xl font-bold text-[#2e2d32] mb-4">Navigation:</h3>
            <div className="bg-gray-100 px-4 py-2 rounded-lg mb-6 font-mono text-sm">
              WooCommerce → Einstellungen → E-Mails
            </div>

            <h3 className="text-xl font-bold text-[#2e2d32] mb-4">Wichtige E-Mail-Templates:</h3>

            <div className="space-y-3">
              <div className="flex items-start gap-3 bg-white border border-gray-200 rounded-lg p-3">
                <span className="text-xl">📩</span>
                <div>
                  <h4 className="font-bold text-[#2e2d32]">Neue Bestellung (an Admin)</h4>
                  <p className="text-sm text-gray-600">
                    Benachrichtigt dich über neue Bestellungen - AKTIVIEREN!
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-yellow-50 border-2 border-yellow-300 rounded-lg p-3">
                <span className="text-xl">✉️</span>
                <div>
                  <h4 className="font-bold text-[#2e2d32]">Bestellbestätigung (an Kunde) - WICHTIG!</h4>
                  <p className="text-sm text-gray-600">
                    Kunde erhält Bestätigung mit Bestellnummer - MUSS aktiviert sein!
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white border border-gray-200 rounded-lg p-3">
                <span className="text-xl">🔄</span>
                <div>
                  <h4 className="font-bold text-[#2e2d32]">Bestellung wird bearbeitet</h4>
                  <p className="text-sm text-gray-600">
                    Nach Zahlungseingang - optional aber empfohlen
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white border border-gray-200 rounded-lg p-3">
                <span className="text-xl">✅</span>
                <div>
                  <h4 className="font-bold text-[#2e2d32]">Bestellung abgeschlossen</h4>
                  <p className="text-sm text-gray-600">
                    Nach Versand - optional
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white border border-gray-200 rounded-lg p-3">
                <span className="text-xl">🧾</span>
                <div>
                  <h4 className="font-bold text-[#2e2d32]">Rechnung (an Kunde)</h4>
                  <p className="text-sm text-gray-600">
                    Bei Vorkasse/Überweisung - AKTIVIEREN!
                  </p>
                </div>
              </div>
            </div>

            <h3 className="text-xl font-bold text-[#2e2d32] mt-6 mb-4">E-Mail-Absender konfigurieren:</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700 text-sm">
              <li>Absender-Name: &quot;Bodenjäger&quot; oder &quot;Jäger GmbH&quot;</li>
              <li>Absender-E-Mail: info@plan-dein-ding.de (oder shop@...)</li>
              <li>Header-Logo hochladen (optional)</li>
              <li>Fußzeile anpassen (Impressum, Kontakt)</li>
            </ol>

            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 mt-6">
              <p className="text-yellow-800 font-semibold mb-2">⚠️ SMTP-Server empfohlen:</p>
              <p className="text-yellow-700 text-sm">
                Standard PHP mail() ist oft unzuverlässig. Verwende ein SMTP-Plugin wie:
                <br />
                • <strong>WP Mail SMTP</strong> (mit SendGrid, Mailgun, Amazon SES)
                <br />
                • <strong>Post SMTP</strong>
                <br />
                → Verhindert, dass E-Mails im Spam landen
              </p>
            </div>
          </div>
        </section>

        {/* Schritt 5: Steuersätze */}
        <section className="mb-12">
          <div className="bg-[#8b5cf6] text-white p-6 rounded-t-lg">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <span>💶</span> Schritt 5: Steuersätze (MwSt.)
            </h2>
          </div>
          <div className="border-2 border-gray-200 rounded-b-lg p-6">
            <h3 className="text-xl font-bold text-[#2e2d32] mb-4">Navigation:</h3>
            <div className="bg-gray-100 px-4 py-2 rounded-lg mb-6 font-mono text-sm">
              WooCommerce → Einstellungen → Steuern
            </div>

            <h3 className="text-xl font-bold text-[#2e2d32] mb-4">Deutschland:</h3>
            <div className="space-y-3">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <p className="font-bold text-[#2e2d32] mb-2">Standardsteuersatz (Deutschland):</p>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  <li>Steuersatz: <strong>19%</strong> (Mehrwertsteuer)</li>
                  <li>Ländercode: DE</li>
                  <li>Für: Bodenbeläge, Zubehör, Sockelleisten</li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <p className="font-bold text-[#2e2d32] mb-2">Ermäßigter Steuersatz (optional):</p>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  <li>Steuersatz: <strong>7%</strong></li>
                  <li>Nur falls du Artikel mit ermäßigter MwSt. verkaufst</li>
                </ul>
              </div>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mt-6">
              <p className="text-blue-800 font-semibold mb-2">💡 Tipp:</p>
              <p className="text-blue-700 text-sm">
                <strong>&quot;Preise inklusive oder exklusive Steuern?&quot;</strong>
                <br />
                → WooCommerce → Einstellungen → Steuern → Preise inklusive Steuern eingegeben: <strong>JA</strong>
                <br />
                (Da alle Produktpreise bereits inkl. 19% MwSt. sind)
              </p>
            </div>
          </div>
        </section>

        {/* Schritt 6: Rechtliche Seiten */}
        <section className="mb-12">
          <div className="bg-[#ef4444] text-white p-6 rounded-t-lg">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <span>⚖️</span> Schritt 6: Rechtliche Seiten (Pflicht!)
            </h2>
          </div>
          <div className="border-2 border-gray-200 rounded-b-lg p-6">
            <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 mb-6">
              <p className="text-red-800 font-semibold mb-2">
                🚨 RECHTLICH VERPFLICHTEND für Online-Shops in Deutschland!
              </p>
              <p className="text-red-700 text-sm">
                Ohne diese Seiten drohen Abmahnungen. Alle Seiten müssen vollständig und aktuell sein.
              </p>
            </div>

            <h3 className="text-xl font-bold text-[#2e2d32] mb-4">Benötigte Seiten erstellen:</h3>

            <div className="space-y-4">
              <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
                <h4 className="font-bold text-[#2e2d32] mb-2">1. Impressum</h4>
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Slug:</strong> <code className="bg-gray-100 px-2 py-1 rounded">/impressum</code>
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Inhalt:</strong> Name, Anschrift, Kontakt, Handelsregister, USt-ID, etc.
                  <br />
                  <strong>Tipp:</strong> Generator verwenden (z.B. eRecht24, IT-Recht-Kanzlei)
                </p>
              </div>

              <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
                <h4 className="font-bold text-[#2e2d32] mb-2">2. Datenschutzerklärung</h4>
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Slug:</strong> <code className="bg-gray-100 px-2 py-1 rounded">/datenschutz</code>
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Inhalt:</strong> DSGVO-konform, inkl. WooCommerce, Stripe, PayPal
                  <br />
                  <strong>Wichtig:</strong> Erwähne Zahlungsanbieter, die du nutzt!
                </p>
              </div>

              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
                <h4 className="font-bold text-[#2e2d32] mb-2">3. AGB (Allgemeine Geschäftsbedingungen)</h4>
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Slug:</strong> <code className="bg-gray-100 px-2 py-1 rounded">/agb</code>
                </p>
                <p className="text-sm text-gray-700 mb-3">
                  <strong>Inhalt:</strong> Vertragsschluss, Widerrufsrecht, Versand, Zahlung, Gewährleistung
                </p>
                <p className="text-sm text-yellow-800 font-semibold">
                  ⚠️ Diese Seite muss in WooCommerce verknüpft werden:
                  <br />
                  WooCommerce → Einstellungen → Erweitert → Geschäftsbedingungen → Seite auswählen
                </p>
              </div>

              <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
                <h4 className="font-bold text-[#2e2d32] mb-2">4. Widerrufsbelehrung</h4>
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Slug:</strong> <code className="bg-gray-100 px-2 py-1 rounded">/widerruf</code>
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Inhalt:</strong> 14 Tage Widerrufsrecht, Muster-Widerrufsformular
                  <br />
                  <strong>Wichtig:</strong> Muss auch in Bestellbestätigungs-E-Mail verlinkt sein
                </p>
              </div>

              <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
                <h4 className="font-bold text-[#2e2d32] mb-2">5. Versand & Lieferzeit</h4>
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Slug:</strong> <code className="bg-gray-100 px-2 py-1 rounded">/versand-lieferzeit</code>
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Inhalt:</strong> Versandkosten, Lieferzeiten, Versanddienstleister
                </p>
              </div>
            </div>

            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mt-6">
              <p className="text-green-800 font-semibold mb-2">✅ Rechtssicher mit Generatoren:</p>
              <ul className="text-green-700 text-sm space-y-1">
                <li>• <strong>eRecht24</strong> - Kostenloser Generator für Impressum & Datenschutz</li>
                <li>• <strong>IT-Recht-Kanzlei</strong> - Professionelle AGB-Erstellung</li>
                <li>• <strong>Händlerbund</strong> - Komplettservice für alle Rechtstexte</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Schritt 7: Allgemeine Einstellungen */}
        <section className="mb-12">
          <div className="bg-[#6366f1] text-white p-6 rounded-t-lg">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <span>⚙️</span> Schritt 7: Allgemeine WooCommerce-Einstellungen
            </h2>
          </div>
          <div className="border-2 border-gray-200 rounded-b-lg p-6">
            <h3 className="text-xl font-bold text-[#2e2d32] mb-4">Wichtige Einstellungen prüfen:</h3>

            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-[#2e2d32] mb-2">🌍 Allgemein (WooCommerce → Einstellungen → Allgemein)</h4>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-4">
                  <li>Verkaufsland: Deutschland</li>
                  <li>Währung: Euro (€)</li>
                  <li>Tausendertrennzeichen: . (Punkt)</li>
                  <li>Dezimaltrennzeichen: , (Komma)</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-[#2e2d32] mb-2">📦 Produkte (WooCommerce → Einstellungen → Produkte)</h4>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-4">
                  <li>Shop-Seite: Auswählen (z.B. &quot;Shop&quot; oder &quot;Produkte&quot;)</li>
                  <li>Lagerbestandsverwaltung aktivieren: <strong>JA</strong></li>
                  <li>Benachrichtigungen bei niedrigem Lagerbestand: JA</li>
                  <li>Schwellwert: 5 (oder nach Bedarf)</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-[#2e2d32] mb-2">🔐 Erweitert (WooCommerce → Einstellungen → Erweitert)</h4>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-4">
                  <li>REST API: Aktiviert (für Next.js Frontend)</li>
                  <li>Kasse-Prozess: &quot;Kundenkonto optional&quot; (empfohlen für Gast-Bestellungen)</li>
                  <li>Geschäftsbedingungen: AGB-Seite auswählen</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Schritt 8: Plugins */}
        <section className="mb-12">
          <div className="bg-[#ec4899] text-white p-6 rounded-t-lg">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <span>🔌</span> Schritt 8: Wichtige Plugins prüfen
            </h2>
          </div>
          <div className="border-2 border-gray-200 rounded-b-lg p-6">
            <h3 className="text-xl font-bold text-[#2e2d32] mb-4">Benötigte Plugins:</h3>

            <div className="space-y-3">
              <div className="flex items-start gap-3 bg-green-50 border-2 border-green-200 rounded-lg p-3">
                <span className="text-xl">✅</span>
                <div className="flex-1">
                  <h4 className="font-bold text-[#2e2d32]">Jaeger Plugin</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Custom API für Next.js Frontend - <strong>MUSS AKTIV SEIN!</strong>
                  </p>
                  <p className="text-sm text-green-700">
                    Status: <strong>Aktiv</strong> (API funktioniert: 446 Produkte verfügbar)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white border border-gray-200 rounded-lg p-3">
                <span className="text-xl">📦</span>
                <div>
                  <h4 className="font-bold text-[#2e2d32]">WooCommerce</h4>
                  <p className="text-sm text-gray-600">
                    Core Plugin - sollte auf neuester Version sein
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white border border-gray-200 rounded-lg p-3">
                <span className="text-xl">📧</span>
                <div>
                  <h4 className="font-bold text-[#2e2d32]">WP Mail SMTP (empfohlen)</h4>
                  <p className="text-sm text-gray-600">
                    Für zuverlässigen E-Mail-Versand - verhindert Spam-Probleme
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white border border-gray-200 rounded-lg p-3">
                <span className="text-xl">💳</span>
                <div>
                  <h4 className="font-bold text-[#2e2d32]">Stripe for WooCommerce (optional)</h4>
                  <p className="text-sm text-gray-600">
                    Falls du Stripe als Zahlungsmethode nutzen willst
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white border border-gray-200 rounded-lg p-3">
                <span className="text-xl">💰</span>
                <div>
                  <h4 className="font-bold text-[#2e2d32]">PayPal for WooCommerce (optional)</h4>
                  <p className="text-sm text-gray-600">
                    Falls du PayPal als Zahlungsmethode nutzen willst
                  </p>
                </div>
              </div>
            </div>

            <h3 className="text-xl font-bold text-[#2e2d32] mt-6 mb-4">Plugins prüfen:</h3>
            <div className="bg-gray-100 px-4 py-2 rounded-lg mb-2 font-mono text-sm">
              WordPress Backend → Plugins → Installierte Plugins
            </div>
            <p className="text-sm text-gray-700">
              Stelle sicher, dass alle benötigten Plugins <strong>aktiviert</strong> und <strong>aktuell</strong> sind.
            </p>
          </div>
        </section>

        {/* Schritt 9: Test-Bestellung */}
        <section className="mb-12">
          <div className="bg-[#14b8a6] text-white p-6 rounded-t-lg">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <span>🧪</span> Schritt 9: Test-Bestellung durchführen
            </h2>
          </div>
          <div className="border-2 border-gray-200 rounded-b-lg p-6">
            <h3 className="text-xl font-bold text-[#2e2d32] mb-4">Checkout-Flow testen:</h3>

            <ol className="list-decimal list-inside space-y-4 text-gray-700">
              <li>
                <strong>Produkt in Warenkorb legen</strong>
                <p className="text-sm ml-6 mt-1">
                  Gehe zu einer Produktseite und klicke &quot;In den Warenkorb&quot;
                </p>
              </li>
              <li>
                <strong>Warenkorb aufrufen</strong>
                <p className="text-sm ml-6 mt-1">
                  <code className="bg-gray-100 px-2 py-1 rounded">/warenkorb</code> oder{' '}
                  <code className="bg-gray-100 px-2 py-1 rounded">/cart</code>
                </p>
              </li>
              <li>
                <strong>Zur Kasse gehen</strong>
                <p className="text-sm ml-6 mt-1">
                  Klicke &quot;Zur Kasse&quot; - sollte zu <code className="bg-gray-100 px-2 py-1 rounded">/kasse</code> führen
                </p>
              </li>
              <li>
                <strong>Formular ausfüllen</strong>
                <p className="text-sm ml-6 mt-1">
                  Alle Pflichtfelder (Name, Adresse, E-Mail, etc.) ausfüllen
                </p>
              </li>
              <li>
                <strong>Zahlungsmethode wählen</strong>
                <p className="text-sm ml-6 mt-1">
                  Wähle &quot;Vorkasse&quot; für ersten Test
                </p>
              </li>
              <li>
                <strong>AGB akzeptieren</strong>
                <p className="text-sm ml-6 mt-1">
                  Checkbox für Geschäftsbedingungen aktivieren
                </p>
              </li>
              <li>
                <strong>Bestellung abschließen</strong>
                <p className="text-sm ml-6 mt-1">
                  Klicke &quot;Zahlungspflichtig bestellen&quot;
                </p>
              </li>
            </ol>

            <h3 className="text-xl font-bold text-[#2e2d32] mt-6 mb-4">Nach Bestellung prüfen:</h3>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Bestellung erscheint in: <strong>WooCommerce → Bestellungen</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Order-Status ist: <strong>&quot;Wartend&quot;</strong> (bei Vorkasse) oder <strong>&quot;In Bearbeitung&quot;</strong> (bei Stripe/PayPal)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Kunde erhält <strong>Bestellbestätigungs-E-Mail</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Admin erhält <strong>Neue-Bestellung-E-Mail</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Lagerbestand wurde reduziert (falls aktiviert)</span>
                </li>
              </ul>
            </div>

            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 mt-6">
              <p className="text-yellow-800 font-semibold mb-2">⚠️ E-Mails kommen nicht an?</p>
              <ol className="text-yellow-700 text-sm space-y-1">
                <li>1. Spam-Ordner prüfen</li>
                <li>2. SMTP-Plugin installieren (WP Mail SMTP)</li>
                <li>3. E-Mail-Einstellungen in WooCommerce prüfen</li>
                <li>4. Test-E-Mail senden: WooCommerce → Einstellungen → E-Mails → Test-E-Mail</li>
              </ol>
            </div>
          </div>
        </section>

        {/* Quick Checklist */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-[#7f54b3] to-[#ec4899] text-white p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">✅ Schnell-Checklist</h2>
            <div className="space-y-2 text-sm">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-5 h-5 rounded" />
                <span>WooCommerce Seiten erstellt (Shop, Warenkorb, Kasse, Mein Konto)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-5 h-5 rounded" />
                <span>Versandzone &quot;Deutschland&quot; mit Versandkosten (49€ / kostenlos ab 999€)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-5 h-5 rounded" />
                <span>Mindestens eine Zahlungsmethode aktiviert (Vorkasse empfohlen)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-5 h-5 rounded" />
                <span>E-Mail-Templates aktiviert (Bestellbestätigung + Neue Bestellung)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-5 h-5 rounded" />
                <span>E-Mail-Absender konfiguriert</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-5 h-5 rounded" />
                <span>Steuersatz 19% für Deutschland eingerichtet</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-5 h-5 rounded" />
                <span>Rechtliche Seiten erstellt (Impressum, Datenschutz, AGB, Widerruf)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-5 h-5 rounded" />
                <span>AGB-Seite in WooCommerce verknüpft</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-5 h-5 rounded" />
                <span>Jaeger Plugin aktiv und funktionsfähig</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-5 h-5 rounded" />
                <span>Test-Bestellung erfolgreich durchgeführt</span>
              </label>
            </div>
          </div>
        </section>

        {/* Troubleshooting */}
        <section className="mb-12">
          <div className="bg-[#ef4444] text-white p-6 rounded-t-lg">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <span>🔧</span> Häufige Probleme
            </h2>
          </div>
          <div className="border-2 border-gray-200 rounded-b-lg p-6">
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-[#2e2d32] mb-2">
                  ❌ Fehler: &quot;Kasse-Seite nicht gefunden&quot;
                </h3>
                <p className="text-gray-700 text-sm">
                  → WooCommerce → Einstellungen → Erweitert → Seiteneinrichtung
                  <br />→ Stelle sicher, dass eine Seite als &quot;Kasse&quot; ausgewählt ist
                  <br />→ Die Seite muss den Shortcode <code className="bg-gray-100 px-2 py-1 rounded">[woocommerce_checkout]</code> enthalten
                </p>
              </div>

              <div>
                <h3 className="font-bold text-[#2e2d32] mb-2">
                  ❌ Fehler: &quot;Keine Zahlungsmethode verfügbar&quot;
                </h3>
                <p className="text-gray-700 text-sm">
                  → WooCommerce → Einstellungen → Zahlungen
                  <br />→ Mindestens eine Zahlungsmethode aktivieren (Vorkasse funktioniert immer)
                  <br />→ Zahlungsmethode auf &quot;Aktiviert&quot; setzen
                </p>
              </div>

              <div>
                <h3 className="font-bold text-[#2e2d32] mb-2">
                  ❌ AGB-Checkbox erscheint nicht im Checkout
                </h3>
                <p className="text-gray-700 text-sm">
                  → WooCommerce → Einstellungen → Erweitert → Geschäftsbedingungen
                  <br />→ AGB-Seite auswählen
                  <br />→ Seite muss veröffentlicht sein (nicht Entwurf)
                </p>
              </div>

              <div>
                <h3 className="font-bold text-[#2e2d32] mb-2">
                  ❌ E-Mails werden nicht versendet
                </h3>
                <p className="text-gray-700 text-sm">
                  → WooCommerce → Einstellungen → E-Mails
                  <br />→ E-Mail-Templates aktivieren
                  <br />→ SMTP-Plugin installieren (WP Mail SMTP empfohlen)
                  <br />→ Test-E-Mail versenden
                </p>
              </div>

              <div>
                <h3 className="font-bold text-[#2e2d32] mb-2">
                  ❌ Jaeger API liefert keine Produkte
                </h3>
                <p className="text-gray-700 text-sm">
                  → Plugins → Installierte Plugins
                  <br />→ Prüfe ob &quot;Jaeger Plugin&quot; aktiviert ist
                  <br />→ Falls nicht: Aktivieren und Seite neu laden
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Next Steps */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-[#10b981] to-[#14b8a6] text-white p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">🚀 Nächste Schritte nach WooCommerce Setup</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <span className="text-2xl">1️⃣</span>
                <div>
                  <strong>Payment Provider konfigurieren</strong>
                  <br />
                  Gehe zu{' '}
                  <Link href="/payment-setup" className="underline font-semibold">
                    /payment-setup
                  </Link>{' '}
                  für Stripe & PayPal Setup
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">2️⃣</span>
                <div>
                  <strong>Test-Bestellung mit Vorkasse</strong>
                  <br />
                  Kompletten Checkout-Flow durchgehen
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">3️⃣</span>
                <div>
                  <strong>E-Mails prüfen</strong>
                  <br />
                  Bestellbestätigung sollte ankommen (auch Spam-Ordner prüfen)
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">4️⃣</span>
                <div>
                  <strong>Bestellung im Backend prüfen</strong>
                  <br />
                  WooCommerce → Bestellungen - Test-Bestellung sollte erscheinen
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">5️⃣</span>
                <div>
                  <strong>Live-Testing mit echten Zahlungsmethoden</strong>
                  <br />
                  Stripe/PayPal mit kleinem Betrag testen
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Navigation */}
        <div className="text-center pt-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-block px-8 py-3 bg-[#2e2d32] text-white font-semibold rounded-lg hover:bg-[#1e1d22] transition-colors"
            >
              Zurück zur Startseite
            </Link>
            <Link
              href="/payment-setup"
              className="inline-block px-8 py-3 border-2 border-[#2e2d32] text-[#2e2d32] font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Weiter zu Payment Setup →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
