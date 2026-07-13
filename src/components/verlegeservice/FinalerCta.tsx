import { VERLEGE_FINAL } from '@/content/verlegeservice'
import CtaButton from '@/components/shared/CtaButton'
import Reveal from '@/components/shared/Reveal'

/** Finaler CTA (dunkel/anthrazit): Headline, Text, 2 CTAs. */
export default function FinalerCta() {
  const { headline, text, cta, ctaSekundaer } = VERLEGE_FINAL

  return (
    <section className="bg-dark py-28 text-white md:py-40">
      <Reveal className="content-container text-center">
        <h2 className="mx-auto max-w-3xl font-bold" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)' }}>
          {headline}
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-white/80">{text}</p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <CtaButton cta={cta} size="lg" />
          <CtaButton cta={ctaSekundaer} size="lg" />
        </div>
      </Reveal>
    </section>
  )
}
