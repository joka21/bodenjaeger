'use client';

import { useState } from 'react';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setMessage({ type: 'error', text: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.' });
      return;
    }

    if (!acceptPrivacy) {
      setMessage({
        type: 'error',
        text: 'Bitte bestätigen Sie die Datenschutzerklärung, um den Newsletter zu abonnieren.',
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
          text: 'Fast geschafft! Wir haben Ihnen eine Bestätigungs-E-Mail geschickt. Bitte klicken Sie auf den Link darin, um die Anmeldung abzuschließen (Double-Opt-In).',
        });
        setEmail('');
        setAcceptPrivacy(false);
      } else {
        setMessage({
          type: 'error',
          text: data.error || 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.',
        });
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setMessage({
        type: 'error',
        text: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full py-12" style={{ backgroundColor: 'var(--color-bg-darkest)' }}>
      <div className="content-container">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Icon */}
            <div className="flex-shrink-0">
              <svg
                className="w-12 h-12 md:w-16 md:h-16 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>

            {/* Text */}
            <div className="text-white text-center md:text-left flex-grow">
              <h3 className="text-2xl md:text-3xl font-bold mb-2">
                Newsletter abonnieren
              </h3>
              <p className="text-base md:text-lg opacity-90">
                Verpasse keine Angebote und Neuheiten – melde dich jetzt an!
              </p>
            </div>

            {/* Form */}
            <div className="w-full md:w-auto md:flex-shrink-0">
              <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full md:w-auto">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Deine E-Mail-Adresse"
                    disabled={isLoading}
                    className="px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 w-full sm:w-64"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-3 rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    style={{
                      backgroundColor: 'var(--color-primary)',
                      color: 'white',
                    }}
                  >
                    {isLoading ? 'Lädt...' : 'Anmelden'}
                  </button>
                </div>

                <label className="flex items-start gap-2 text-white text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptPrivacy}
                    onChange={(e) => setAcceptPrivacy(e.target.checked)}
                    disabled={isLoading}
                    className="mt-0.5 w-4 h-4 accent-brand shrink-0"
                    required
                  />
                  <span className="opacity-90">
                    Ich habe die{' '}
                    <a href="/datenschutz" className="underline hover:opacity-100" target="_blank" rel="noopener">
                      Datenschutzerklärung
                    </a>{' '}
                    gelesen und stimme zu, dass meine E-Mail-Adresse für den Versand des Newsletters
                    verarbeitet wird. Die Einwilligung kann jederzeit widerrufen werden.
                  </span>
                </label>
              </form>

              {/* Message */}
              {message && (
                <div
                  className={`mt-3 px-4 py-2 rounded text-sm ${
                    message.type === 'success'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {message.text}
                </div>
              )}
            </div>
          </div>

          {/* Privacy Notice */}
          <p className="text-white text-xs opacity-70 mt-4 text-center md:text-left">
            Die Anmeldung erfolgt im Double-Opt-In-Verfahren: Sie erhalten eine Bestätigungs-E-Mail
            und müssen den Link darin anklicken, damit Ihre Anmeldung wirksam wird. Sie können sich
            jederzeit wieder abmelden.
          </p>
        </div>
      </div>
    </div>
  );
}
