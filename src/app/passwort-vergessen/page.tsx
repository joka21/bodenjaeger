'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function PasswortVergessenPage() {
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, website: honeypot }),
      });

      const data = await res.json();

      if (data.success) {
        setSent(true);
      } else {
        setError(data.error || 'Ein Fehler ist aufgetreten');
      }
    } catch {
      setError('Ein Fehler ist aufgetreten');
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-pale flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-[family-name:var(--font-poppins-bold)] text-dark">
            Passwort vergessen
          </h1>
          <p className="text-mid mt-2 text-sm">
            Geben Sie Ihre E-Mail-Adresse ein und wir senden Ihnen einen Link zum Zurücksetzen.
          </p>
        </div>

        {sent ? (
          <div className="bg-white border border-ash rounded-lg p-6 text-center">
            <svg className="w-12 h-12 mx-auto mb-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <p className="text-sm text-dark mb-1 font-semibold">E-Mail gesendet</p>
            <p className="text-sm text-mid mb-4">
              Falls ein Konto mit <strong>{email}</strong> existiert, erhalten Sie in Kürze eine E-Mail mit weiteren Anweisungen.
            </p>
            <Link href="/login" className="text-sm text-brand hover:underline">
              Zurück zum Login
            </Link>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Honeypot */}
              <div className="absolute opacity-0 -z-10" aria-hidden="true" tabIndex={-1}>
                <input
                  type="text"
                  name="website"
                  autoComplete="off"
                  tabIndex={-1}
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>
              <input
                type="email"
                placeholder="E-Mail-Adresse"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-ash rounded-lg focus:outline-none focus:border-brand text-sm"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-brand text-white font-semibold rounded-lg hover:bg-[#d11920] transition-colors disabled:bg-gray-400 text-sm"
              >
                {loading ? 'Wird gesendet...' : 'Link senden'}
              </button>
            </form>

            <div className="text-center mt-4">
              <Link href="/login" className="text-sm text-brand hover:underline">
                Zurück zum Login
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
