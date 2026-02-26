'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [email, setEmail] = useState('');
  const [newsletter, setNewsletter] = useState(false);

  return (
    <div className="mb-8">
      {/* Sektion-Header */}
      <div className="flex flex-row items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-dark">Kontakt</h2>
        <a href="/login" className="text-sm text-brand hover:underline">
          Anmelden
        </a>
      </div>

      {/* E-Mail Input */}
      <input
        type="email"
        placeholder="E-Mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full h-12 px-4 text-sm text-dark bg-white border border-ash rounded-lg focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-colors"
      />

      {/* Newsletter Checkbox */}
      <label className="flex items-center gap-3 mt-3 cursor-pointer">
        <input
          type="checkbox"
          checked={newsletter}
          onChange={(e) => setNewsletter(e.target.checked)}
          className="w-5 h-5 rounded border-ash text-brand focus:ring-brand"
        />
        <span className="text-sm text-mid">
          Neuigkeiten und Angebote via E-Mail erhalten
        </span>
      </label>
    </div>
  );
}
