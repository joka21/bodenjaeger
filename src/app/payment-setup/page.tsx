import Link from 'next/link';

export default function PaymentSetupPage() {
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
          Payment Provider Setup
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Schritt-für-Schritt-Anleitung zur Einrichtung der Zahlungsanbieter
        </p>

        {/* Status Box */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-12">
          <h2 className="text-xl font-bold text-[#2e2d32] mb-3">📊 Aktueller Status</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-2xl">✅</span>
              <span className="text-gray-700">
                <strong>WooCommerce API:</strong> Verbunden und funktionsfähig
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">✅</span>
              <span className="text-gray-700">
                <strong>Vorkasse/BACS:</strong> Funktioniert sofort (keine Setup nötig)
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">❌</span>
              <span className="text-gray-700">
                <strong>Stripe:</strong> Credentials fehlen
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">❌</span>
              <span className="text-gray-700">
                <strong>PayPal:</strong> Credentials fehlen
              </span>
            </div>
          </div>
        </div>

        {/* Stripe Setup */}
        <section className="mb-12">
          <div className="bg-[#635bff] text-white p-6 rounded-t-lg">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <span>💳</span> Stripe einrichten (Kreditkarte + Sofortüberweisung)
            </h2>
          </div>
          <div className="border-2 border-gray-200 rounded-b-lg p-6">
            <h3 className="text-xl font-bold text-[#2e2d32] mb-4">
              Schritt 1: Stripe Account erstellen
            </h3>
            <ol className="list-decimal list-inside space-y-3 mb-6 text-gray-700">
              <li>
                Gehe zu{' '}
                <a
                  href="https://dashboard.stripe.com/register"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#635bff] hover:underline font-semibold"
                >
                  dashboard.stripe.com/register
                </a>
              </li>
              <li>Registriere einen Stripe Account (kostenlos)</li>
              <li>Bestätige deine E-Mail-Adresse</li>
              <li>
                Stelle sicher, dass du im <strong>Test Mode</strong> bist (Toggle oben rechts)
              </li>
            </ol>

            <h3 className="text-xl font-bold text-[#2e2d32] mb-4">
              Schritt 2: API Keys kopieren
            </h3>
            <ol className="list-decimal list-inside space-y-3 mb-6 text-gray-700">
              <li>
                Gehe zu{' '}
                <strong>Developers → API Keys</strong> im Stripe Dashboard
              </li>
              <li>
                Kopiere den <strong>Publishable key</strong> (beginnt mit{' '}
                <code className="bg-gray-100 px-2 py-1 rounded text-sm">pk_test_...</code>)
              </li>
              <li>
                Kopiere den <strong>Secret key</strong> (beginnt mit{' '}
                <code className="bg-gray-100 px-2 py-1 rounded text-sm">sk_test_...</code>)
              </li>
            </ol>

            <h3 className="text-xl font-bold text-[#2e2d32] mb-4">
              Schritt 3: Webhook einrichten
            </h3>
            <ol className="list-decimal list-inside space-y-3 mb-6 text-gray-700">
              <li>
                Gehe zu <strong>Developers → Webhooks</strong>
              </li>
              <li>Klicke auf "Add endpoint"</li>
              <li>
                Endpoint URL:{' '}
                <code className="bg-gray-100 px-2 py-1 rounded text-sm block mt-2">
                  https://bodenjaeger.vercel.app/api/checkout/stripe/webhook
                </code>
              </li>
              <li>
                Events auswählen:
                <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                  <li>
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                      checkout.session.completed
                    </code>
                  </li>
                  <li>
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                      checkout.session.expired
                    </code>
                  </li>
                </ul>
              </li>
              <li>Speichern und "Signing secret" kopieren (beginnt mit whsec_...)</li>
            </ol>

            <h3 className="text-xl font-bold text-[#2e2d32] mb-4">
              Schritt 4: Environment Variables eintragen
            </h3>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm mb-6 overflow-x-auto">
              <div className="text-green-400"># In .env.local:</div>
              <div className="mt-2">
                <div>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...</div>
                <div>STRIPE_SECRET_KEY=sk_test_...</div>
                <div>STRIPE_WEBHOOK_SECRET=whsec_...</div>
                <div>NEXT_PUBLIC_SITE_URL=https://bodenjaeger.vercel.app</div>
              </div>
            </div>

            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
              <p className="text-green-800 font-semibold">
                ✅ Nach diesem Setup funktionieren Kreditkarten-Zahlungen und
                Sofortüberweisung!
              </p>
            </div>
          </div>
        </section>

        {/* PayPal Setup */}
        <section className="mb-12">
          <div className="bg-[#0070ba] text-white p-6 rounded-t-lg">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <span>💰</span> PayPal einrichten
            </h2>
          </div>
          <div className="border-2 border-gray-200 rounded-b-lg p-6">
            <h3 className="text-xl font-bold text-[#2e2d32] mb-4">
              Schritt 1: PayPal Developer Account
            </h3>
            <ol className="list-decimal list-inside space-y-3 mb-6 text-gray-700">
              <li>
                Gehe zu{' '}
                <a
                  href="https://developer.paypal.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0070ba] hover:underline font-semibold"
                >
                  developer.paypal.com
                </a>
              </li>
              <li>Logge dich mit deinem PayPal Account ein</li>
              <li>
                Gehe zu <strong>Dashboard → My Apps & Credentials</strong>
              </li>
              <li>
                Stelle sicher, dass <strong>Sandbox</strong> ausgewählt ist (für Testing)
              </li>
            </ol>

            <h3 className="text-xl font-bold text-[#2e2d32] mb-4">
              Schritt 2: App erstellen
            </h3>
            <ol className="list-decimal list-inside space-y-3 mb-6 text-gray-700">
              <li>Klicke auf "Create App"</li>
              <li>App Name: "Bodenjäger Checkout"</li>
              <li>App Type: "Merchant"</li>
              <li>Nach Erstellung werden Client ID und Secret angezeigt</li>
              <li>Kopiere beide Werte</li>
            </ol>

            <h3 className="text-xl font-bold text-[#2e2d32] mb-4">
              Schritt 3: Environment Variables eintragen
            </h3>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm mb-6 overflow-x-auto">
              <div className="text-green-400"># In .env.local:</div>
              <div className="mt-2">
                <div>PAYPAL_CLIENT_ID=...</div>
                <div>PAYPAL_CLIENT_SECRET=...</div>
                <div>PAYPAL_MODE=sandbox</div>
                <div className="text-gray-500">
                  # Für Production: PAYPAL_MODE=live
                </div>
                <div className="mt-2">NEXT_PUBLIC_SITE_URL=https://bodenjaeger.vercel.app</div>
              </div>
            </div>

            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-yellow-800 font-semibold mb-2">
                ⚠️ Sandbox vs. Live Mode
              </p>
              <p className="text-yellow-700 text-sm">
                Im Sandbox Mode kannst du mit Test-Accounts zahlen. Für echte Zahlungen musst du
                auf Live Mode umstellen und dein PayPal Business Account verifizieren.
              </p>
            </div>

            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
              <p className="text-green-800 font-semibold">
                ✅ Nach diesem Setup funktionieren PayPal-Zahlungen!
              </p>
            </div>
          </div>
        </section>

        {/* Vercel Setup */}
        <section className="mb-12">
          <div className="bg-black text-white p-6 rounded-t-lg">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <span>▲</span> Vercel Environment Variables
            </h2>
          </div>
          <div className="border-2 border-gray-200 rounded-b-lg p-6">
            <p className="text-gray-700 mb-6">
              Alle Environment Variables aus <code className="bg-gray-100 px-2 py-1 rounded">.env.local</code> müssen
              auch in Vercel eingetragen werden, damit sie im Production Build verfügbar sind.
            </p>

            <h3 className="text-xl font-bold text-[#2e2d32] mb-4">Schritt-für-Schritt:</h3>
            <ol className="list-decimal list-inside space-y-3 mb-6 text-gray-700">
              <li>
                Gehe zu{' '}
                <a
                  href="https://vercel.com/dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black hover:underline font-semibold"
                >
                  vercel.com/dashboard
                </a>
              </li>
              <li>Wähle dein Projekt "bodenjäger"</li>
              <li>
                Gehe zu <strong>Settings → Environment Variables</strong>
              </li>
              <li>
                Füge folgende Variables hinzu (alle mit Environment: <strong>Production</strong> +{' '}
                <strong>Preview</strong> + <strong>Development</strong>):
              </li>
            </ol>

            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm mb-6 overflow-x-auto">
              <div className="text-green-400"># WooCommerce (bereits vorhanden)</div>
              <div>NEXT_PUBLIC_WORDPRESS_URL=https://plan-dein-ding.de</div>
              <div>WC_CONSUMER_KEY=ck_effb639d22b10db7fe6063fa4d8034b1ad34e500</div>
              <div>WC_CONSUMER_SECRET=cs_529f9b5c3bd684cb45f297df28fc3a2515d67648</div>
              <div className="mt-4 text-green-400"># Stripe</div>
              <div>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...</div>
              <div>STRIPE_SECRET_KEY=sk_test_...</div>
              <div>STRIPE_WEBHOOK_SECRET=whsec_...</div>
              <div className="mt-4 text-green-400"># PayPal</div>
              <div>PAYPAL_CLIENT_ID=...</div>
              <div>PAYPAL_CLIENT_SECRET=...</div>
              <div>PAYPAL_MODE=sandbox</div>
              <div className="mt-4 text-green-400"># Site URL</div>
              <div>NEXT_PUBLIC_SITE_URL=https://bodenjaeger.vercel.app</div>
              <div className="mt-4 text-green-400"># Revalidation (bereits vorhanden)</div>
              <div>REVALIDATE_SECRET=T3njoka21!</div>
            </div>

            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-yellow-800 font-semibold mb-2">⚠️ Nach dem Hinzufügen:</p>
              <p className="text-yellow-700 text-sm">
                Deployment neu triggern! Environment Variables werden nur bei neuen Deployments
                übernommen. Gehe zu <strong>Deployments</strong> → neuestes Deployment →{' '}
                <strong>Redeploy</strong>
              </p>
            </div>

            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
              <p className="text-green-800 font-semibold">
                ✅ Nach Redeploy sind alle Payment-Methoden live!
              </p>
            </div>
          </div>
        </section>

        {/* Testing */}
        <section className="mb-12">
          <div className="bg-[#4CAF50] text-white p-6 rounded-t-lg">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <span>🧪</span> Testing-Guide
            </h2>
          </div>
          <div className="border-2 border-gray-200 rounded-b-lg p-6">
            <h3 className="text-xl font-bold text-[#2e2d32] mb-4">Stripe Test-Kreditkarten</h3>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="text-left py-2 px-2">Kartennummer</th>
                    <th className="text-left py-2 px-2">Szenario</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  <tr className="border-b border-gray-200">
                    <td className="py-2 px-2 font-mono">4242 4242 4242 4242</td>
                    <td className="py-2 px-2">✅ Erfolgreiche Zahlung</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 px-2 font-mono">4000 0000 0000 9995</td>
                    <td className="py-2 px-2">❌ Karte abgelehnt</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 px-2 font-mono">4000 0025 0000 3155</td>
                    <td className="py-2 px-2">🔐 3D Secure erforderlich</td>
                  </tr>
                </tbody>
              </table>
              <p className="text-gray-600 text-xs mt-3">
                <strong>Ablaufdatum:</strong> Beliebiges zukünftiges Datum (z.B. 12/25)
                <br />
                <strong>CVC:</strong> Beliebige 3 Ziffern (z.B. 123)
              </p>
            </div>

            <h3 className="text-xl font-bold text-[#2e2d32] mb-4">PayPal Sandbox Testing</h3>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
              <ol className="list-decimal list-inside space-y-2 text-gray-700 text-sm">
                <li>
                  Gehe zu{' '}
                  <a
                    href="https://developer.paypal.com/dashboard/accounts"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0070ba] hover:underline"
                  >
                    PayPal Sandbox Accounts
                  </a>
                </li>
                <li>Verwende einen Test-Buyer Account zum Einloggen</li>
                <li>Oder erstelle einen neuen Test-Account unter "Sandbox → Accounts"</li>
              </ol>
            </div>

            <h3 className="text-xl font-bold text-[#2e2d32] mb-4">
              Test-Workflow: Komplette Bestellung
            </h3>
            <ol className="list-decimal list-inside space-y-3 text-gray-700">
              <li>Produkt in den Warenkorb legen</li>
              <li>Checkout aufrufen</li>
              <li>Testdaten eingeben</li>
              <li>Zahlungsmethode wählen (Stripe/PayPal/Vorkasse)</li>
              <li>Bestellung abschicken</li>
              <li>
                Überprüfen:
                <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                  <li>Redirect zu Payment Gateway funktioniert</li>
                  <li>
                    Bestellung erscheint in WordPress:{' '}
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                      WooCommerce → Bestellungen
                    </code>
                  </li>
                  <li>Order-Status ist korrekt (pending → processing nach Zahlung)</li>
                  <li>Success-Page wird angezeigt</li>
                </ul>
              </li>
            </ol>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mt-6">
              <p className="text-blue-800 font-semibold mb-2">💡 Tipp: Logs überwachen</p>
              <p className="text-blue-700 text-sm">
                Verwende <code className="bg-white px-2 py-1 rounded">vercel logs</code> oder das
                Vercel Dashboard, um Server-Logs zu überwachen und Fehler zu debuggen.
              </p>
            </div>
          </div>
        </section>

        {/* Troubleshooting */}
        <section className="mb-12">
          <div className="bg-[#ed1b24] text-white p-6 rounded-t-lg">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <span>🔧</span> Troubleshooting
            </h2>
          </div>
          <div className="border-2 border-gray-200 rounded-b-lg p-6">
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-[#2e2d32] mb-2">
                  ❌ Fehler: "Stripe credentials not configured"
                </h3>
                <p className="text-gray-700 text-sm">
                  → Environment Variables fehlen in Vercel oder lokaler .env.local
                  <br />→ Nach Hinzufügen Deployment neu triggern
                </p>
              </div>

              <div>
                <h3 className="font-bold text-[#2e2d32] mb-2">
                  ❌ Bestellung bleibt bei "pending" stecken
                </h3>
                <p className="text-gray-700 text-sm">
                  → Stripe Webhook nicht konfiguriert oder falsche URL
                  <br />→ STRIPE_WEBHOOK_SECRET fehlt
                  <br />→ Überprüfe Webhook Logs im Stripe Dashboard
                </p>
              </div>

              <div>
                <h3 className="font-bold text-[#2e2d32] mb-2">
                  ❌ PayPal redirect funktioniert nicht
                </h3>
                <p className="text-gray-700 text-sm">
                  → NEXT_PUBLIC_SITE_URL fehlt oder ist falsch
                  <br />→ PAYPAL_MODE muss "sandbox" oder "live" sein
                  <br />→ Return URL in PayPal App Settings überprüfen
                </p>
              </div>

              <div>
                <h3 className="font-bold text-[#2e2d32] mb-2">
                  ❌ Order erscheint nicht in WordPress
                </h3>
                <p className="text-gray-700 text-sm">
                  → WooCommerce API Credentials prüfen
                  <br />→ WordPress/WooCommerce Plugin up-to-date?
                  <br />→ Server-Logs in Vercel prüfen (vercel logs)
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Start */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-[#635bff] to-[#0070ba] text-white p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">🚀 Quick Start Zusammenfassung</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <span className="text-2xl">1️⃣</span>
                <div>
                  <strong>Stripe Account erstellen</strong> → API Keys + Webhook Secret kopieren
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">2️⃣</span>
                <div>
                  <strong>PayPal Developer App erstellen</strong> → Client ID + Secret kopieren
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">3️⃣</span>
                <div>
                  <strong>Alle Variables in .env.local</strong> eintragen (lokal testen)
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">4️⃣</span>
                <div>
                  <strong>Alle Variables in Vercel</strong> eintragen → Redeploy
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">5️⃣</span>
                <div>
                  <strong>Mit Test-Kreditkarte/PayPal testen</strong> → Bestellung in WordPress
                  prüfen
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="text-center pt-8 border-t border-gray-200">
          <Link
            href="/"
            className="inline-block px-8 py-3 bg-[#2e2d32] text-white font-semibold rounded-lg hover:bg-[#1e1d22] transition-colors"
          >
            Zurück zur Startseite
          </Link>
        </div>
      </div>
    </div>
  );
}
