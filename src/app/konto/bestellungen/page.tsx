'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  total: string;
}

interface Order {
  id: number;
  status: string;
  date_created: string;
  total: string;
  currency: string;
  line_items: OrderItem[];
  payment_method_title: string;
}

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: 'Ausstehend', color: 'bg-yellow-100 text-yellow-800' },
  processing: { label: 'In Bearbeitung', color: 'bg-brand/10 text-brand' },
  'on-hold': { label: 'Wartend', color: 'bg-orange-100 text-orange-800' },
  completed: { label: 'Abgeschlossen', color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Storniert', color: 'bg-red-100 text-red-800' },
  refunded: { label: 'Erstattet', color: 'bg-gray-100 text-gray-800' },
  failed: { label: 'Fehlgeschlagen', color: 'bg-red-100 text-red-800' },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function formatPrice(price: string) {
  return parseFloat(price).toLocaleString('de-DE', {
    style: 'currency',
    currency: 'EUR',
  });
}

export default function BestellungenPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/auth/orders')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setOrders(data.orders);
        } else {
          setError(data.error);
        }
      })
      .catch(() => setError('Bestellungen konnten nicht geladen werden'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-mid text-sm">Bestellungen werden geladen...</div>;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800 text-sm">{error}</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-16">
        <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-mid text-sm">Sie haben noch keine Bestellungen.</p>
        <Link href="/" className="inline-block mt-4 text-sm text-brand hover:underline">
          Jetzt einkaufen
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-xl font-[family-name:var(--font-poppins-bold)] text-dark mb-6">
        Meine Bestellungen
      </h1>

      <div className="space-y-4">
        {orders.map((order) => {
          const status = statusLabels[order.status] || { label: order.status, color: 'bg-gray-100 text-gray-800' };

          return (
            <Link
              key={order.id}
              href={`/konto/bestellungen/${order.id}`}
              className="block bg-white border border-ash rounded-lg p-5 hover:border-brand hover:shadow-sm transition-all"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-dark">#{order.id}</span>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${status.color}`}>
                    {status.label}
                  </span>
                </div>
                <span className="text-sm text-mid">{formatDate(order.date_created)}</span>
              </div>

              <div className="text-sm text-mid mb-2">
                {order.line_items.slice(0, 3).map((item) => (
                  <span key={item.id} className="block truncate">
                    {item.quantity}x {item.name}
                  </span>
                ))}
                {order.line_items.length > 3 && (
                  <span className="text-xs text-mid">
                    + {order.line_items.length - 3} weitere Artikel
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-ash">
                <span className="text-xs text-mid">{order.payment_method_title}</span>
                <span className="text-sm font-semibold text-dark">{formatPrice(order.total)}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
