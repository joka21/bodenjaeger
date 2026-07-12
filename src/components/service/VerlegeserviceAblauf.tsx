import Image from 'next/image'
import { SERVICE_VERLEGEABLAUF } from '@/content/service'
import CtaButton from '@/components/shared/CtaButton'
import Reveal from '@/components/shared/Reveal'
import Timeline from '@/components/shared/Timeline'

/** Dunkler Conversion-Block: Hintergrundbild + Overlay, 7-Schritte-Timeline, CTA. */
export default function VerlegeserviceAblauf() {
  const { headline, text, image, imageAlt, schritte, cta } = SERVICE_VERLEGEABLAUF

  return (
    <section
      id="verlegeservice"
      className="relative scroll-mt-24 overflow-hidden bg-dark text-white"
    >
      <Image src={image} alt={imageAlt} fill sizes="100vw" className="object-cover" />
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, rgba(46,45,50,0.92) 0%, rgba(46,45,50,0.88) 100%)' }}
      />

      <div className="content-container relative py-28 md:py-40">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="font-bold" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            {headline}
          </h2>
          <p className="mt-4 text-lg text-white/80">{text}</p>
        </Reveal>

        <Timeline steps={[...schritte]} variant="dark" className="mt-16" />

        <Reveal className="mt-14 text-center">
          <CtaButton cta={cta} size="lg" />
        </Reveal>
      </div>
    </section>
  )
}
