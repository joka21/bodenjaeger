import Reveal from './Reveal'

export interface TimelineStep {
  nr: number
  titel: string
  text: string
}

interface TimelineProps {
  steps: TimelineStep[]
  /** 'light' = heller Hintergrund (Fachmarkt-Besuchsablauf), 'dark' = dunkler Conversion-Block (Service-Verlegeservice) */
  variant?: 'light' | 'dark'
  className?: string
}

/**
 * Generische Schritt-Timeline. Desktop horizontal (Spaltenzahl = Schrittanzahl),
 * mobil vertikal. Geteilt: Fachmarkt (BesuchsAblauf, 5 Schritte, light) und
 * Service (VerlegeserviceAblauf, 7 Schritte, dark).
 */
export default function Timeline({ steps, variant = 'light', className = '' }: TimelineProps) {
  const dark = variant === 'dark'
  const lineCls = dark ? 'bg-white/20' : 'bg-ash'
  const titleCls = dark ? 'text-white' : 'text-dark'
  const textCls = dark ? 'text-white/70' : 'text-mid'

  return (
    <div className={className}>
      {/* Desktop: horizontale Timeline (dynamische Spaltenzahl) */}
      <div className="relative hidden md:block">
        <div className={`absolute left-0 right-0 top-6 h-0.5 ${lineCls}`} aria-hidden />
        <ol
          className="relative grid gap-6"
          style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}
        >
          {steps.map((s, i) => (
            <Reveal as="li" key={s.nr} delay={i * 100} className="text-center">
              <span className="relative z-10 mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand text-lg font-bold text-white">
                {s.nr}
              </span>
              <h3 className={`mt-4 font-bold ${titleCls}`}>{s.titel}</h3>
              <p className={`mt-2 text-sm ${textCls}`}>{s.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>

      {/* Mobile: vertikale Timeline */}
      <ol className="relative space-y-8 md:hidden">
        <div className={`absolute bottom-4 left-6 top-4 w-0.5 ${lineCls}`} aria-hidden />
        {steps.map((s) => (
          <li key={s.nr} className="relative flex gap-4">
            <span className="relative z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-brand text-lg font-bold text-white">
              {s.nr}
            </span>
            <div className="pt-1">
              <h3 className={`font-bold ${titleCls}`}>{s.titel}</h3>
              <p className={`mt-1 ${textCls}`}>{s.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
