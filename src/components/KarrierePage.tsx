'use client';

import { useMemo, useState, useEffect } from 'react';
import Image from 'next/image';
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

const openPositions = [
  {
    title: 'Verkäufer/in im Fachmarkt',
    type: 'Vollzeit',
    location: 'Hückelhoven',
    description: 'Du berätst unsere Kunden kompetent bei der Auswahl des perfekten Bodenbelags und begleitest sie vom Erstgespräch bis zur Kaufentscheidung.',
  },
  {
    title: 'Lagerist/in',
    type: 'Vollzeit / Teilzeit',
    location: 'Hückelhoven',
    description: 'Du kümmerst dich um Warenannahme, Lagerorganisation und die Kommissionierung von Kundenbestellungen.',
  },
  {
    title: 'Ausbildung zum/zur Kaufmann/-frau im Einzelhandel',
    type: 'Ausbildung',
    location: 'Hückelhoven',
    description: 'Starte deine Karriere im Bodenbelag-Fachhandel mit einer fundierten Ausbildung in einem zukunftssicheren Bereich.',
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
  const [expandedPosition, setExpandedPosition] = useState<number | null>(null);

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
      <section className="relative w-full" style={{ background: 'linear-gradient(135deg, #2e2d32 0%, #4c4c4c 100%)' }}>
        {/* Background: image or gradient */}
        {heroImage ? (
          <div className="content-container py-12 md:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Text left */}
              <div>
                <p className="text-[#ed1b24] font-bold text-sm uppercase tracking-wider mb-3">
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
                  className="mt-6 inline-flex items-center gap-2 px-8 py-3.5 bg-[#ed1b24] text-white font-bold rounded-lg hover:bg-[#d11820] transition-colors shadow-sm hover:shadow-md"
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
            style={{ background: 'linear-gradient(135deg, #2e2d32 0%, #4c4c4c 100%)' }}
          >
            <div className="content-container">
              <div className="text-center max-w-3xl mx-auto">
                <p className="text-[#ed1b24] font-bold text-sm uppercase tracking-wider mb-3">
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
                  className="mt-8 inline-flex items-center gap-2 px-8 py-3.5 bg-[#ed1b24] text-white font-bold rounded-lg hover:bg-[#d11820] transition-colors shadow-sm hover:shadow-md"
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
        <section className="py-12 md:py-16 bg-[#f9f9fb]">
          <div className="content-container">
            <div
              className="prose prose-lg max-w-3xl mx-auto text-center
                prose-headings:text-[#2e2d32]
                prose-h1:text-3xl prose-h1:font-bold prose-h1:mb-6
                prose-h2:text-2xl prose-h2:font-bold prose-h2:mb-4 prose-h2:mt-6
                prose-h3:text-xl prose-h3:font-bold prose-h3:mb-3 prose-h3:mt-4
                prose-p:text-gray-600 prose-p:mb-3 prose-p:leading-relaxed
                prose-a:text-[#ed1b24] prose-a:hover:underline
                prose-ul:text-gray-600 prose-ul:text-left prose-ul:inline-block
                prose-li:mb-1.5
                prose-strong:text-[#2e2d32]"
              dangerouslySetInnerHTML={{ __html: cleanContent }}
            />
          </div>
        </section>
      )}

      {/* Benefits Section */}
      <section className="py-16 md:py-20">
        <div className="content-container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[#2e2d32] mb-3">
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
                className="group p-6 rounded-xl border border-gray-100 hover:border-[#ed1b24]/20 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 mb-4 bg-[#ed1b24]/10 rounded-lg flex items-center justify-center text-[#ed1b24] group-hover:bg-[#ed1b24] group-hover:text-white transition-colors duration-300">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-bold text-[#2e2d32] mb-2">{benefit.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section id="stellen" className="py-16 md:py-20 bg-[#f9f9fb]">
        <div className="content-container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[#2e2d32] mb-3">
              Offene Stellen
            </h2>
            <p className="text-gray-500 text-lg">
              Finde die passende Position und bewirb dich direkt bei uns.
            </p>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {openPositions.map((position, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => setExpandedPosition(expandedPosition === index ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left"
                >
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-[#2e2d32]">{position.title}</h3>
                    <div className="flex flex-wrap items-center gap-3 mt-1.5">
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {position.type}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {position.location}
                      </span>
                    </div>
                  </div>
                  <svg
                    className={`w-5 h-5 text-gray-400 flex-shrink-0 ml-4 transition-transform duration-200 ${
                      expandedPosition === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {expandedPosition === index && (
                  <div className="px-6 pb-6 border-t border-gray-100 pt-4">
                    <p className="text-gray-600 mb-5">{position.description}</p>
                    <a
                      href="mailto:info@bodenjaeger.de?subject=Bewerbung: ${position.title}"
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#ed1b24] text-white font-bold rounded-lg hover:bg-[#d11820] transition-colors text-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Jetzt bewerben
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Initiativbewerbung */}
          <div className="max-w-3xl mx-auto mt-8 text-center">
            <div className="bg-white rounded-xl border border-dashed border-gray-300 p-8">
              <h3 className="text-lg font-bold text-[#2e2d32] mb-2">
                Nichts Passendes dabei?
              </h3>
              <p className="text-gray-500 mb-5">
                Wir freuen uns immer über Initiativbewerbungen. Sag uns, was dich ausmacht!
              </p>
              <a
                href="mailto:info@bodenjaeger.de?subject=Initiativbewerbung"
                className="inline-flex items-center gap-2 px-6 py-2.5 border-2 border-[#ed1b24] text-[#ed1b24] font-bold rounded-lg hover:bg-[#ed1b24] hover:text-white transition-colors text-sm"
              >
                Initiativbewerbung senden
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Team Gallery */}
      {galleryImages.length > 0 && (
        <section className="py-16 md:py-20">
          <div className="content-container">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-[#2e2d32] mb-3">
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
        style={{ background: 'linear-gradient(135deg, #2e2d32 0%, #4c4c4c 100%)' }}
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
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#ed1b24] text-white font-bold rounded-lg hover:bg-[#d11820] transition-colors shadow-sm hover:shadow-md"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Bewerbung senden
              </a>
              <a
                href="tel:02433938884"
                className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-[#2e2d32] transition-colors"
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
