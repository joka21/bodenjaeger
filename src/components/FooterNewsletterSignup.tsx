'use client';

import { useState } from 'react';

export default function FooterNewsletterSignup() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setMessage({ type: 'error', text: 'Bitte gültige E-Mail eingeben.' });
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
          text: 'Vielen Dank! Bestätigungs-E-Mail gesendet.',
        });
        setEmail('');
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
