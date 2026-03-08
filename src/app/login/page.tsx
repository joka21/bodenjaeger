'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

type Tab = 'login' | 'register';

export default function LoginPage() {
  const router = useRouter();
  const { login, register } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Honeypot (spam protection)
  const [honeypot, setHoneypot] = useState('');

  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPasswordConfirm, setRegPasswordConfirm] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await login(loginEmail, loginPassword, honeypot);

    if (result.success) {
      router.push('/konto');
    } else {
      setError(result.error || 'Login fehlgeschlagen');
    }

    setLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (regPassword !== regPasswordConfirm) {
      setError('Passwörter stimmen nicht überein');
      setLoading(false);
      return;
    }

    const result = await register({
      email: regEmail,
      password: regPassword,
      firstName: regFirstName,
      lastName: regLastName,
      website: honeypot,
    });

    if (result.success) {
      setSuccess('Konto erfolgreich erstellt!');
      setTimeout(() => router.push('/konto'), 1000);
    } else {
      setError(result.error || 'Registrierung fehlgeschlagen');
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-pale flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Logo / Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-[family-name:var(--font-poppins-bold)] text-dark">
            Mein Konto
          </h1>
          <p className="text-mid mt-2 text-sm">
            {activeTab === 'login'
              ? 'Melden Sie sich an, um Ihre Bestellungen zu verwalten.'
              : 'Erstellen Sie ein Konto für ein besseres Einkaufserlebnis.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-ash mb-6">
          <button
            onClick={() => { setActiveTab('login'); setError(null); setSuccess(null); }}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${
              activeTab === 'login'
                ? 'text-brand border-b-2 border-brand'
                : 'text-mid hover:text-dark'
            }`}
          >
            Anmelden
          </button>
          <button
            onClick={() => { setActiveTab('register'); setError(null); setSuccess(null); }}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${
              activeTab === 'register'
                ? 'text-brand border-b-2 border-brand'
                : 'text-mid hover:text-dark'
            }`}
          >
            Registrieren
          </button>
        </div>

        {/* Error / Success */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 text-sm">{success}</p>
          </div>
        )}

        {/* Login Form */}
        {activeTab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Honeypot - invisible to users, bots fill it */}
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
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              className="w-full px-4 py-3 border border-ash rounded-lg focus:outline-none focus:border-brand text-sm"
            />
            <input
              type="password"
              placeholder="Passwort"
              required
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              className="w-full px-4 py-3 border border-ash rounded-lg focus:outline-none focus:border-brand text-sm"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand text-white font-semibold rounded-lg hover:bg-[#d11920] transition-colors disabled:bg-gray-400 text-sm"
            >
              {loading ? 'Wird angemeldet...' : 'Anmelden'}
            </button>
            <div className="text-center">
              <Link
                href="/passwort-vergessen"
                className="text-sm text-brand hover:underline"
              >
                Passwort vergessen?
              </Link>
            </div>
          </form>
        )}

        {/* Register Form */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4">
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
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Vorname"
                required
                value={regFirstName}
                onChange={(e) => setRegFirstName(e.target.value)}
                className="px-4 py-3 border border-ash rounded-lg focus:outline-none focus:border-brand text-sm"
              />
              <input
                type="text"
                placeholder="Nachname"
                required
                value={regLastName}
                onChange={(e) => setRegLastName(e.target.value)}
                className="px-4 py-3 border border-ash rounded-lg focus:outline-none focus:border-brand text-sm"
              />
            </div>
            <input
              type="email"
              placeholder="E-Mail-Adresse"
              required
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              className="w-full px-4 py-3 border border-ash rounded-lg focus:outline-none focus:border-brand text-sm"
            />
            <input
              type="password"
              placeholder="Passwort (mind. 8 Zeichen)"
              required
              minLength={8}
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
              className="w-full px-4 py-3 border border-ash rounded-lg focus:outline-none focus:border-brand text-sm"
            />
            <input
              type="password"
              placeholder="Passwort bestätigen"
              required
              minLength={8}
              value={regPasswordConfirm}
              onChange={(e) => setRegPasswordConfirm(e.target.value)}
              className="w-full px-4 py-3 border border-ash rounded-lg focus:outline-none focus:border-brand text-sm"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand text-white font-semibold rounded-lg hover:bg-[#d11920] transition-colors disabled:bg-gray-400 text-sm"
            >
              {loading ? 'Wird registriert...' : 'Konto erstellen'}
            </button>
            <p className="text-xs text-mid text-center">
              Mit der Registrierung akzeptieren Sie unsere{' '}
              <Link href="/agb" className="text-brand hover:underline">AGB</Link> und{' '}
              <Link href="/datenschutz" className="text-brand hover:underline">Datenschutzerklärung</Link>.
            </p>
          </form>
        )}
      </div>
    </main>
  );
}
