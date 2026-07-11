'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import { isLandingRoute } from '@/lib/landingRoutes';

export default function HeaderWrapper() {
  const pathname = usePathname();
  // Auf der Fachmarkt-Landingpage übernimmt die reduzierte Landing-Navigation.
  if (isLandingRoute(pathname)) return null;
  return <Header />;
}
