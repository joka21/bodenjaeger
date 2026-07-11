'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';
import { isLandingRoute } from '@/lib/landingRoutes';

/**
 * Blendet den Shop-Footer auf der Fachmarkt-Landingpage aus (dort schließt der
 * Abschluss-Block mit Standort/Kontakt die Seite ab). Nutzt dieselbe Quelle
 * wie HeaderWrapper: `isLandingRoute`.
 */
export default function FooterWrapper() {
  const pathname = usePathname();
  if (isLandingRoute(pathname)) return null;
  return <Footer />;
}
