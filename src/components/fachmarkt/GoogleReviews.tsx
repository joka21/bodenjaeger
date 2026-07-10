import { Star } from 'lucide-react'
import { GOOGLE_REVIEWS } from '@/content/fachmarkt'
import Reveal from './Reveal'

/**
 * Sektion 10: Google-Bewertung als statische Platzhalter-Kennzahlen
 * (4,8 / 180+). Echte Review-Einbindung noch offen — siehe content-TODO.
 */
export default function GoogleReviews() {
  const { kicker, headline, rating, count, countSuffix, hinweis } = GOOGLE_REVIEWS
  const full = Math.floor(rating)

  return (
    <section className="py-16 md:py-24">
      <div className="content-container">
        <Reveal className="mx-auto max-w-3xl rounded-3xl bg-navy px-8 py-12 text-center text-white">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-white/70">
            {kicker}
          </p>
          <h2 className="font-bold" style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)' }}>
            {headline}
          </h2>

          <div className="mt-8 flex flex-col items-center gap-3">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={i < full ? 'fill-brand text-brand' : 'fill-white/30 text-white/30'}
                  style={{ width: 32, height: 32 }}
                />
              ))}
            </div>
            <div className="text-5xl font-bold">
              {rating.toLocaleString('de-DE', { minimumFractionDigits: 1 })}
            </div>
            <p className="text-white/80">
              {count}
              {countSuffix} {hinweis}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
