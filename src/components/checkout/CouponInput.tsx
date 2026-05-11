'use client';

/**
 * Gutscheincode-Eingabe (klappbar) für OrderSummary.
 *
 * Zustands-Maschine:
 *   collapsed-empty   → Link „Gutscheincode einlösen?"
 *   collapsed-applied → Status-Chip „✓ Code XYZ angewendet (−12,34 €)" + × + „Anderen Code"
 *   expanded          → Input + „Anwenden"-Button (rot/Brand)
 *
 * Replace-Flow: Während ein Code aktiv ist, öffnet „Anderen Code" das Input
 * mit einem Hinweis auf den aktiven Code. Apply mit anderem Code löst
 * `onReplace(oldCode, newCoupon)` aus; Apply mit gleichem Code wird wie
 * Apply normaler Apply behandelt.
 *
 * Client-seitige Sanitization in `onChange` reicht; der Server saniert
 * dieselben Regeln nochmals (zentral in `coupon.ts.sanitizeCouponCode`).
 */

import { useState } from 'react';
import type { AppliedCoupon, CartItemForValidation, ValidateCouponResult } from '@/lib/coupon';

interface CouponInputProps {
  cartItems: CartItemForValidation[];
  appliedCoupon: AppliedCoupon | null;
  onApply: (coupon: AppliedCoupon) => void;
  onRemove: () => void;
  onReplace: (oldCode: string, newCoupon: AppliedCoupon) => void;
}

const CODE_MAX_LENGTH = 50;

/** Client-seitig: trim → uppercase → Whitelist [A-Z0-9_-], max 50 Zeichen. */
function sanitizeInput(raw: string): string {
  const upper = raw.toUpperCase().slice(0, CODE_MAX_LENGTH);
  let cleaned = '';
  for (const ch of upper) {
    if (/[A-Z0-9_-]/.test(ch)) cleaned += ch;
  }
  return cleaned;
}

export default function CouponInput({
  cartItems,
  appliedCoupon,
  onApply,
  onRemove,
  onReplace,
}: CouponInputProps) {
  const [expanded, setExpanded] = useState(false);
  const [code, setCode] = useState('');
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setCode('');
    setError(null);
    setValidating(false);
    setExpanded(false);
  };

  const handleApply = async () => {
    const cleanCode = sanitizeInput(code);
    if (!cleanCode) {
      setError('Bitte einen gültigen Code eingeben.');
      return;
    }

    setValidating(true);
    setError(null);

    try {
      const response = await fetch('/api/checkout/validate-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: cleanCode, cartItems }),
      });
      const result: ValidateCouponResult = await response.json();

      if (result.valid) {
        if (appliedCoupon && appliedCoupon.code !== result.coupon.code) {
          onReplace(appliedCoupon.code, result.coupon);
        } else {
          onApply(result.coupon);
        }
        reset();
      } else {
        setError(result.message);
        setValidating(false);
      }
    } catch (err) {
      console.error('[CouponInput] Apply failed:', err);
      setError('Verbindung fehlgeschlagen. Bitte erneut versuchen.');
      setValidating(false);
    }
  };

  // Applied + collapsed: Status-Chip mit „×" und „Anderen Code" (F-3=b, F-7=a)
  if (appliedCoupon && !expanded) {
    return (
      <div className="mb-6 flex items-center justify-between gap-3 p-3 rounded-lg border border-ash bg-pale">
        <div className="flex-1 text-sm text-dark">
          <span style={{ color: 'var(--color-success)' }}>✓</span>{' '}
          Code <strong>{appliedCoupon.code}</strong> angewendet
          {appliedCoupon.discountAmount > 0 && (
            <>
              {' '}
              <span className="text-brand">
                (−{appliedCoupon.discountAmount.toFixed(2).replace('.', ',')} €)
              </span>
            </>
          )}
          {appliedCoupon.freeShipping && (
            <span className="ml-1 text-xs text-mid">+ kostenloser Versand</span>
          )}
        </div>
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="text-xs text-brand hover:underline whitespace-nowrap"
        >
          Anderen Code
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="text-mid hover:text-dark text-lg leading-none"
          aria-label="Code entfernen"
        >
          ×
        </button>
      </div>
    );
  }

  // Empty + collapsed: Trigger-Link (C2=a)
  if (!appliedCoupon && !expanded) {
    return (
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className="block text-sm text-brand hover:underline mb-6"
      >
        Gutscheincode einlösen?
      </button>
    );
  }

  // Expanded: Input + Anwenden + optionaler Replace-Hinweis
  return (
    <div className="mb-6">
      {appliedCoupon && (
        <p className="text-xs text-mid mb-2">
          Aktiver Code: <strong>{appliedCoupon.code}</strong> — ein neuer Code überschreibt diesen.
        </p>
      )}
      <div className="flex flex-row gap-2">
        <input
          type="text"
          inputMode="text"
          autoCapitalize="characters"
          placeholder="Gutscheincode"
          value={code}
          onChange={(e) => {
            setCode(sanitizeInput(e.target.value));
            if (error) setError(null);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleApply();
            }
          }}
          disabled={validating}
          maxLength={CODE_MAX_LENGTH}
          className="flex-1 h-12 px-4 text-sm border border-ash rounded-lg focus:outline-none focus:border-brand disabled:bg-gray-50"
        />
        <button
          type="button"
          onClick={handleApply}
          disabled={validating || code.length === 0}
          className="px-6 h-12 text-sm font-medium text-white bg-brand rounded-lg hover:bg-[#d11920] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {validating ? '…' : 'Anwenden'}
        </button>
      </div>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
      <button
        type="button"
        onClick={() => {
          setCode('');
          setError(null);
          setExpanded(false);
        }}
        className="mt-2 text-xs text-mid hover:text-dark"
      >
        Abbrechen
      </button>
    </div>
  );
}
