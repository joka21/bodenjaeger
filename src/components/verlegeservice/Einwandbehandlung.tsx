import { VERLEGE_EINWAND } from '@/content/verlegeservice'
import Reveal from '@/components/shared/Reveal'

/** Einwandbehandlung: 4 Frage/Antwort-Karten (bewusst KEIN Accordion). */
export default function Einwandbehandlung() {
  const { headline, karten } = VERLEGE_EINWAND

  return (
    <section className="bg-pale py-24 md:py-32">
      <div className="content-container">
        <Reveal className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="font-bold text-dark" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            {headline}
          </h2>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-2">
          {karten.map((k, i) => (
            <Reveal key={k.frage} delay={i * 80}>
              <div className="h-full rounded-2xl border border-ash bg-white p-6 shadow-sm md:p-8">
                <h3 className="font-bold text-dark">{k.frage}</h3>
                <p className="mt-3 text-mid">{k.antwort}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
