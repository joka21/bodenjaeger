import Link from 'next/link'
import type { Cta, CtaVariant } from '@/content/fachmarkt'

const VARIANTS: Record<CtaVariant, string> = {
  // Primär = Bodenjäger-Rot (ersetzt die "Gelb"-Rolle des Briefings — Projekt-CI)
  primary: 'bg-brand text-white hover:bg-[#c8161e] shadow-sm',
  // Sekundär = Navy
  secondary: 'bg-navy text-white hover:bg-[#173583]',
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
 * interne Routen als next/link. Touch-Target min. 44px hoch.
 */
export default function CtaButton({ cta, className = '', size = 'md' }: CtaButtonProps) {
  const sizeCls = size === 'lg' ? 'px-8 py-4 text-lg' : 'px-6 py-3 text-base'
  const cls = `inline-flex items-center justify-center gap-2 rounded-xl font-bold min-h-[44px] transition-colors duration-200 ${VARIANTS[cta.variant]} ${sizeCls} ${className}`

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
