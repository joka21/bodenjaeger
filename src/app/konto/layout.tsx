'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
  { href: '/konto', label: 'Übersicht' },
  { href: '/konto/bestellungen', label: 'Bestellungen' },
  { href: '/konto/adressen', label: 'Adressen' },
  { href: '/konto/einstellungen', label: 'Einstellungen' },
];

export default function KontoLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoading, isLoggedIn } = useAuth();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push('/login');
    }
  }, [isLoading, isLoggedIn, router]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-pale flex items-center justify-center">
        <div className="text-mid">Wird geladen...</div>
      </main>
    );
  }

  if (!isLoggedIn) return null;

  return (
    <main className="min-h-screen bg-pale">
      <div className="content-container py-8 md:py-12">
        {/* Navigation Tabs */}
        <nav className="flex gap-1 mb-8 overflow-x-auto border-b border-ash">
          {navItems.map((item) => {
            const isActive = item.href === '/konto'
              ? pathname === '/konto'
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${
                  isActive
                    ? 'text-brand border-brand'
                    : 'text-mid border-transparent hover:text-dark'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {children}
      </div>
    </main>
  );
}
