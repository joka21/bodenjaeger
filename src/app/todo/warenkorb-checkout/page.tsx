'use client';

type Priority = 'hoch' | 'mittel' | 'niedrig';
type Status = 'offen' | 'in-arbeit' | 'erledigt';

interface Issue {
  id: number;
  title: string;
  description: string;
  location: string;
  priority: Priority;
  status: Status;
  category: 'warenkorb' | 'checkout';
}

const issues: Issue[] = [
  {
    id: 1,
    title: 'Versandkosten-Diskrepanz zwischen Warenkorb und Checkout',
    description:
      'cart-utils.ts: calculateShipping() gibt immer 0 zurück. Im CartFooter sieht der Kunde "Kostenlos", aber im Checkout (shippingConfig.ts) werden echte Versandkosten berechnet (50€ unter 49€, 6€ unter 200€, 0€ ab 200€). Kunden werden erst beim Checkout mit unerwarteten Versandkosten konfrontiert.',
    location: 'src/lib/cart-utils.ts → calculateShipping()',
    priority: 'hoch',
    status: 'offen',
    category: 'warenkorb',
  },
  {
    id: 2,
    title: 'Savings werden nie angezeigt',
    description:
      'calculateSavings() gibt immer 0 zurück. Die "Du sparst"-Anzeige im CartFooter wird nie gezeigt, obwohl Set-Angebote tatsächlich Ersparnisse bringen (originalPricePerUnit vs. pricePerUnit ist bereits vorhanden).',
    location: 'src/lib/cart-utils.ts → calculateSavings()',
    priority: 'mittel',
    status: 'offen',
    category: 'warenkorb',
  },
  {
    id: 3,
    title: 'Console.logs in Production',
    description:
      'Mehrere console.log-Aufrufe in CartDrawer.tsx (Zeile 58, 94) und CartSetItem.tsx (Zeile 147) sind noch aktiv. Diese sollten für Production entfernt oder hinter ein Debug-Flag gestellt werden.',
    location: 'src/components/cart/CartDrawer.tsx, src/components/cart/CartSetItem.tsx',
    priority: 'niedrig',
    status: 'offen',
    category: 'warenkorb',
  },
  {
    id: 4,
    title: 'removeFromCart entfernt auch Set-Items mit gleicher Produkt-ID',
    description:
      'removeFromCart() filtert nach item.id !== productId. Wenn das gleiche Produkt als Set-Item UND als Einzelprodukt im Warenkorb liegt, werden beide entfernt. Es fehlt eine Unterscheidung nach isSetItem.',
    location: 'src/contexts/CartContext.tsx → removeFromCart()',
    priority: 'mittel',
    status: 'offen',
    category: 'warenkorb',
  },
  {
    id: 5,
    title: 'totalPrice-Inkonsistenz zwischen CartContext und OrderSummary',
    description:
      'Checkout nutzt totalPrice aus CartContext, aber OrderSummary berechnet den Gesamtpreis nochmal separat aus cartItems. CartContext nutzt product.prices?.price (Cents-String) als Fallback, OrderSummary nur product.price (Number). Bei regulären Produkten könnten die Werte abweichen.',
    location: 'src/contexts/CartContext.tsx (Zeile 194) vs. src/components/checkout/OrderSummary.tsx',
    priority: 'hoch',
    status: 'offen',
    category: 'checkout',
  },
  {
    id: 6,
    title: 'Sample-Preise stimmen nach Entfernen nicht mehr',
    description:
      'checkout/page.tsx nutzt item.samplePrice (statisch beim Hinzufügen gesetzt). CartContext und CartDrawer berechnen den Preis dynamisch nach Position (erste 3 kostenlos). Wenn ein kostenloses Sample entfernt wird, behalten die verbleibenden Samples ihren alten samplePrice — ein Sample das 3€ kostet, sollte dann eigentlich 0€ kosten.',
    location: 'src/app/checkout/page.tsx (Zeile 113), src/contexts/CartContext.tsx → addSampleToCart()',
    priority: 'hoch',
    status: 'offen',
    category: 'checkout',
  },
  {
    id: 7,
    title: 'Rabattcode-Button ohne Funktion',
    description:
      'Der "Anwenden"-Button für Rabattcodes in der OrderSummary hat keinen onClick-Handler. Der Button ist rein visuell und tut nichts.',
    location: 'src/components/checkout/OrderSummary.tsx (Zeile 103)',
    priority: 'mittel',
    status: 'offen',
    category: 'checkout',
  },
  {
    id: 8,
    title: 'Kein clearCart() nach erfolgreicher Bestellung',
    description:
      'Nach erfolgreicher Bestellung wird nur window.location.href gesetzt. Der Cart wird erst auf der Success-Page via localStorage geleert. Falls die Success-Page nicht korrekt lädt oder ein Fehler auftritt, bleibt der alte Warenkorb bestehen und der Kunde könnte doppelt bestellen.',
    location: 'src/app/checkout/page.tsx (Zeile 217-219)',
    priority: 'mittel',
    status: 'offen',
    category: 'checkout',
  },
  {
    id: 9,
    title: 'Sofortüberweisung ohne Backend-Handler',
    description:
      'sofort ist als PaymentMethod im Checkout definiert und auswählbar, aber es gibt keinen Handler dafür in der API-Route. Nur stripe, paypal und bacs werden verarbeitet. Eine Bestellung mit Sofortüberweisung würde vermutlich fehlschlagen.',
    location: 'src/app/checkout/page.tsx (PaymentMethod type), src/app/api/checkout/create-order/',
    priority: 'hoch',
    status: 'offen',
    category: 'checkout',
  },
];

const priorityConfig: Record<Priority, { label: string; bg: string; text: string; dot: string }> = {
  hoch: { label: 'Hoch', bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
  mittel: { label: 'Mittel', bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  niedrig: { label: 'Niedrig', bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
};

const categoryLabels: Record<string, string> = {
  warenkorb: 'Warenkorb',
  checkout: 'Checkout',
};

export default function WarenkorbCheckoutIssuesPage() {
  const warenkorbIssues = issues.filter((i) => i.category === 'warenkorb');
  const checkoutIssues = issues.filter((i) => i.category === 'checkout');
  const hochCount = issues.filter((i) => i.priority === 'hoch').length;
  const mittelCount = issues.filter((i) => i.priority === 'mittel').length;
  const niedrigCount = issues.filter((i) => i.priority === 'niedrig').length;

  return (
    <div className="min-h-screen bg-white">
      <div className="content-container py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-dark mb-2">
            Warenkorb & Checkout — Offene Probleme
          </h1>
          <p className="text-mid text-lg">
            Analyse vom 04.03.2026 — {issues.length} Probleme gefunden
          </p>

          {/* Stats */}
          <div className="flex gap-4 mt-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-red-50 rounded-lg">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span className="text-sm font-semibold text-red-700">{hochCount} Hoch</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-lg">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-sm font-semibold text-amber-700">{mittelCount} Mittel</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span className="text-sm font-semibold text-blue-700">{niedrigCount} Niedrig</span>
            </div>
          </div>
        </div>

        {/* Warenkorb Section */}
        <IssueSection title="Warenkorb (CartDrawer)" issues={warenkorbIssues} />

        {/* Checkout Section */}
        <IssueSection title="Checkout" issues={checkoutIssues} />
      </div>
    </div>
  );
}

function IssueSection({ title, issues }: { title: string; issues: Issue[] }) {
  return (
    <div className="mb-12">
      <h2 className="text-xl font-bold text-dark mb-4 pb-2 border-b-2 border-ash">{title}</h2>
      <div className="space-y-4">
        {issues.map((issue) => (
          <IssueCard key={issue.id} issue={issue} />
        ))}
      </div>
    </div>
  );
}

function IssueCard({ issue }: { issue: Issue }) {
  const prio = priorityConfig[issue.priority];

  return (
    <div className="border border-ash rounded-lg p-5 hover:shadow-md transition-shadow">
      {/* Top Row: ID + Title + Priority Badge */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-start gap-3">
          <span className="text-xs font-mono text-mid mt-0.5">#{issue.id}</span>
          <h3 className="text-base font-semibold text-dark">{issue.title}</h3>
        </div>
        <span
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${prio.bg} ${prio.text}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${prio.dot}`} />
          {prio.label}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-mid mb-3 leading-relaxed">{issue.description}</p>

      {/* Location */}
      <div className="flex items-center gap-2">
        <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
          />
        </svg>
        <code className="text-xs text-mid bg-gray-100 px-2 py-1 rounded">{issue.location}</code>
      </div>
    </div>
  );
}
