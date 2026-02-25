'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import { WordPressPage } from '@/lib/wordpress';

interface FachmarktPageProps {
  page: WordPressPage;
}

// Service Cards Data - DIREKT AUS ELEMENTOR EXTRAHIERT
// Reihenfolge basiert auf der Elementor-Struktur
const serviceCards = [
  {
    title: 'Verlegeservice',
    link: '/fachmarkt-hueckelhoven/verlegeservice',
    image: null, // Kein Background-Image in Elementor
  },
  {
    title: 'Anhängerverleih',
    link: '/fachmarkt-hueckelhoven/anhaengerverleih',
    image: null, // Kein Background-Image in Elementor
  },
  {
    title: 'Warenlagerung',
    link: '/fachmarkt-hueckelhoven/warenlagerung',
    image: null, // Kein Background-Image in Elementor
  },
  {
    title: 'Fachberatung',
    link: '/fachmarkt-hueckelhoven/fachberatung',
    image: null, // Kein Background-Image in Elementor
  },
  {
    title: 'Set-Angebote',
    link: '/fachmarkt-hueckelhoven/set-angebote',
    image: 'https://plan-dein-ding.de/wp-content/uploads/2024/08/IMG_1392-scaled-e1724846184644-853x1024.jpg',
  },
  {
    title: 'Werkzeugverleih',
    link: '/fachmarkt-hueckelhoven/werkzeugverleih',
    image: null, // Kein Background-Image in Elementor
  },
  {
    title: 'Lieferservice',
    link: '/fachmarkt-hueckelhoven/lieferservice',
    image: 'https://plan-dein-ding.de/wp-content/uploads/2024/08/Bus-scaled-1-1024x768.jpg',
  },
  {
    title: 'Schausonntag',
    link: '/fachmarkt-hueckelhoven/schausonntag',
    image: null, // Kein Background-Image in Elementor
  },
];

export default function FachmarktPage({ page }: FachmarktPageProps) {
  const { heroImage, categories } = useMemo(() => {
    const content = page.content.rendered;

    // Extract first image as hero
    const imgMatch = content.match(/<img[^>]+src="([^"]+)"[^>]*>/);
    const hero = imgMatch ? imgMatch[1] : null;

    // Remove first image
    let processedContent = (hero && imgMatch) ? content.replace(imgMatch[0], '') : content;

    // Define the exact categories we want to show (first 8 items only)
    const allowedCategories = [
      'Rigid-Vinyl',
      'Parkett',
      'Laminat',
      'Fußmatten',
      'Klebe-Vinyl',
      'Zubehör',
      'CV-Boden'
    ];

    // Extract only allowed categories
    const cats = allowedCategories.filter(cat =>
      processedContent.includes(`✓ ${cat}`) || processedContent.includes(`✓${cat}`)
    );

    // Remove category lines from content
    cats.forEach(cat => {
      processedContent = processedContent.replace(`✓ ${cat}<br />`, '');
      processedContent = processedContent.replace(`✓\t\t\t${cat}<br />`, '');
      processedContent = processedContent.replace(`\t\t\t✓ ${cat}<br />`, '');
    });

    // Remove entire "Alle Vorteile" section
    const vorteileSectionRegex = /<p>\s*Alle Vorteile auf einem Blick:<\/p>\s*<p>✓[^<]*(?:<br \/>✓[^<]*)*<\/p>/i;
    processedContent = processedContent.replace(vorteileSectionRegex, '');

    // Fallback: remove individual unwanted items
    const unwantedItems = [
      'Fachkompetenz und Erfahrung',
      'Professionelles Equipment',
      'Zeitersparnis',
      'Garantie und Gewährleistung',
      'Individuelle Beratung',
      'Fehlervermeidung',
      'Altboden Entsorgung',
      'Langfristige Haltbarkeit'
    ];

    unwantedItems.forEach(item => {
      processedContent = processedContent.replace(`✓ ${item}<br />`, '');
      processedContent = processedContent.replace(`✓${item}<br />`, '');
    });

    return { heroImage: hero, categories: cats };
  }, [page.content.rendered]);

  return (
    <div className="min-h-screen bg-white">
      {/* Full Width Hero Image */}
      {heroImage && (
        <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px]">
          <Image
            src={heroImage}
            alt={page.title.rendered}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>
      )}

      {/* Categories Grid */}
      {categories.length > 0 && (
        <div className="content-container py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <div key={index} className="flex items-center gap-3">
                <Image
                  src="/images/Icons/Haken schieferschwarz.png"
                  alt="checkmark"
                  width={24}
                  height={24}
                  className="flex-shrink-0"
                />
                <h3 className="text-lg font-semibold">{category}</h3>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filialvorteile Section */}
      <div className="content-container py-12">
        <h2 className="text-4xl font-bold text-black mb-12 text-center">
          Unsere Filialvorteile auf einem Blick
        </h2>

        {/* Service Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {serviceCards.map((service, index) => (
            <a
              key={index}
              href={service.link}
              className="group block bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              {/* Image */}
              <div className="relative h-48 w-full bg-gray-200">
                {service.image ? (
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <span className="text-4xl">📦</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-black mb-4">
                  {service.title}
                </h3>
                <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-800 transition-colors">
                  Mehr erfahren
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">
                    &gt;
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Section 4: Persönliche Fachberatung + Deko-Bilder */}
      <div className="content-container py-12">
        <h2 className="text-3xl font-bold text-black mb-8 text-center">
          Persönliche Fachberatung - Hoher Lagerbestand - Faire Preise
        </h2>

        {/* Deko-Bilder Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="relative h-48 md:h-64">
            <Image
              src="https://plan-dein-ding.de/wp-content/uploads/2024/08/DSCF2023-scaled-1-1024x683.jpg"
              alt="Fachmarkt"
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
          <div className="relative h-48 md:h-64">
            <Image
              src="https://plan-dein-ding.de/wp-content/uploads/2024/08/DSCF1968-scaled-1-1024x683.jpg"
              alt="Fachmarkt"
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
          <div className="relative h-48 md:h-64">
            <Image
              src="https://plan-dein-ding.de/wp-content/uploads/2024/08/DSCF2046-scaled-1-1024x683.jpg"
              alt="Fachmarkt"
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
          <div className="relative h-48 md:h-64">
            <Image
              src="https://plan-dein-ding.de/wp-content/uploads/2024/08/DSCF1962-scaled-1-1024x683.jpg"
              alt="Fachmarkt"
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
          <div className="relative h-48 md:h-64">
            <Image
              src="https://plan-dein-ding.de/wp-content/uploads/2024/08/DSCF2201-scaled-1-683x1024.jpg"
              alt="Fachmarkt"
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
          <div className="relative h-48 md:h-64">
            <Image
              src="https://plan-dein-ding.de/wp-content/uploads/2024/08/DSCF2104-scaled-1-683x1024.jpg"
              alt="Fachmarkt"
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
          {/* Bild mit Overlay-Text */}
          <div className="relative h-48 md:h-64 group cursor-pointer">
            <Image
              src="https://plan-dein-ding.de/wp-content/uploads/2024/08/DSCF2023-scaled-1-1024x683.jpg"
              alt="Aktuelle Angebote"
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center">
              <p className="text-white text-center font-semibold text-lg px-4">
                Aktuelle Filialangebote entdecken &gt;
              </p>
            </div>
          </div>
          <div className="relative h-48 md:h-64">
            <Image
              src="https://plan-dein-ding.de/wp-content/uploads/2024/08/DSCF1946-scaled-1-1024x683.jpg"
              alt="Fachmarkt"
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
        </div>
      </div>

      {/* Section 5: Rundum-Sorglos-Service + Text */}
      <div className="bg-gray-50 py-12">
        <div className="content-container">
          <h2 className="text-3xl font-bold text-black mb-8">
            Unser Rundum-Sorglos-Service - Professioneller Verlegeservice
          </h2>

          <div className="prose prose-lg max-w-none">
            <h3 className="text-2xl font-bold text-black mb-4">
              Fachmarkt für Bodenbeläge in Hückelhoven – Seit über 40 Jahren!
            </h3>
            <p className="text-gray-700 mb-4">
              Was uns von anderen unterscheidet? Bei uns bekommst du nicht nur einen Bodenbelag, sondern ein Rundum-Sorglos-Paket. Du wählst deinen Wunschboden, und wir liefern dir die passenden Sockelleisten sowie, falls nötig, eine Trittschalldämmung – und das alles kostenlos! Unser Konzept hat sich in den letzten Jahren erfolgreich durchgesetzt, weil wir dir die beste Qualität und den besten Service bieten und das alles zu extrem fairen Preisen.
            </p>
            <p className="text-gray-700 mb-4">
              Unsere Wurzeln liegen in der Dienstleistung. Das bedeutet, dass wir nicht nur verkaufen, sondern selbst genau wissen, worauf es ankommt. Wir führen nur Produkte, von denen wir zu 100 % überzeugt sind und die wir selbst verwenden würden. So kannst du sicher sein, dass du bei uns stets die besten Lösungen für dein Zuhause oder dein Projekt findest.
            </p>
            <p className="text-gray-700 mb-4">
              Vertraue auf über vier Jahrzehnte Erfahrung und Kompetenz – Bodenjäger.de ist dein zuverlässiger Partner für Bodenbeläge!
            </p>
          </div>
        </div>
      </div>

      {/* Section 6: Überblick Grafik */}
      <div className="content-container py-12">
        <h3 className="text-2xl font-bold text-black mb-6 text-center">
          Überblick unserer Filiale in Hückelhoven
        </h3>
        <div className="relative w-full h-[300px] md:h-[400px]">
          <Image
            src="https://plan-dein-ding.de/wp-content/uploads/2024/08/Ueberblick-Filiale-Hueckelhoven1-1024x456.png"
            alt="Überblick Filiale Hückelhoven"
            fill
            className="object-contain"
            sizes="100vw"
          />
        </div>
      </div>

      {/* Section 7: Contact Section */}
      <div className="bg-white py-12">
        <div className="content-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Öffnungszeiten */}
            <div>
              <h3 className="text-2xl font-bold text-black mb-4">Öffnungszeiten</h3>
              <div className="space-y-2 text-gray-700 mb-6">
                <p>Mo. bis Fr. &nbsp;&nbsp;&nbsp;9:00 – 18:30 Uhr</p>
                <p>Sa. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;9:00 – 14:00 Uhr</p>
                <p>So. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;12:00 – 16:00 Uhr</p>
                <p className="font-bold">NICHT JEDEN SONNTAG</p>
              </div>
              <a
                href="/schausonntag"
                className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Geöffnete Sonntage &gt;
              </a>
            </div>

            {/* Adresse/Kontakt */}
            <div>
              <h3 className="text-2xl font-bold text-black mb-4">Fachmarkt Hückelhoven</h3>
              <div className="space-y-2 text-gray-700 mb-6">
                <p>Neckarstraße 9</p>
                <p>41836 Hückelhoven</p>
                <p>Tel.: 02433938884</p>
                <p>info@bodenjaeger.de</p>
              </div>
              <a
                href="/kontakt"
                className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Kontaktaufnahme &gt;
              </a>
            </div>

            {/* Google Maps */}
            <div>
              <iframe
                src="https://maps.google.com/maps?q=bodenjäger&t=m&z=10&output=embed&iwloc=near"
                title="Bodenjäger Hückelhoven"
                aria-label="Bodenjäger Hückelhoven"
                className="w-full h-full min-h-[300px] rounded-lg"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
