import { Star } from 'lucide-react'
import { GOOGLE_REVIEWS } from '@/content/fachmarkt'
import reviewsData from '@/data/google-reviews.json'
import { relativesDatum } from '@/lib/reviewDate'
import Reveal from '@/components/shared/Reveal'

/** Google-„G" als Herkunftsnachweis auf jeder Karte. */
function GoogleLogo({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  )
}

function Sterne({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} von 5 Sternen`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={i < rating ? 'fill-[#fbbc05] text-[#fbbc05]' : 'fill-ash text-ash'}
          style={{ width: size, height: size }}
        />
      ))}
    </div>
  )
}

function initialen(name: string) {
  const teile = name.trim().split(/\s+/)
  return teile.length >= 2 ? teile[0][0] + teile[1][0] : name[0]
}

/**
 * Sektion 10: Google-Bewertung als Kennzahl-Block (4,8 / 180+) plus kuratierte
 * Original-Rezensionen. Die Texte kommen aus src/data/google-reviews.json,
 * die Auswahl (ids) aus GOOGLE_REVIEWS.reviewIds — nichts hart im JSX.
 */
export default function GoogleReviews() {
  const { kicker, headline, rating, count, countSuffix, hinweis, reviewIds } = GOOGLE_REVIEWS
  const full = Math.floor(rating)

  // Reihenfolge folgt reviewIds; fehlende ids werden still übersprungen.
  const reviews = reviewIds
    .map((id) => reviewsData.reviews.find((r) => r.id === id))
    .filter((r): r is (typeof reviewsData.reviews)[number] => Boolean(r))

  return (
    <section id="bewertungen" className="scroll-mt-24 py-24 md:py-32">
      <div className="content-container">
        <Reveal className="mx-auto max-w-3xl rounded-3xl bg-dark px-8 py-12 text-center text-white">
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

        {reviews.length > 0 && (
          <Reveal className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => (
              <figure
                key={review.id}
                className="flex h-full flex-col rounded-3xl border border-ash bg-white p-6 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-dark text-base font-bold text-white">
                      {initialen(review.author)}
                    </div>
                    <div>
                      <p className="font-bold text-dark">{review.author}</p>
                      <p className="text-sm text-mid">
                        {relativesDatum(review.dateISO, review.date)}
                      </p>
                    </div>
                  </div>
                  <GoogleLogo className="mt-1 h-5 w-5 flex-shrink-0" />
                </div>

                <div className="mt-4">
                  <Sterne rating={review.rating} />
                </div>

                <blockquote className="mt-3 leading-relaxed text-mid">
                  &bdquo;{review.text}&ldquo;
                </blockquote>
              </figure>
            ))}
          </Reveal>
        )}
      </div>
    </section>
  )
}
