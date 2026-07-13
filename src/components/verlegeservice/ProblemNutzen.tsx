import { ClipboardCheck, Layers, Hammer, Package } from 'lucide-react'
import { VERLEGE_PROBLEM } from '@/content/verlegeservice'
import Reveal from '@/components/shared/Reveal'

const ICONS = [ClipboardCheck, Layers, Hammer, Package]

/** Problem-Nutzen: Headline + Text + 4 Nutzen-Karten. */
export default function ProblemNutzen() {
  const { headline, text, karten } = VERLEGE_PROBLEM

  return (
    <section className="py-24 md:py-32">
      <div className="content-container">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="font-bold text-dark" style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)' }}>
            {headline}
          </h2>
          <p className="mt-5 text-lg text-mid">{text}</p>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {karten.map((k, i) => {
            const Icon = ICONS[i] ?? Package
            return (
              <Reveal key={k.titel} delay={i * 80}>
                <div className="flex h-full flex-col rounded-2xl border border-ash bg-white p-6 shadow-sm">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 font-bold text-dark">{k.titel}</h3>
                  <p className="mt-2 text-sm text-mid">{k.text}</p>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
