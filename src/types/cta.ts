/**
 * Gemeinsamer CTA-Typ für Landing-/Service-Seiten (Fachmarkt + Service).
 * Früher in content/fachmarkt.ts definiert, jetzt zentral, damit der geteilte
 * CtaButton (components/shared/CtaButton.tsx) keine Feature-Abhängigkeit hat.
 *
 * 🔴 primary = Bodenjäger-Rot · secondary = Navy · outline = dezenter Rahmen (kein Grün — Projekt-CI)
 */
export type CtaVariant = 'primary' | 'secondary' | 'outline'

export interface Cta {
  label: string
  href: string
  variant: CtaVariant
  /** true → nativer Link (tel:, maps), kein next/link */
  external?: boolean
}
