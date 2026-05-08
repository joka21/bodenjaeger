'use client';

import { useMemo, useState, useEffect } from 'react';
import Image from 'next/image';
import Script from 'next/script';
import { WordPressPage } from '@/lib/wordpress';
import BenefitsSlider from '@/components/karriere/BenefitsSlider';

interface KarrierePageProps {
  page: WordPressPage;
}

const JOIN_WIDGET_SRC =
  'https://join.com/api/widget/bundle/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXR0aW5ncyI6eyJzaG93Q2F0ZWdvcnlGaWx0ZXIiOnRydWUsInNob3dMb2NhdGlvbkZpbHRlciI6dHJ1ZSwic2hvd0VtcGxveW1lbnRUeXBlRmlsdGVyIjp0cnVlLCJsYW5ndWFnZSI6ImRlIiwiam9ic1BlclBhZ2UiOjI1fSwiam9icyI6e30sImRlc2lnbiI6eyJzaG93TG9nbyI6dHJ1ZSwic2hvd0xvY2F0aW9uIjp0cnVlLCJzaG93RW1wbG95bWVudFR5cGUiOnRydWUsInNob3dDYXRlZ29yeSI6dHJ1ZSwiY29sb3JzIjp7IndpZGdldCI6eyJiYWNrZ3JvdW5kIjoiI0ZGRkZGRiIsImZpbHRlckJvcmRlciI6IiNENEQ0RDgiLCJwYWdpbmF0aW9uIjoiIzI1NjNFQiJ9LCJqb2JDYXJkIjp7InNoYWRvdyI6IiNENEQ0RDgiLCJiYWNrZ3JvdW5kIjoiI0ZGRkZGRiIsInByaW1hcnlUZXh0IjoiIzNGM0Y0NiIsInNlY29uZGFyeVRleHQiOiIjNTI1MjVCIn19fSwidmVyc2lvbiI6MiwiY29tcGFueVB1YmxpY0lkIjoiYTBkZDM0NDU5ODFkODU5N2VmYmRmN2VmNTBlZjM1ZDgiLCJpYXQiOjE3Nzc1NDMwNzYsImp0aSI6ImE4ODE1YTY1LWRmZmMtNDJjZi05OTc1LTkzZmNhMDdhNGJjMCJ9.t3QTLpHIUGdnLsuqFmCwyX1d-6gTBiiU-gyJTjsoXUY';

export default function KarrierePage({ page }: KarrierePageProps) {
  const {
    galleryImages,
    heroTitle,
    contentBeforeBenefits,
    contentBetweenBenefitsAndWidget,
    contentAfterWidget,
  } = useMemo(() => {
    const content = page.content.rendered;

    // Extract gallery images from data-thumbnail attributes
    const thumbnailMatches = content.match(/data-thumbnail="([^"]+)"/g) || [];
    const imgs = thumbnailMatches
      .map((m) => {
        const srcMatch = m.match(/data-thumbnail="([^"]+)"/);
        return srcMatch ? srcMatch[1] : null;
      })
      .filter((img): img is string => img !== null);

    // Extract the first H2 as hero title (strip HTML tags)
    const titleMatch = content.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
    const title = titleMatch ? titleMatch[1].replace(/<[^>]*>/g, '').trim() : '';

    // Clean content for body section:
    // - erstes H2 raus (wird als Hero-Title verwendet, sonst doppelt)
    // - erstes figure/img raus (wird als Hero-Bild verwendet, sonst doppelt)
    // - alle <script>-Tags raus (Widget wird über next/script eingebunden,
    //   das <div id="join-widget"> bleibt als Mount-Punkt erhalten)
    // - Galerien (data-thumbnail) raus, weil sie unten in der Team-Gallery angezeigt werden
    let clean = content;
    clean = clean.replace(/<h2[^>]*>[\s\S]*?<\/h2>/i, '');
    // Alle Backend-Bilder raus: das Hero-Bild kommt aus public/images/jobs/,
    // das 2. Backend-Bild ist defekt (403 vom CDN).
    clean = clean.replace(/<figure[^>]*>[\s\S]*?<\/figure>/gi, '');
    clean = clean.replace(/<picture[^>]*>[\s\S]*?<\/picture>/gi, '');
    clean = clean.replace(/<img[^>]*>/gi, '');
    clean = clean.replace(/<script[\s\S]*?<\/script>/gi, '');
    // Backend-Widget-Div komplett raus — wir rendern den Mount-Punkt selbst
    // im JSX, sonst kollidieren prose-Styles mit dem Widget-Mount.
    clean = clean.replace(/<div[^>]*id=["']join-widget["'][^>]*>[\s\S]*?<\/div>/gi, '');
    clean = clean.replace(/<div[^>]*class="[^"]*elementor-gallery[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '');
    clean = clean.replace(/<div[^>]*class="[^"]*gallery[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '');
    clean = clean.replace(/<p>\s*<\/p>/gi, '');

    // Split 1: vor / inkl. H2 "Darauf kannst du dich freuen" (für Pills)
    const split1 = clean.match(
      /^([\s\S]*?<h2[^>]*>\s*Darauf kannst du dich freuen\s*<\/h2>)([\s\S]*)$/i
    );
    const before = split1 ? split1[1] : clean;
    const afterPills = split1 ? split1[2] : '';

    // Split 2: vor "Dein Weg zu uns" → dort kommt das Widget zwischen
    // "Offene Stellen"-Headline und "Dein Weg zu uns"-Block
    const split2 = afterPills.match(
      /^([\s\S]*?)(<h2[^>]*>\s*Dein Weg zu uns\s*<\/h2>[\s\S]*)$/i
    );
    const betweenBenefitsAndWidget = split2 ? split2[1] : afterPills;
    const afterWidget = split2 ? split2[2] : '';

    return {
      galleryImages: imgs,
      heroTitle: title,
      contentBeforeBenefits: before,
      contentBetweenBenefitsAndWidget: betweenBenefitsAndWidget,
      contentAfterWidget: afterWidget,
    };
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
      {/* Hero Section — Title aus Backend, Bild aus public/images/jobs/ */}
      <section className="w-full">
        <div className="content-container py-12 md:py-16">
          {heroTitle && (
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-dark text-center mb-8">
              {heroTitle}
            </h1>
          )}
          <div className="relative w-full aspect-[21/9] rounded-xl overflow-hidden">
            <Image
              src="/images/jobs/Dominik-Jaeger-geschnitten.jpg"
              alt={heroTitle || page.title.rendered}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          </div>
        </div>
      </section>

      {/* Backend-Content (Headlines, Texte) + Pills + Widget */}
      {((contentBeforeBenefits && contentBeforeBenefits.replace(/<[^>]*>/g, '').trim().length > 0) ||
        (contentBetweenBenefitsAndWidget && contentBetweenBenefitsAndWidget.replace(/<[^>]*>/g, '').trim().length > 0) ||
        (contentAfterWidget && contentAfterWidget.replace(/<[^>]*>/g, '').trim().length > 0)) && (
        <section className="py-12 md:py-16 bg-pale">
          <div className="content-container">
            {contentBeforeBenefits && (
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
                dangerouslySetInnerHTML={{ __html: contentBeforeBenefits }}
              />
            )}

            {/* Benefits-Slider mit Auto-Play */}
            <div className="my-10">
              <BenefitsSlider />
            </div>

            {contentBetweenBenefitsAndWidget && (
              <div
                suppressHydrationWarning
                className="prose prose-lg max-w-3xl mx-auto text-center
                  [&_h2]:text-3xl [&_h2]:md:text-4xl [&_h2]:font-bold [&_h2]:text-dark [&_h2]:mb-6 [&_h2]:mt-16
                  [&_h3]:text-2xl [&_h3]:md:text-3xl [&_h3]:font-bold [&_h3]:text-dark [&_h3]:mb-5 [&_h3]:mt-14
                  [&_p]:text-gray-600 [&_p]:mb-4 [&_p]:leading-relaxed
                  [&_a]:text-brand [&_a]:hover:underline
                  [&_strong]:text-dark"
                dangerouslySetInnerHTML={{ __html: contentBetweenBenefitsAndWidget }}
              />
            )}

            {/* Join.com-Widget — eigener Mount-Punkt außerhalb prose */}
            <div id="join-widget" className="max-w-4xl mx-auto my-8" />
            <Script
              src={JOIN_WIDGET_SRC}
              strategy="afterInteractive"
              data-mount-in="#join-widget"
            />

            {contentAfterWidget && (
              <div
                suppressHydrationWarning
                className="prose prose-lg max-w-3xl mx-auto text-center
                  [&_h2]:text-3xl [&_h2]:md:text-4xl [&_h2]:font-bold [&_h2]:text-dark [&_h2]:mb-6 [&_h2]:mt-16
                  [&_h3]:text-2xl [&_h3]:md:text-3xl [&_h3]:font-bold [&_h3]:text-dark [&_h3]:mb-5 [&_h3]:mt-14
                  [&_p]:text-gray-600 [&_p]:mb-4 [&_p]:leading-relaxed
                  [&_a]:text-brand [&_a]:hover:underline
                  [&_strong]:text-dark"
                dangerouslySetInnerHTML={{ __html: contentAfterWidget }}
              />
            )}
          </div>
        </section>
      )}

      {/* Team Gallery — Bilder aus dem WordPress-Backend */}
      {galleryImages.length > 0 && (
        <section className="py-16 md:py-20">
          <div className="content-container">
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
