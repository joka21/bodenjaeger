'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { WordPressPage } from '@/lib/wordpress';

interface ServicePageProps {
  page: WordPressPage;
}

const services = [
  {
    title: 'Verlegeservice',
    description: 'Professionelle Verlegung durch unser erfahrenes Team – sauber, schnell und fachgerecht.',
    href: '/fachmarkt-hueckelhoven/verlegeservice',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    title: 'Fachberatung',
    description: 'Individuelle Beratung im Fachmarkt oder telefonisch – wir finden den richtigen Boden für Sie.',
    href: '/fachmarkt-hueckelhoven/fachberatung',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: 'Lieferservice',
    description: 'Bequeme Lieferung direkt zu Ihnen nach Hause – termingerecht und zuverlässig.',
    href: '/fachmarkt-hueckelhoven/lieferservice',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 17h8M8 17l-4-4m4 4V3m8 14l4-4m-4 4V3M3 13h18" />
      </svg>
    ),
  },
  {
    title: 'Set-Angebote',
    description: 'Boden, Dämmung und Sockelleiste als günstiges Komplett-Paket – alles aufeinander abgestimmt.',
    href: '/fachmarkt-hueckelhoven/set-angebote',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
  },
  {
    title: 'Anhängerverleih',
    description: 'Kostenloser Anhängerverleih für den Transport Ihrer Bodenbeläge.',
    href: '/fachmarkt-hueckelhoven/anhaengerverleih',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
      </svg>
    ),
  },
  {
    title: 'Werkzeugverleih',
    description: 'Professionelles Verlegewerkzeug zum Ausleihen – damit Ihr Projekt gelingt.',
    href: '/fachmarkt-hueckelhoven/werkzeugverleih',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: 'Warenlagerung',
    description: 'Wir lagern Ihre bestellten Böden kostenlos, bis Sie bereit sind – flexibel und stressfrei.',
    href: '/fachmarkt-hueckelhoven/warenlagerung',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    title: 'Schausonntag',
    description: 'Jeden ersten Sonntag im Monat: Schauen, anfassen, beraten lassen – ohne Verkauf.',
    href: '/fachmarkt-hueckelhoven/schausonntag',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
];

export default function ServicePage({ page }: ServicePageProps) {
  const { heroImage, cleanContent } = useMemo(() => {
    const content = page.content.rendered;

    // Extract hero image
    const imgMatch = content.match(/<img[^>]+src="([^"]+)"[^>]*>/);
    const hero = imgMatch ? imgMatch[1] : null;

    // Remove images from content
    let clean = content;
    clean = clean.replace(/<figure[^>]*>[\s\S]*?<\/figure>/gi, '');
    clean = clean.replace(/<img[^>]*>/gi, '');
    clean = clean.replace(/<div[^>]*>\s*<\/div>/gi, '');
    clean = clean.replace(/<p>\s*<\/p>/gi, '');

    return { heroImage: hero, cleanContent: clean };
  }, [page.content.rendered]);

  const hasContent = cleanContent.replace(/<[^>]*>/g, '').trim().length > 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative w-full" style={{ background: 'var(--gradient-dark)' }}>
        {heroImage ? (
          <div className="content-container py-12 md:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div>
                <p className="text-brand font-bold text-sm uppercase tracking-wider mb-3">
                  Service
                </p>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                  Unser Servicebereich
                </h1>
                <p className="text-lg md:text-xl text-gray-300">
                  Mehr als nur Bodenbeläge – wir begleiten Sie von der Beratung bis zur fertigen Verlegung mit umfassenden Serviceleistungen.
                </p>
              </div>
              <div className="relative h-[300px] md:h-[400px] rounded-xl overflow-hidden">
                <Image
                  src={heroImage}
                  alt="Service bei Bodenjäger"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="content-container py-16 md:py-24">
            <div className="text-center max-w-3xl mx-auto">
              <p className="text-brand font-bold text-sm uppercase tracking-wider mb-3">
                Service
              </p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                Unser Servicebereich
              </h1>
              <p className="text-lg md:text-xl text-gray-300">
                Mehr als nur Bodenbeläge – wir begleiten Sie von der Beratung bis zur fertigen Verlegung mit umfassenden Serviceleistungen.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Service Cards Grid */}
      <section className="py-16 md:py-20">
        <div className="content-container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-dark mb-3">
              Unsere Leistungen
            </h2>
            <p className="text-gray-500 text-lg">
              Alles aus einer Hand – von der Beratung über die Lieferung bis zur Verlegung.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {services.map((service) => (
              <Link
                key={service.title}
                href={service.href}
                className="group p-6 rounded-xl border border-gray-100 hover:border-brand/20 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 mb-4 bg-brand/10 rounded-lg flex items-center justify-center text-brand group-hover:bg-brand group-hover:text-white transition-colors duration-300">
                  {service.icon}
                </div>
                <h3 className="text-lg font-bold text-dark mb-2 group-hover:text-brand transition-colors">
                  {service.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {service.description}
                </p>
                <span className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-brand opacity-0 group-hover:opacity-100 transition-opacity">
                  Mehr erfahren
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* WordPress Content */}
      {hasContent && (
        <section className="py-12 md:py-16 bg-pale">
          <div className="content-container">
            <div
              suppressHydrationWarning
              className="prose prose-lg max-w-3xl mx-auto
                [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:text-dark [&_h1]:mb-6
                [&_h2]:text-2xl [&_h2]:md:text-3xl [&_h2]:font-bold [&_h2]:text-dark [&_h2]:mb-4 [&_h2]:mt-10
                [&_h3]:text-xl [&_h3]:md:text-2xl [&_h3]:font-bold [&_h3]:text-dark [&_h3]:mb-3 [&_h3]:mt-8
                [&_p]:text-gray-600 [&_p]:mb-4 [&_p]:leading-relaxed
                [&_a]:text-brand [&_a]:hover:underline
                [&_ul]:text-gray-600 [&_ul]:mb-4
                [&_ol]:text-gray-600 [&_ol]:mb-4
                [&_li]:mb-2
                [&_strong]:text-dark"
              dangerouslySetInnerHTML={{ __html: cleanContent }}
            />
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-pale">
        <div className="content-container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-dark mb-3">
              Fragen zu unseren Services?
            </h2>
            <p className="text-gray-500 text-lg mb-8">
              Wir beraten Sie gerne persönlich – im Fachmarkt, telefonisch oder per E-Mail.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="tel:02433938884"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand text-white font-bold rounded-lg hover:bg-[#d11820] transition-colors shadow-sm hover:shadow-md"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                02433 938884
              </a>
              <Link
                href="/kontakt"
                className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-dark text-dark font-bold rounded-lg hover:bg-dark hover:text-white transition-colors"
              >
                Zum Kontaktformular
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
