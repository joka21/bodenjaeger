import {
  Layers,
  Grid3x3,
  TreePine,
  Rows3,
  Square,
  Footprints,
  type LucideIcon,
} from 'lucide-react'
import { VERLEGE_BODENARTEN } from '@/content/verlegeservice'
import CtaButton from '@/components/shared/CtaButton'
import Reveal from '@/components/shared/Reveal'

const ICONS: Record<string, LucideIcon> = { Layers, Grid3x3, TreePine, Rows3, Square, Footprints }

/** Bodenarten: 7 Karten (Icon + Titel) + Zusatztext + CTA. */
export default function BodenartenSection() {
  const { headline, items, zusatztext, cta } = VERLEGE_BODENARTEN

  return (
    <section className="bg-pale py-24 md:py-32">
      <div className="content-container">
        <Reveal className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="font-bold text-dark" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            {headline}
          </h2>
        </Reveal>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-7">
          {items.map((item, i) => {
            const Icon = ICONS[item.icon] ?? Square
            return (
              <Reveal key={item.titel} delay={i * 50}>
                <div className="flex h-full flex-col items-center gap-3 rounded-2xl border border-ash bg-white p-5 text-center shadow-sm">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="text-sm font-bold text-dark">{item.titel}</span>
                </div>
              </Reveal>
            )
          })}
        </div>

        <Reveal className="mx-auto mt-12 max-w-2xl text-center">
          <p className="text-mid">{zusatztext}</p>
          <div className="mt-8">
            <CtaButton cta={cta} size="lg" />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
