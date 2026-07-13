import Link from 'next/link'
import type { Cta, CtaVariant } from '@/types/cta'

const VARIANTS: Record<CtaVariant, string> = {
  // Primär = Bodenjäger-Rot (ersetzt die "Gelb"-Rolle des Briefings — Projekt-CI)
  primary: 'bg-brand text-white hover:bg-[#c8161e] shadow-sm',
  // Sekundär = Anthrazit (CI, kein Blau). bg-mid ist heller als bg-dark →
  // bleibt auf dunklen Bändern (bg-dark) sichtbar.
  secondary: 'bg-mid text-white hover:bg-dark',
  // Tertiär = dezenter Outline
  outline: 'border-2 border-dark text-dark hover:bg-dark hover:text-white',
}

interface CtaButtonProps {
  cta: Cta
  className?: string
  size?: 'md' | 'lg'
}

/**
 * Einheitlicher CTA-Button. Externe Ziele (tel:, Maps, 360°) als <a>,
 * interne Routen als next/link. Touch-Target min. 48px hoch.
 * Geteilt zwischen Fachmarkt- und Service-Seite.
 */
export default function CtaButton({ cta, className = '', size = 'md' }: CtaButtonProps) {
  const sizeCls = size === 'lg' ? 'px-10 py-5 text-lg md:text-xl' : 'px-7 py-3.5 text-base'
  const cls = `inline-flex items-center justify-center gap-2 rounded-xl font-bold min-h-[48px] transition-colors duration-200 ${VARIANTS[cta.variant]} ${sizeCls} ${className}`

  if (cta.external) {
    return (
      <a href={cta.href} className={cls}>
        {cta.label}
      </a>
    )
  }
  return (
    <Link href={cta.href} className={cls}>
      {cta.label}
    </Link>
  )
}
