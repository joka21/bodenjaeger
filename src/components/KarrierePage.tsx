'use client';

import { useMemo, useState, useEffect } from 'react';
import Image from 'next/image';
import Script from 'next/script';
import { WordPressPage } from '@/lib/wordpress';

interface KarrierePageProps {
  page: WordPressPage;
}

const benefits = [
  {
    title: 'Familiäres Team',
    description: 'Wir sind ein eingespieltes Team mit flachen Hierarchien und kurzen Entscheidungswegen.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    title: 'Sichere Branche',
    description: 'Bodenbeläge werden immer gebraucht – ein krisensicherer Markt mit Zukunft.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: 'Weiterbildung',
    description: 'Regelmäßige Schulungen und Produkttrainings halten dich immer auf dem neuesten Stand.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    title: 'Mitarbeiterrabatte',
    description: 'Attraktive Vergünstigungen auf unser gesamtes Sortiment für dich und deine Familie.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
  },
  {
    title: 'Faire Bezahlung',
    description: 'Leistungsgerechte Vergütung mit zusätzlichen Sonderzahlungen und Benefits.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Über 40 Jahre Erfahrung',
    description: 'Profitiere von der Expertise eines seit über 40 Jahren erfolgreichen Fachhandels.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
];

export default function KarrierePage({ page }: KarrierePageProps) {
  const { galleryImages, heroImage, cleanContent } = useMemo(() => {
    const content = page.content.rendered;

    // Extract gallery images from data-thumbnail attributes
    const thumbnailMatches = content.match(/data-thumbnail="([^"]+)"/g) || [];
    const imgs = thumbnailMatches.map(m => {
      const srcMatch = m.match(/data-thumbnail="([^"]+)"/);
      return srcMatch ? srcMatch[1] : null;
    }).filter((img): img is string => img !== null);

    // Extract the first regular image as hero image
    const heroMatch = content.match(/<img[^>]+src="([^"]+)"[^>]*>/);
    const hero = heroMatch ? heroMatch[1] : null;

    // Clean content: remove gallery and images, keep only text
    let clean = content;
    clean = clean.replace(/<div[^>]*class="[^"]*elementor-gallery[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '');
    clean = clean.replace(/<div[^>]*class="[^"]*gallery[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '');
    clean = clean.replace(/<figure[^>]*>[\s\S]*?<\/figure>/gi, '');
    clean = clean.replace(/<picture[^>]*>[\s\S]*?<\/picture>/gi, '');
    clean = clean.replace(/<img[^>]*>/gi, '');
    clean = clean.replace(/<div[^>]*>\s*<\/div>/gi, '');
    clean = clean.replace(/<p>\s*<\/p>/gi, '');

    return { galleryImages: imgs, heroImage: hero, cleanContent: clean };
  }, [page.content.rendered]);

  const [lightboxImage, setLightboxImage] = useState<number | null>(null);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (lightboxImage !== null) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = 'unset'; };
    }
  }, [lightboxImage]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative w-full" style={{ background: 'var(--gradient-dark)' }}>
        {/* Background: image or gradient */}
        {heroImage ? (
          <div className="content-container py-12 md:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Text left */}
              <div>
                <p className="text-brand font-bold text-sm uppercase tracking-wider mb-3">
                  Karriere bei Bodenjäger
                </p>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                  Werde Teil unseres Teams
                </h1>
                <p className="text-lg md:text-xl text-gray-300">
                  Seit über 40 Jahren sind wir der Fachhandel für Bodenbeläge in Hückelhoven.
                  Wir suchen engagierte Menschen, die mit uns gemeinsam wachsen wollen.
                </p>
                <a
                  href="#stellen"
                  className="mt-6 inline-flex items-center gap-2 px-8 py-3.5 bg-brand text-white font-bold rounded-lg hover:bg-[#d11820] transition-colors shadow-sm hover:shadow-md"
                >
                  Offene Stellen ansehen
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </a>
              </div>

              {/* Image right */}
              <div className="relative h-[300px] md:h-[400px] rounded-xl overflow-hidden">
                <Image
                  src={heroImage}
                  alt="Karriere bei Bodenjäger"
                  fill
                  priority
                  className="object-cover" style={{ objectPosition: '50% 25%' }}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        ) : (
          <div
            className="py-16 md:py-24"
            style={{ background: 'var(--gradient-dark)' }}
          >
            <div className="content-container">
              <div className="text-center max-w-3xl mx-auto">
                <p className="text-brand font-bold text-sm uppercase tracking-wider mb-3">
                  Karriere bei Bodenjäger
                </p>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                  Werde Teil unseres Teams
                </h1>
                <p className="text-lg md:text-xl text-gray-300">
                  Seit über 40 Jahren sind wir der Fachhandel für Bodenbeläge in Hückelhoven.
                  Wir suchen engagierte Menschen, die mit uns gemeinsam wachsen wollen.
                </p>
                <a
                  href="#stellen"
                  className="mt-8 inline-flex items-center gap-2 px-8 py-3.5 bg-brand text-white font-bold rounded-lg hover:bg-[#d11820] transition-colors shadow-sm hover:shadow-md"
                >
                  Offene Stellen ansehen
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* WordPress Content as Intro */}
      {cleanContent && cleanContent.replace(/<[^>]*>/g, '').trim().length > 0 && (
        <section className="py-12 md:py-16 bg-pale">
          <div className="content-container">
            <div
              suppressHydrationWarning
              className="prose prose-lg max-w-3xl mx-auto text-center
                [&_h1]:text-4xl [&_h1]:md:text-5xl [&_h1]:font-bold [&_h1]:text-dark [&_h1]:mb-8 [&_h1]:mt-10
                [&_h2]:text-3xl [&_h2]:md:text-4xl [&_h2]:font-bold [&_h2]:text-dark [&_h2]:mb-6 [&_h2]:mt-16
                [&_h3]:text-2xl [&_h3]:md:text-3xl [&_h3]:font-bold [&_h3]:text-dark [&_h3]:mb-5 [&_h3]:mt-14
                [&_p]:text-gray-600 [&_p]:mb-4 [&_p]:leading-relaxed
                [&_a]:text-brand [&_a]:hover:underline
                [&_ul]:text-gray-600 [&_ul]:text-left [&_ul]:inline-block
                [&_li]:mb-1.5
                [&_strong]:text-dark"
              dangerouslySetInnerHTML={{ __html: cleanContent }}
            />
          </div>
        </section>
      )}

      {/* Benefits Section */}
      <section className="py-16 md:py-20">
        <div className="content-container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-dark mb-3">
              Warum Bodenjäger?
            </h2>
            <p className="text-gray-500 text-lg">
              Das erwartet dich bei uns – mehr als nur ein Job.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="group p-6 rounded-xl border border-gray-100 hover:border-brand/20 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 mb-4 bg-brand/10 rounded-lg flex items-center justify-center text-brand group-hover:bg-brand group-hover:text-white transition-colors duration-300">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-bold text-dark mb-2">{benefit.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section id="stellen" className="py-16 md:py-20 bg-pale">
        <div className="content-container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-dark mb-3">
              Offene Stellen
            </h2>
            <p className="text-gray-500 text-lg">
              Finde die passende Position und bewirb dich direkt bei uns.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div id="join-widget" />
            <Script
              src="https://join.com/api/widget/bundle/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXR0aW5ncyI6eyJzaG93Q2F0ZWdvcnlGaWx0ZXIiOnRydWUsInNob3dMb2NhdGlvbkZpbHRlciI6dHJ1ZSwic2hvd0VtcGxveW1lbnRUeXBlRmlsdGVyIjp0cnVlLCJsYW5ndWFnZSI6ImRlIiwiam9ic1BlclBhZ2UiOjI1fSwiam9icyI6e30sImRlc2lnbiI6eyJzaG93TG9nbyI6dHJ1ZSwic2hvd0xvY2F0aW9uIjp0cnVlLCJzaG93RW1wbG95bWVudFR5cGUiOnRydWUsInNob3dDYXRlZ29yeSI6dHJ1ZSwiY29sb3JzIjp7IndpZGdldCI6eyJiYWNrZ3JvdW5kIjoiI0ZGRkZGRiIsImZpbHRlckJvcmRlciI6IiNENEQ0RDgiLCJwYWdpbmF0aW9uIjoiIzI1NjNFQiJ9LCJqb2JDYXJkIjp7InNoYWRvdyI6IiNENEQ0RDgiLCJiYWNrZ3JvdW5kIjoiI0ZGRkZGRiIsInByaW1hcnlUZXh0IjoiIzNGM0Y0NiIsInNlY29uZGFyeVRleHQiOiIjNTI1MjVCIn19fSwidmVyc2lvbiI6MiwiY29tcGFueVB1YmxpY0lkIjoiYTBkZDM0NDU5ODFkODU5N2VmYmRmN2VmNTBlZjM1ZDgiLCJpYXQiOjE3Nzc1NDMwNzYsImp0aSI6ImE4ODE1YTY1LWRmZmMtNDJjZi05OTc1LTkzZmNhMDdhNGJjMCJ9.t3QTLpHIUGdnLsuqFmCwyX1d-6gTBiiU-gyJTjsoXUY"
              strategy="afterInteractive"
              data-mount-in="#join-widget"
            />
          </div>
        </div>
      </section>

      {/* Team Gallery */}
      {galleryImages.length > 0 && (
        <section className="py-16 md:py-20">
          <div className="content-container">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-dark mb-3">
                Unser Team
              </h2>
              <p className="text-gray-500 text-lg">
                Lerne die Menschen kennen, mit denen du zusammenarbeiten wirst.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {galleryImages.map((img, index) => {
                const heightClass = index % 3 === 0 ? 'h-64' : index % 3 === 1 ? 'h-80' : 'h-72';
                return (
                  <div
                    key={index}
                    className={`relative group cursor-pointer overflow-hidden rounded-xl ${heightClass}`}
                    onClick={() => setLightboxImage(index)}
                  >
                    <Image
                      src={img}
                      alt={`Team Bild ${index + 1}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section
        className="py-16 md:py-20"
        style={{ background: 'var(--gradient-dark)' }}
      >
        <div className="content-container">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Bereit für den nächsten Schritt?
            </h2>
            <p className="text-gray-300 text-lg mb-8">
              Sende uns deine Bewerbung per E-Mail oder ruf uns an – wir freuen uns, dich kennenzulernen!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="mailto:info@bodenjaeger.de?subject=Bewerbung"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand text-white font-bold rounded-lg hover:bg-[#d11820] transition-colors shadow-sm hover:shadow-md"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Bewerbung senden
              </a>
              <a
                href="tel:+492433938884"
                className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-dark transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                02433 938884
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxImage !== null && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            onClick={() => setLightboxImage(null)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="relative max-w-7xl max-h-[90vh] w-full h-full">
            <Image
              src={galleryImages[lightboxImage]}
              alt={`Team Bild ${lightboxImage + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>

          {/* Navigation */}
          {galleryImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxImage(prev => prev === null ? null : prev === 0 ? galleryImages.length - 1 : prev - 1);
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxImage(prev => prev === null ? null : prev === galleryImages.length - 1 ? 0 : prev + 1);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/10 rounded-full text-white text-sm">
                {lightboxImage + 1} / {galleryImages.length}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
