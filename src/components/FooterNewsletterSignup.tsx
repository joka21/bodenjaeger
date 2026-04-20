'use client';

import { useState } from 'react';

export default function FooterNewsletterSignup() {
  const [email, setEmail] = useState('');
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setMessage({ type: 'error', text: 'Bitte gültige E-Mail eingeben.' });
      return;
    }

    if (!acceptPrivacy) {
      setMessage({
        type: 'error',
        text: 'Bitte Datenschutzerklärung bestätigen.',
      });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: 'success',
          text: 'Fast geschafft! Bitte Bestätigungs-Link in der E-Mail anklicken.',
        });
        setEmail('');
        setAcceptPrivacy(false);
      } else {
        setMessage({
          type: 'error',
          text: data.error || 'Ein Fehler ist aufgetreten.',
        });
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setMessage({
        type: 'error',
        text: 'Ein Fehler ist aufgetreten.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8">
      {/* Überschrift */}
      <h3 className="text-white text-xl font-semibold mb-4">
        Newsletter abonnieren
      </h3>

      {/* Form */}
      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex rounded-full overflow-hidden shadow-lg">
          {/* Input */}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Deine E-Mail-Adresse"
            disabled={isLoading}
            className="flex-grow py-3 px-5 bg-white text-gray-900 placeholder-gray-500 focus:outline-none disabled:opacity-50 rounded-l-full"
            required
          />
          {/* Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="py-3 px-6 text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap rounded-r-full hover:opacity-90"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            {isLoading ? 'Lädt...' : 'Anmelden'}
          </button>
        </div>

        <label className="flex items-start gap-2 mt-3 text-white text-xs cursor-pointer">
          <input
            type="checkbox"
            checked={acceptPrivacy}
            onChange={(e) => setAcceptPrivacy(e.target.checked)}
            disabled={isLoading}
            className="mt-0.5 w-4 h-4 accent-brand shrink-0"
            required
          />
          <span className="opacity-90">
            Ich akzeptiere die{' '}
            <a href="/datenschutz" className="underline hover:opacity-100" target="_blank" rel="noopener">
              Datenschutzerklärung
            </a>
            . Bestätigung per E-Mail (Double-Opt-In). Abmeldung jederzeit möglich.
          </span>
        </label>

        {/* Message */}
        {message && (
          <div
            className={`mt-3 px-4 py-2 rounded text-sm text-center ${
              message.type === 'success'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {message.text}
          </div>
        )}
      </form>
    </div>
  );
}
