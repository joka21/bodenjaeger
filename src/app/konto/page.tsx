'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function KontoPage() {
  const { user, logout } = useAuth();

  if (!user) return null;

  const menuItems = [
    {
      title: 'Bestellungen',
      description: 'Bestellhistorie und Sendungsverfolgung',
      href: '/konto/bestellungen',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      title: 'Adressen',
      description: 'Liefer- und Rechnungsadressen verwalten',
      href: '/konto/adressen',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      title: 'Einstellungen',
      description: 'Passwort und persönliche Daten',
      href: '/konto/einstellungen',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      title: 'Favoriten',
      description: 'Ihre gespeicherten Produkte',
      href: '/favoriten',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div>
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-[family-name:var(--font-poppins-bold)] text-dark">
          Hallo, {user.firstName || user.displayName}
        </h1>
        <p className="text-mid text-sm mt-1">
          Willkommen in Ihrem Kundenkonto.
        </p>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="bg-white border border-ash rounded-lg p-6 hover:border-brand hover:shadow-sm transition-all group"
          >
            <div className="text-mid group-hover:text-brand transition-colors mb-3">
              {item.icon}
            </div>
            <h2 className="font-semibold text-dark text-sm">{item.title}</h2>
            <p className="text-mid text-xs mt-1">{item.description}</p>
          </Link>
        ))}
      </div>

      {/* Logout */}
      <div className="mt-8">
        <button
          onClick={() => logout()}
          className="text-sm text-mid hover:text-brand transition-colors"
        >
          Abmelden
        </button>
      </div>
    </div>
  );
}
