'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useCart, type SetBundle } from '@/contexts/CartContext';
import type { StoreApiProduct } from '@/lib/woocommerce';

interface OrderLineItem {
  id: number;
  name: string;
  product_id: number;
  quantity: number;
  total: string;
  price: number;
  meta_data: Array<{ key: string; value: string }>;
}

interface OrderAddress {
  first_name: string;
  last_name: string;
  company?: string;
  address_1: string;
  address_2?: string;
  city: string;
  postcode: string;
  country: string;
  email?: string;
  phone?: string;
}

interface OrderDetail {
  id: number;
  status: string;
  date_created: string;
  total: string;
  subtotal?: string;
  shipping_total: string;
  payment_method_title: string;
  customer_note: string;
  billing: OrderAddress;
  shipping: OrderAddress;
  line_items: OrderLineItem[];
  shipping_lines: Array<{ method_title: string; total: string }>;
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
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatPrice(price: string | number) {
  return parseFloat(String(price)).toLocaleString('de-DE', {
    style: 'currency',
    currency: 'EUR',
  });
}

export default function BestellungDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { addToCart, addSetToCart } = useCart();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reordering, setReordering] = useState(false);
  const [reorderSuccess, setReorderSuccess] = useState(false);
  const [reorderWarning, setReorderWarning] = useState<string | null>(null);
  const [reorderError, setReorderError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/auth/orders/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setOrder(data.order);
        } else {
          setError(data.error);
        }
      })
      .catch(() => setError('Bestellung konnte nicht geladen werden'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="text-mid text-sm">Bestellung wird geladen...</div>;
  }

  if (error || !order) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800 text-sm">{error || 'Bestellung nicht gefunden'}</p>
        <Link href="/konto/bestellungen" className="text-sm text-brand hover:underline mt-2 inline-block">
          Zurück zu Bestellungen
        </Link>
      </div>
    );
  }

  const status = statusLabels[order.status] || { label: order.status, color: 'bg-gray-100 text-gray-800' };

  const getMeta = (item: OrderLineItem, key: string): string | undefined =>
    item.meta_data?.find((m) => m.key === key)?.value;

  const handleReorder = async () => {
    setReordering(true);
    setReorderError(null);
    setReorderWarning(null);

    try {
      // Muster überspringen (waren in der Bestellung gratis und werden hier ignoriert)
      const reorderableItems = order.line_items.filter(
        (item) => !item.meta_data?.some((m) => m.key === '_is_sample')
      );

      if (reorderableItems.length === 0) {
        setReorderError('Keine bestellbaren Artikel in dieser Bestellung.');
        setReordering(false);
        setTimeout(() => setReorderError(null), 5000);
        return;
      }

      // Eindeutige Produkt-IDs sammeln und Backend-Daten laden
      const productIds = Array.from(new Set(reorderableItems.map((i) => i.product_id)));
      const response = await fetch('/api/products/by-ids', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: productIds }),
      });

      if (!response.ok) {
        throw new Error('Produktdaten konnten nicht geladen werden');
      }

      const products: StoreApiProduct[] = await response.json();
      const productMap = new Map(products.map((p) => [p.id, p]));

      // Items nach _set_id gruppieren
      const setGroups = new Map<string, OrderLineItem[]>();
      const singleItems: OrderLineItem[] = [];
      let missingProducts = 0;

      for (const item of reorderableItems) {
        if (!productMap.has(item.product_id)) {
          missingProducts++;
          continue;
        }

        const setId = getMeta(item, '_set_id');
        if (setId) {
          const group = setGroups.get(setId) ?? [];
          group.push(item);
          setGroups.set(setId, group);
        } else {
          singleItems.push(item);
        }
      }

      // Sets als Bundle in den Warenkorb legen
      for (const [, items] of setGroups) {
        const floorItem = items.find((i) => getMeta(i, '_set_item_type') === 'floor');
        const insulationItem = items.find((i) => getMeta(i, '_set_item_type') === 'insulation');
        const baseboardItem = items.find((i) => getMeta(i, '_set_item_type') === 'baseboard');

        // Ohne Boden kann kein Set rekonstruiert werden – einzeln in den Warenkorb
        if (!floorItem) {
          for (const item of items) {
            const product = productMap.get(item.product_id);
            if (product) addToCart(product, item.quantity);
          }
          continue;
        }

        const floorProduct = productMap.get(floorItem.product_id);
        if (!floorProduct) continue;

        const insulationProduct = insulationItem ? productMap.get(insulationItem.product_id) : undefined;
        const baseboardProduct = baseboardItem ? productMap.get(baseboardItem.product_id) : undefined;

        const setBundle: SetBundle = {
          floor: {
            product: floorProduct,
            packages: floorItem.quantity,
            actualM2: parseFloat(getMeta(floorItem, '_actual_m2') || '0'),
            setPricePerUnit: parseFloat(getMeta(floorItem, '_set_price_per_unit') || '0'),
            regularPricePerUnit: parseFloat(getMeta(floorItem, '_regular_price_per_unit') || '0'),
          },
          insulation: insulationItem && insulationProduct ? {
            product: insulationProduct,
            packages: insulationItem.quantity,
            actualM2: parseFloat(getMeta(insulationItem, '_actual_m2') || '0'),
            setPricePerUnit: parseFloat(getMeta(insulationItem, '_set_price_per_unit') || '0'),
            regularPricePerUnit: parseFloat(getMeta(insulationItem, '_regular_price_per_unit') || '0'),
            standardProduct: insulationProduct,
          } : null,
          baseboard: baseboardItem && baseboardProduct ? {
            product: baseboardProduct,
            packages: baseboardItem.quantity,
            actualLfm: parseFloat(getMeta(baseboardItem, '_actual_m2') || '0'),
            setPricePerUnit: parseFloat(getMeta(baseboardItem, '_set_price_per_unit') || '0'),
            regularPricePerUnit: parseFloat(getMeta(baseboardItem, '_regular_price_per_unit') || '0'),
            standardProduct: baseboardProduct,
          } : null,
        };

        addSetToCart(setBundle);
      }

      // Reguläre Einzelartikel
      for (const item of singleItems) {
        const product = productMap.get(item.product_id);
        if (product) addToCart(product, item.quantity);
      }

      setReorderSuccess(true);
      if (missingProducts > 0) {
        setReorderWarning(
          `${missingProducts} Artikel ${missingProducts === 1 ? 'ist' : 'sind'} nicht mehr verfügbar und wurde${missingProducts === 1 ? '' : 'n'} übersprungen.`
        );
      }
      setTimeout(() => {
        setReorderSuccess(false);
        setReorderWarning(null);
      }, 5000);
    } catch (err) {
      console.error('Reorder failed:', err);
      setReorderError('Erneut bestellen fehlgeschlagen. Bitte später erneut versuchen.');
      setTimeout(() => setReorderError(null), 5000);
    } finally {
      setReordering(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <Link href="/konto/bestellungen" className="text-sm text-brand hover:underline mb-2 inline-block">
            &larr; Alle Bestellungen
          </Link>
          <h1 className="text-xl font-[family-name:var(--font-poppins-bold)] text-dark">
            Bestellung #{order.id}
          </h1>
          <p className="text-sm text-mid mt-1">{formatDate(order.date_created)}</p>
        </div>
        <span className={`text-sm px-3 py-1.5 rounded-full font-medium ${status.color}`}>
          {status.label}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Artikel */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-ash rounded-lg overflow-hidden">
            <div className="px-5 py-4 border-b border-ash">
              <h2 className="text-sm font-semibold text-dark">Artikel</h2>
            </div>
            <div className="divide-y divide-ash">
              {order.line_items.map((item) => (
                <div key={item.id} className="px-5 py-4 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-dark font-medium truncate">{item.name}</p>
                    <p className="text-xs text-mid mt-1">Menge: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-semibold text-dark whitespace-nowrap">
                    {formatPrice(item.total)}
                  </span>
                </div>
              ))}
            </div>
            {/* Summen */}
            <div className="px-5 py-4 border-t border-ash bg-gray-50 space-y-2">
              <div className="flex justify-between text-sm text-mid">
                <span>Versand</span>
                <span>{parseFloat(order.shipping_total) > 0 ? formatPrice(order.shipping_total) : 'Kostenlos'}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-dark pt-2 border-t border-ash">
                <span>Gesamt</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Reorder */}
          <button
            onClick={handleReorder}
            disabled={reordering}
            className="mt-4 px-6 py-3 bg-brand text-white text-sm font-semibold rounded-lg hover:bg-[#d11920] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {reordering
              ? 'Wird in den Warenkorb gelegt...'
              : reorderSuccess
                ? 'Artikel wurden in den Warenkorb gelegt!'
                : 'Erneut bestellen'}
          </button>
          {reorderWarning && (
            <p className="mt-2 text-xs text-orange-700 bg-orange-50 border border-orange-200 rounded-md px-3 py-2">
              {reorderWarning}
            </p>
          )}
          {reorderError && (
            <p className="mt-2 text-xs text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {reorderError}
            </p>
          )}
        </div>

        {/* Seitenleiste */}
        <div className="space-y-4">
          {/* Zahlung */}
          <div className="bg-white border border-ash rounded-lg p-5">
            <h3 className="text-sm font-semibold text-dark mb-2">Zahlung</h3>
            <p className="text-sm text-mid">{order.payment_method_title}</p>
          </div>

          {/* Lieferadresse */}
          <div className="bg-white border border-ash rounded-lg p-5">
            <h3 className="text-sm font-semibold text-dark mb-2">Lieferadresse</h3>
            <p className="text-sm text-mid">
              {order.shipping.first_name} {order.shipping.last_name}<br />
              {order.shipping.company && <>{order.shipping.company}<br /></>}
              {order.shipping.address_1}<br />
              {order.shipping.postcode} {order.shipping.city}
            </p>
          </div>

          {/* Rechnungsadresse */}
          <div className="bg-white border border-ash rounded-lg p-5">
            <h3 className="text-sm font-semibold text-dark mb-2">Rechnungsadresse</h3>
            <p className="text-sm text-mid">
              {order.billing.first_name} {order.billing.last_name}<br />
              {order.billing.company && <>{order.billing.company}<br /></>}
              {order.billing.address_1}<br />
              {order.billing.postcode} {order.billing.city}
            </p>
          </div>

          {/* Kundennotiz */}
          {order.customer_note && (
            <div className="bg-white border border-ash rounded-lg p-5">
              <h3 className="text-sm font-semibold text-dark mb-2">Ihre Notiz</h3>
              <p className="text-sm text-mid whitespace-pre-wrap">{order.customer_note}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
