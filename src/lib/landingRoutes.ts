/**
 * Zentrale Definition der Landingpage-Routen, auf denen die reguläre
 * Shop-Navigation (Header + Footer) durch die reduzierte Landing-Navigation
 * ersetzt wird.
 *
 * WICHTIG (Kundenvorgabe): Nur der EXAKTE Pfad `/fachmarkt-hueckelhoven` gilt
 * als Landingpage. Die `[slug]`-Unterseiten (z. B.
 * `/fachmarkt-hueckelhoven/verlegeservice`) behalten bewusst die
 * Shop-Navigation und werden hier NICHT erfasst → exakter Match, kein Prefix.
 *
 * Einzige Quelle der Wahrheit: HeaderWrapper, FooterWrapper und die
 * Landing-Navigation importieren alle `isLandingRoute` von hier.
 */
export const LANDING_ROUTES = ['/fachmarkt-hueckelhoven'] as const

/** true nur bei exaktem Match einer Landing-Route (ohne Unterseiten). */
export function isLandingRoute(pathname: string | null | undefined): boolean {
  if (!pathname) return false
  // Trailing Slash tolerieren, sonst exakter Vergleich.
  const normalized = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
  return (LANDING_ROUTES as readonly string[]).includes(normalized)
}

/**
 * true für die Landingpage UND alle Unterseiten (Prefix-Match auf
 * `/fachmarkt-hueckelhoven`). Für Elemente, die im gesamten Fachmarkt-Bereich
 * ausgeblendet werden (z. B. die globalen Floating-Buttons).
 */
export function isFachmarktRoute(pathname: string | null | undefined): boolean {
  if (!pathname) return false
  return pathname === '/fachmarkt-hueckelhoven' || pathname.startsWith('/fachmarkt-hueckelhoven/')
}
