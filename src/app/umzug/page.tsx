import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Umzug | Bodenjäger',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function UmzugPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg-light)' }}>
      <div className="content-container py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
            Domain-Umzug Checkliste
          </h1>
          <p style={{ color: 'var(--color-text-dark)' }}>
            Wechsel von <code className="px-2 py-0.5 bg-gray-200 rounded text-sm">bodenjaeger.vercel.app</code> auf die finale Domain
          </p>
        </div>

        {/* Warning Box */}
        <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h3 className="font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                Vor dem Umzug lesen
              </h3>
              <ul className="text-sm space-y-1 list-disc ml-5" style={{ color: 'var(--color-text-dark)' }}>
                <li>DNS-TTL bereits <strong>einen Tag vorher</strong> auf 300 Sekunden reduzieren</li>
                <li>Umzug zu einer umsatzschwachen Zeit durchführen (früh morgens)</li>
                <li>Vor dem Umzug: aktuelle Vercel-Domain als Backup behalten</li>
                <li>Nach dem Umzug: Testbestellung mit jedem Bezahlverfahren durchführen</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
            <div className="text-3xl font-bold text-red-600 mb-1">5</div>
            <div className="text-sm" style={{ color: 'var(--color-text-dark)' }}>Must-Do</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
            <div className="text-3xl font-bold text-orange-600 mb-1">3</div>
            <div className="text-sm" style={{ color: 'var(--color-text-dark)' }}>Payment</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="text-3xl font-bold text-blue-600 mb-1">3</div>
            <div className="text-sm" style={{ color: 'var(--color-text-dark)' }}>WordPress</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <div className="text-3xl font-bold text-purple-600 mb-1">4</div>
            <div className="text-sm" style={{ color: 'var(--color-text-dark)' }}>Code</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="text-3xl font-bold text-green-600 mb-1">4</div>
            <div className="text-sm" style={{ color: 'var(--color-text-dark)' }}>SEO</div>
          </div>
        </div>

        {/* 🔴 MUST-DO VERCEL */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-4 h-4 rounded-full bg-red-500 flex-shrink-0"></span>
            <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
              Must-Do &mdash; Vercel &amp; Domain
            </h2>
          </div>

          <ul className="space-y-4">
            <li className="flex items-start gap-3 p-4 border-l-4 border-red-500 bg-red-50 rounded-r-lg">
              <input type="checkbox" disabled className="mt-1 w-5 h-5" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                    1. Domain in Vercel hinzufügen
                  </h3>
                  <span className="text-xs px-2 py-0.5 bg-red-600 text-white rounded">Vercel</span>
                </div>
                <p className="text-sm mb-2" style={{ color: 'var(--color-text-dark)' }}>
                  Vercel Dashboard → Project → Settings → Domains → Add Domain
                </p>
                <ul className="text-xs space-y-1 ml-4 list-disc" style={{ color: 'var(--color-text-dark)' }}>
                  <li>Domain eingeben (z.B. <code>bodenjaeger.de</code>)</li>
                  <li>Auch <code>www.bodenjaeger.de</code> hinzufügen (Redirect auf Root)</li>
                  <li>DNS-Einträge laut Vercel-Anleitung setzen (A-Record oder CNAME)</li>
                  <li>Warten bis SSL-Zertifikat ausgestellt ist (automatisch)</li>
                </ul>
              </div>
            </li>

            <li className="flex items-start gap-3 p-4 border-l-4 border-red-500 bg-red-50 rounded-r-lg">
              <input type="checkbox" disabled className="mt-1 w-5 h-5" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                    2. NEXT_PUBLIC_SITE_URL ändern
                  </h3>
                  <span className="text-xs px-2 py-0.5 bg-red-600 text-white rounded">KRITISCH</span>
                </div>
                <p className="text-sm mb-2" style={{ color: 'var(--color-text-dark)' }}>
                  Ohne diese Änderung brechen <strong>alle Zahlungen</strong>: Stripe-, PayPal- und BACS-Redirects zeigen sonst auf die alte Vercel-URL.
                </p>
                <div className="bg-gray-900 text-green-400 font-mono text-xs p-3 rounded mt-2">
                  <div>Vercel Dashboard → Project → Settings → Environment Variables</div>
                  <div className="mt-2">NEXT_PUBLIC_SITE_URL=https://bodenjaeger.de</div>
                  <div className="mt-2 text-yellow-300"># Für alle Environments (Production, Preview, Development)</div>
                </div>
                <p className="text-xs mt-2 font-mono" style={{ color: 'var(--color-text-dark)' }}>
                  Betroffen: stripe.ts, paypal.ts, checkout/create-order, paypal/capture
                </p>
              </div>
            </li>

            <li className="flex items-start gap-3 p-4 border-l-4 border-red-500 bg-red-50 rounded-r-lg">
              <input type="checkbox" disabled className="mt-1 w-5 h-5" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                    3. Redeploy auslösen
                  </h3>
                  <span className="text-xs px-2 py-0.5 bg-red-600 text-white rounded">Vercel</span>
                </div>
                <p className="text-sm" style={{ color: 'var(--color-text-dark)' }}>
                  Env-Variablen greifen erst nach neuem Deploy. In Vercel: Deployments → latest → ⋯ → <strong>Redeploy</strong> (ohne Cache).
                </p>
              </div>
            </li>

            <li className="flex items-start gap-3 p-4 border-l-4 border-red-500 bg-red-50 rounded-r-lg">
              <input type="checkbox" disabled className="mt-1 w-5 h-5" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                    4. Alte Vercel-Domain als Redirect einrichten
                  </h3>
                  <span className="text-xs px-2 py-0.5 bg-red-600 text-white rounded">Vercel</span>
                </div>
                <p className="text-sm" style={{ color: 'var(--color-text-dark)' }}>
                  <code>bodenjaeger.vercel.app</code> NICHT löschen, sondern als <strong>Redirect auf die neue Domain</strong> konfigurieren (Vercel macht das automatisch, wenn die neue Domain Primary ist).
                </p>
              </div>
            </li>

            <li className="flex items-start gap-3 p-4 border-l-4 border-red-500 bg-red-50 rounded-r-lg">
              <input type="checkbox" disabled className="mt-1 w-5 h-5" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                    5. Testbestellung auf Live-Domain
                  </h3>
                  <span className="text-xs px-2 py-0.5 bg-red-600 text-white rounded">Test</span>
                </div>
                <p className="text-sm" style={{ color: 'var(--color-text-dark)' }}>
                  Einmal komplett durchbestellen: Produkt in Warenkorb → Checkout → Stripe + PayPal + BACS (je einmal). Success-Seite muss auf neuer Domain landen.
                </p>
              </div>
            </li>
          </ul>
        </div>

        {/* 🟠 PAYMENT PROVIDER */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-4 h-4 rounded-full bg-orange-500 flex-shrink-0"></span>
            <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
              Payment Provider Dashboards
            </h2>
          </div>

          <ul className="space-y-4">
            <li className="flex items-start gap-3 p-4 border-l-4 border-orange-500 bg-orange-50 rounded-r-lg">
              <input type="checkbox" disabled className="mt-1 w-5 h-5" />
              <div className="flex-1">
                <h3 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  Stripe Webhook prüfen
                </h3>
                <p className="text-sm mb-2" style={{ color: 'var(--color-text-dark)' }}>
                  Aktuell läuft der Stripe-Webhook via Payment-Proxy über WordPress:
                </p>
                <div className="bg-gray-900 text-green-400 font-mono text-xs p-3 rounded">
                  https://2025.bodenjaeger.de/wp-json/bodenjaeger/v1/stripe/webhook
                </div>
                <p className="text-sm mt-2" style={{ color: 'var(--color-text-dark)' }}>
                  Falls das WordPress-Backend ebenfalls umzieht, muss die URL im Stripe Dashboard (Developers → Webhooks) aktualisiert werden.
                </p>
              </div>
            </li>

            <li className="flex items-start gap-3 p-4 border-l-4 border-orange-500 bg-orange-50 rounded-r-lg">
              <input type="checkbox" disabled className="mt-1 w-5 h-5" />
              <div className="flex-1">
                <h3 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  PayPal Return/Cancel URLs
                </h3>
                <p className="text-sm" style={{ color: 'var(--color-text-dark)' }}>
                  Werden dynamisch aus <code>NEXT_PUBLIC_SITE_URL</code> gebaut &mdash; wenn Env-Variable stimmt, ist nichts weiter zu tun. Nach Umzug mit Test-Bestellung validieren.
                </p>
              </div>
            </li>

            <li className="flex items-start gap-3 p-4 border-l-4 border-orange-500 bg-orange-50 rounded-r-lg">
              <input type="checkbox" disabled className="mt-1 w-5 h-5" />
              <div className="flex-1">
                <h3 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  Stripe / PayPal in Live-Modus?
                </h3>
                <p className="text-sm" style={{ color: 'var(--color-text-dark)' }}>
                  Prüfen, ob Live-Keys (nicht Test/Sandbox) gesetzt sind. In Vercel Environment Variables: <code>STRIPE_SECRET_KEY</code>, <code>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code>, <code>PAYPAL_CLIENT_ID</code>, <code>PAYPAL_CLIENT_SECRET</code>.
                </p>
              </div>
            </li>
          </ul>
        </div>

        {/* 🔵 WORDPRESS BACKEND */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-4 h-4 rounded-full bg-blue-500 flex-shrink-0"></span>
            <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
              WordPress Backend
            </h2>
          </div>

          <ul className="space-y-4">
            <li className="flex items-start gap-3 p-4 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg">
              <input type="checkbox" disabled className="mt-1 w-5 h-5" />
              <div className="flex-1">
                <h3 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  Klären: Wo liegt das Backend nach dem Umzug?
                </h3>
                <p className="text-sm mb-2" style={{ color: 'var(--color-text-dark)' }}>
                  Aktuell: Backend auf <code>2025.bodenjaeger.de</code>. Wenn das Frontend künftig auf <code>bodenjaeger.de</code> läuft, kann das Backend dort nicht gleichzeitig laufen.
                </p>
                <ul className="text-xs space-y-1 ml-4 list-disc" style={{ color: 'var(--color-text-dark)' }}>
                  <li>Option A: Backend bleibt auf <code>2025.bodenjaeger.de</code> (keine Änderung nötig)</li>
                  <li>Option B: Backend zieht um auf z.B. <code>wp.bodenjaeger.de</code> → dann <code>NEXT_PUBLIC_WORDPRESS_URL</code> in Vercel anpassen</li>
                </ul>
              </div>
            </li>

            <li className="flex items-start gap-3 p-4 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg">
              <input type="checkbox" disabled className="mt-1 w-5 h-5" />
              <div className="flex-1">
                <h3 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  CORS-Whitelist im Jäger-Plugin aktualisieren
                </h3>
                <p className="text-sm" style={{ color: 'var(--color-text-dark)' }}>
                  WordPress-Plugin muss die neue Frontend-Domain in der CORS-Allowlist haben. Aktuell dürfte nur <code>bodenjaeger.vercel.app</code> eingetragen sein.
                </p>
              </div>
            </li>

            <li className="flex items-start gap-3 p-4 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg">
              <input type="checkbox" disabled className="mt-1 w-5 h-5" />
              <div className="flex-1">
                <h3 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  Revalidate-Webhook-URL anpassen
                </h3>
                <p className="text-sm mb-2" style={{ color: 'var(--color-text-dark)' }}>
                  Im Jäger-Plugin (WordPress) die Auslieferungs-URL ändern, damit Produktänderungen das Frontend refreshen:
                </p>
                <div className="bg-gray-900 text-green-400 font-mono text-xs p-3 rounded">
                  https://bodenjaeger.de/api/revalidate?secret=DEIN_SECRET
                </div>
              </div>
            </li>
          </ul>
        </div>

        {/* 🟣 CODE-ANPASSUNGEN */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-4 h-4 rounded-full bg-purple-500 flex-shrink-0"></span>
            <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
              Code-Anpassungen (nur falls Domain nicht bodenjaeger.de)
            </h2>
          </div>

          <p className="text-sm mb-4 italic" style={{ color: 'var(--color-text-dark)' }}>
            Diese Dateien haben <code>bodenjaeger.de</code> bereits hardcoded. Falls die finale Domain eine andere ist, müssen die folgenden Stellen angepasst werden:
          </p>

          <ul className="space-y-4">
            <li className="flex items-start gap-3 p-4 border-l-4 border-purple-500 bg-purple-50 rounded-r-lg">
              <input type="checkbox" disabled className="mt-1 w-5 h-5" />
              <div className="flex-1">
                <h3 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  src/app/layout.tsx
                </h3>
                <p className="text-sm" style={{ color: 'var(--color-text-dark)' }}>
                  Zeile 30: <code>metadataBase: new URL(&apos;https://bodenjaeger.de&apos;)</code>
                </p>
              </div>
            </li>

            <li className="flex items-start gap-3 p-4 border-l-4 border-purple-500 bg-purple-50 rounded-r-lg">
              <input type="checkbox" disabled className="mt-1 w-5 h-5" />
              <div className="flex-1">
                <h3 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  src/lib/schema.ts
                </h3>
                <p className="text-sm" style={{ color: 'var(--color-text-dark)' }}>
                  Zeile 3: <code>const SITE_URL = &apos;https://bodenjaeger.de&apos;</code> (JSON-LD Schema)
                </p>
              </div>
            </li>

            <li className="flex items-start gap-3 p-4 border-l-4 border-purple-500 bg-purple-50 rounded-r-lg">
              <input type="checkbox" disabled className="mt-1 w-5 h-5" />
              <div className="flex-1">
                <h3 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  src/app/category/[slug]/page.tsx
                </h3>
                <p className="text-sm" style={{ color: 'var(--color-text-dark)' }}>
                  Zeilen 42, 65, 66: Canonical-URL &amp; Breadcrumbs
                </p>
              </div>
            </li>

            <li className="flex items-start gap-3 p-4 border-l-4 border-purple-500 bg-purple-50 rounded-r-lg">
              <input type="checkbox" disabled className="mt-1 w-5 h-5" />
              <div className="flex-1">
                <h3 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  src/app/products/[slug]/page.tsx
                </h3>
                <p className="text-sm" style={{ color: 'var(--color-text-dark)' }}>
                  Zeilen 149&ndash;153, 203: Canonical-URL &amp; Breadcrumbs
                </p>
              </div>
            </li>
          </ul>
        </div>

        {/* 🟢 SEO & MONITORING */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-4 h-4 rounded-full bg-green-500 flex-shrink-0"></span>
            <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
              SEO &amp; Monitoring
            </h2>
          </div>

          <ul className="space-y-4">
            <li className="flex items-start gap-3 p-4 border-l-4 border-green-500 bg-green-50 rounded-r-lg">
              <input type="checkbox" disabled className="mt-1 w-5 h-5" />
              <div className="flex-1">
                <h3 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  Google Search Console
                </h3>
                <ul className="text-sm space-y-1 ml-4 list-disc" style={{ color: 'var(--color-text-dark)' }}>
                  <li>Neue Property für finale Domain anlegen</li>
                  <li>DNS- oder HTML-Verifizierung durchführen</li>
                  <li>Tool <strong>Adressänderung</strong> nutzen, wenn alte Property existiert</li>
                  <li>Sitemap einreichen</li>
                </ul>
              </div>
            </li>

            <li className="flex items-start gap-3 p-4 border-l-4 border-green-500 bg-green-50 rounded-r-lg">
              <input type="checkbox" disabled className="mt-1 w-5 h-5" />
              <div className="flex-1">
                <h3 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  sitemap.xml &amp; robots.txt erstellen
                </h3>
                <p className="text-sm" style={{ color: 'var(--color-text-dark)' }}>
                  Beides existiert aktuell <strong>nicht</strong> im Projekt. Über Next.js-Konventionen anlegen: <code>src/app/sitemap.ts</code> und <code>src/app/robots.ts</code>.
                </p>
              </div>
            </li>

            <li className="flex items-start gap-3 p-4 border-l-4 border-green-500 bg-green-50 rounded-r-lg">
              <input type="checkbox" disabled className="mt-1 w-5 h-5" />
              <div className="flex-1">
                <h3 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  Analytics / Tag Manager
                </h3>
                <p className="text-sm" style={{ color: 'var(--color-text-dark)' }}>
                  Falls Google Analytics, GTM, Meta-Pixel oder ähnliches eingesetzt wird: neue Domain in den jeweiligen Dashboards als erlaubte Domain hinzufügen.
                </p>
              </div>
            </li>

            <li className="flex items-start gap-3 p-4 border-l-4 border-green-500 bg-green-50 rounded-r-lg">
              <input type="checkbox" disabled className="mt-1 w-5 h-5" />
              <div className="flex-1">
                <h3 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  Impressum / AGB / Datenschutz prüfen
                </h3>
                <p className="text-sm" style={{ color: 'var(--color-text-dark)' }}>
                  Falls Domain oder Betreiberinformationen in Rechtstexten genannt werden, dort aktualisieren.
                </p>
              </div>
            </li>
          </ul>
        </div>

        {/* DNS-Konfiguration */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-4 h-4 rounded-full bg-cyan-500 flex-shrink-0"></span>
            <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
              DNS-Records beim aktuellen Provider anlegen
            </h2>
          </div>

          <p className="text-sm mb-4" style={{ color: 'var(--color-text-dark)' }}>
            Beim aktuellen DNS-Provider der Bodenjäger-Domain (vermutlich <strong>Plesk/Strato</strong> o.ä., da dort auch die WP-Instanz lag) folgende Records anlegen:
          </p>

          {/* Apex-Domain */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>
              Für die Apex-Domain <code>bodenjaeger.de</code>
            </h3>
            <div className="bg-gray-900 text-green-400 font-mono text-sm p-4 rounded overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-yellow-300 border-b border-gray-700">
                    <th className="text-left pb-2 pr-6">Typ</th>
                    <th className="text-left pb-2 pr-6">Name / Host</th>
                    <th className="text-left pb-2">Wert</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="pt-2 pr-6">A</td>
                    <td className="pt-2 pr-6">@</td>
                    <td className="pt-2">76.76.21.21</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs mt-2 italic" style={{ color: 'var(--color-text-dark)' }}>
              Der A-Record <code>76.76.21.21</code> ist Vercels Anycast-IP für Custom Domains.
            </p>
          </div>

          {/* www Subdomain */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>
              Für die www-Subdomain <code>www.bodenjaeger.de</code>
            </h3>
            <div className="bg-gray-900 text-green-400 font-mono text-sm p-4 rounded overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-yellow-300 border-b border-gray-700">
                    <th className="text-left pb-2 pr-6">Typ</th>
                    <th className="text-left pb-2 pr-6">Name / Host</th>
                    <th className="text-left pb-2">Wert</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="pt-2 pr-6">CNAME</td>
                    <td className="pt-2 pr-6">www</td>
                    <td className="pt-2">cname.vercel-dns.com</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs mt-2 italic" style={{ color: 'var(--color-text-dark)' }}>
              In Vercel: <code>www.bodenjaeger.de</code> ebenfalls hinzufügen und als Redirect auf die Apex-Domain konfigurieren (oder umgekehrt, je nach Präferenz).
            </p>
          </div>

          {/* Achtung / Kollision mit Backend */}
          <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded p-4 mb-4">
            <h4 className="font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
              ⚠️ Achtung: Kollision mit WordPress-Backend
            </h4>
            <p className="text-sm mb-2" style={{ color: 'var(--color-text-dark)' }}>
              Die Domain <code>bodenjaeger.de</code> hat aktuell einen A-Record auf den Plesk/Strato-Server. Sobald der A-Record auf <code>76.76.21.21</code> umgestellt wird, ist das alte WordPress unter <code>bodenjaeger.de</code> nicht mehr erreichbar &mdash; das ist gewollt.
            </p>
            <p className="text-sm" style={{ color: 'var(--color-text-dark)' }}>
              Das produktive Backend läuft auf <code>2025.bodenjaeger.de</code> und bleibt davon <strong>unberührt</strong> (eigener DNS-Record). Sicherstellen, dass der Subdomain-Record <code>2025</code> nicht versehentlich mitgeändert wird.
            </p>
          </div>

          {/* Optional: alte bodenjaeger.de Inhalte */}
          <div className="bg-blue-50 border-l-4 border-blue-500 rounded p-4">
            <h4 className="font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
              💡 Tipp: TTL vor dem Umzug prüfen
            </h4>
            <p className="text-sm" style={{ color: 'var(--color-text-dark)' }}>
              Beim DNS-Provider den bestehenden A-Record von <code>bodenjaeger.de</code> öffnen und TTL <strong>am Vortag</strong> auf 300 Sekunden reduzieren. Nach erfolgreichem Umzug kann TTL wieder auf 3600 oder höher gesetzt werden.
            </p>
          </div>
        </div>

        {/* Anleitung Schritt für Schritt */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--color-text-primary)' }}>
            Schritt-für-Schritt Anleitung am Umzugstag
          </h2>

          <ol className="space-y-4">
            <li className="flex gap-4 p-4 bg-gray-50 rounded-lg">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center font-bold">1</span>
              <div>
                <h4 className="font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>Vorabend: DNS-TTL reduzieren</h4>
                <p className="text-sm" style={{ color: 'var(--color-text-dark)' }}>
                  Beim DNS-Provider TTL der A/CNAME-Records auf 300 Sekunden (5 Min) setzen. Dadurch propagiert der Wechsel am nächsten Tag innerhalb weniger Minuten.
                </p>
              </div>
            </li>

            <li className="flex gap-4 p-4 bg-gray-50 rounded-lg">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center font-bold">2</span>
              <div>
                <h4 className="font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>Domain in Vercel hinzufügen</h4>
                <p className="text-sm" style={{ color: 'var(--color-text-dark)' }}>
                  Vercel Dashboard → Project <code>bodenjaeger</code> → Settings → Domains → <strong>Add Domain</strong>. Vercel zeigt die benötigten DNS-Einträge (A-Record <code>76.76.21.21</code> oder CNAME).
                </p>
              </div>
            </li>

            <li className="flex gap-4 p-4 bg-gray-50 rounded-lg">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center font-bold">3</span>
              <div>
                <h4 className="font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>DNS-Einträge beim Registrar setzen</h4>
                <p className="text-sm" style={{ color: 'var(--color-text-dark)' }}>
                  Bei deinem DNS-Provider (IONOS, Cloudflare, o.ä.) den von Vercel angezeigten A-Record für Root-Domain und CNAME für <code>www</code> setzen. Propagation abwarten (1&ndash;5 Min bei TTL 300).
                </p>
              </div>
            </li>

            <li className="flex gap-4 p-4 bg-gray-50 rounded-lg">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center font-bold">4</span>
              <div>
                <h4 className="font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>Env-Variable aktualisieren</h4>
                <p className="text-sm" style={{ color: 'var(--color-text-dark)' }}>
                  Vercel → Settings → Environment Variables → <code>NEXT_PUBLIC_SITE_URL</code> bearbeiten und auf neue Domain setzen (für Production).
                </p>
              </div>
            </li>

            <li className="flex gap-4 p-4 bg-gray-50 rounded-lg">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center font-bold">5</span>
              <div>
                <h4 className="font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>Redeploy</h4>
                <p className="text-sm" style={{ color: 'var(--color-text-dark)' }}>
                  Vercel → Deployments → aktuellstes Production-Deployment → <strong>Redeploy</strong> (ohne Cache). Nach ~2 Min läuft der Build mit der neuen Env.
                </p>
              </div>
            </li>

            <li className="flex gap-4 p-4 bg-gray-50 rounded-lg">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center font-bold">6</span>
              <div>
                <h4 className="font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>WordPress CORS + Revalidate-Webhook</h4>
                <p className="text-sm" style={{ color: 'var(--color-text-dark)' }}>
                  WP-Admin → Jäger-Plugin → CORS-Whitelist um neue Domain ergänzen. Revalidate-Webhook-URL auf <code>https://bodenjaeger.de/api/revalidate?secret=...</code> umstellen.
                </p>
              </div>
            </li>

            <li className="flex gap-4 p-4 bg-gray-50 rounded-lg">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center font-bold">7</span>
              <div>
                <h4 className="font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>Komplettes Testszenario</h4>
                <p className="text-sm" style={{ color: 'var(--color-text-dark)' }}>
                  Produkt öffnen → Set-Angebot konfigurieren → in Warenkorb → Checkout mit Stripe testen → Checkout mit PayPal testen → Checkout mit BACS testen. Jede Success-Seite muss auf der neuen Domain landen.
                </p>
              </div>
            </li>

            <li className="flex gap-4 p-4 bg-gray-50 rounded-lg">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center font-bold">8</span>
              <div>
                <h4 className="font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>Search Console + Monitoring</h4>
                <p className="text-sm" style={{ color: 'var(--color-text-dark)' }}>
                  Google Search Console: neue Property anlegen, verifizieren, Sitemap einreichen. Danach 24h beobachten (Crawl-Errors, 404s, Ladezeiten).
                </p>
              </div>
            </li>
          </ol>
        </div>

        {/* Rollback-Plan */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6 border-2 border-red-200">
          <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
            🚨 Rollback-Plan (falls etwas schiefgeht)
          </h2>
          <ol className="space-y-2 text-sm list-decimal ml-6" style={{ color: 'var(--color-text-dark)' }}>
            <li><code>NEXT_PUBLIC_SITE_URL</code> in Vercel zurück auf <code>https://bodenjaeger.vercel.app</code></li>
            <li>Redeploy auslösen</li>
            <li>Neue Domain in Vercel temporär entfernen (nicht den DNS-Eintrag &mdash; der kann bleiben)</li>
            <li>Kunden erreichen weiterhin die Vercel-URL, Zahlungen funktionieren wieder</li>
            <li>Fehlerursache in Ruhe analysieren</li>
          </ol>
        </div>

        {/* Footer Note */}
        <div className="bg-gray-100 rounded-lg p-6 text-center">
          <p className="text-sm" style={{ color: 'var(--color-text-dark)' }}>
            Interne Seite &bull; Nicht öffentlich indexiert &bull; Bei Fragen an team@krefeld2030.de
          </p>
        </div>
      </div>
    </div>
  );
}
