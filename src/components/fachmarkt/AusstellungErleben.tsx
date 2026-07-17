import Image from 'next/image'
import { AUSSTELLUNG } from '@/content/fachmarkt'
// import CtaButton from '@/components/shared/CtaButton' // vorerst deaktiviert (360°-Button entfernt)
import Reveal from '@/components/shared/Reveal'

/**
 * Sektion 3: Immersive Vollbild-Sektion. Großes Bild (oder Video, sobald eine
 * Quelle geliefert wird), dunkler Verlauf, wenig Text, 360°-CTA.
 */
export default function AusstellungErleben() {
  return (
    <section
      id="ausstellung"
      className="relative flex min-h-[80vh] scroll-mt-24 items-end overflow-hidden bg-dark"
    >
      {AUSSTELLUNG.video ? (
        // Video-Slot: nur aktiv, wenn eine Quelle hinterlegt ist. Poster = Bild,
        // lazy (preload none), dezent im Hintergrund.
        <video
          className="absolute inset-0 h-full w-full object-cover"
          poster={AUSSTELLUNG.image}
          preload="none"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src={AUSSTELLUNG.video} />
        </video>
      ) : (
        <Image
          src={AUSSTELLUNG.image}
          alt={AUSSTELLUNG.imageAlt}
          fill
          sizes="100vw"
          // Mobil weiter rechts (Kopf + Hand der Kundin sichtbar), ab md wieder mittig.
          className="object-cover object-[75%_center] md:object-center"
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

      <div className="content-container relative py-20 md:py-28">
        <Reveal className="max-w-2xl text-white">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-brand">
            {AUSSTELLUNG.kicker}
          </p>
          <h2 className="font-bold" style={{ fontSize: 'clamp(2.25rem, 5vw, 4rem)' }}>
            {AUSSTELLUNG.headline}
          </h2>
          <p className="mt-5 text-lg text-white/85 md:text-xl">{AUSSTELLUNG.text}</p>
          {/* 360°-Button vorerst entfernt, bis neue Aufnahmen vorliegen.
              Zum Reaktivieren den folgenden Block wieder einkommentieren: */}
          {/* <div className="mt-8">
            <CtaButton cta={AUSSTELLUNG.cta} size="lg" />
          </div> */}
        </Reveal>
      </div>
    </section>
  )
}
