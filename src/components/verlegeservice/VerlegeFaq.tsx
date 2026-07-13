import { VERLEGE_FAQ } from '@/content/verlegeservice'
import Accordion from '@/components/shared/Accordion'
import Reveal from '@/components/shared/Reveal'

/** FAQ zum Verlegeservice. Antworten liegen vor → JSON-LD auf Page-Ebene aktiv. */
export default function VerlegeFaq() {
  const { headline, items } = VERLEGE_FAQ

  return (
    <section className="py-24 md:py-32">
      <div className="content-container">
        <Reveal className="mx-auto max-w-3xl">
          <h2 className="mb-8 font-bold text-dark" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            {headline}
          </h2>
          <Accordion items={items.map((i) => ({ frage: i.frage, antwort: i.antwort }))} />
        </Reveal>
      </div>
    </section>
  )
}
