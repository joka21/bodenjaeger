'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { WordPressPage } from '@/lib/wordpress';

interface FachmarktSubpageProps {
  page: WordPressPage;
}

function parseContent(html: string) {
  let content = html;

  // <pre><code> Wrapper entfernen
  content = content.replace(/<pre[^>]*class="wp-block-code"[^>]*>\s*<code>/gi, '');
  content = content.replace(/<\/code>\s*<\/pre>/gi, '');

  // Erstes Bild als Hero extrahieren
  const imgMatch = content.match(/<img[^>]+src="([^"]+)"[^>]*?\/?>/i);
  let heroSrc = '';
  let heroAlt = '';
  if (imgMatch) {
    heroSrc = imgMatch[0].match(/src="([^"]+)"/)?.[1] || '';
    heroAlt = imgMatch[0].match(/alt="([^"]+)"/)?.[1] || '';
    // Bild + umschließende <figure> entfernen
    const figureRegex = new RegExp(
      `<figure[^>]*>\\s*${imgMatch[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s\\S]*?</figure>`,
      'i'
    );
    content = figureRegex.test(content)
      ? content.replace(figureRegex, '')
      : content.replace(imgMatch[0], '');
  }

  // Ersten H1 entfernen (wird separat gerendert)
  content = content.replace(/<h1[^>]*>[\s\S]*?<\/h1>/i, '');

  // Leere Elemente entfernen
  content = content.replace(/<p>\s*<\/p>/g, '');
  content = content.replace(/<figure[^>]*>\s*<\/figure>/g, '');

  return {
    heroImage: heroSrc ? { src: heroSrc, alt: heroAlt } : null,
    content: content.trim(),
  };
}

function decodeEntities(str: string) {
  return str
    .replace(/&#038;/g, '&')
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&#8217;/g, '\u2019')
    .replace(/&#8220;/g, '\u201C')
    .replace(/&#8221;/g, '\u201D')
    .replace(/&#8243;/g, '\u2033');
}

export default function FachmarktSubpage({ page }: FachmarktSubpageProps) {
  const { heroImage, content } = useMemo(
    () => parseContent(page.content.rendered),
    [page.content.rendered]
  );

  const title = decodeEntities(page.title.rendered);

  return (
    <main className="min-h-screen bg-white">

      {/* ── Hero ── */}
      {heroImage ? (
        <section className="relative w-full h-[320px] md:h-[440px] lg:h-[520px]">
          <Image
            src={heroImage.src}
            alt={heroImage.alt || title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

          <div className="absolute inset-0 flex items-end">
            <div className="content-container w-full pb-10 md:pb-14">
              <Link
                href="/fachmarkt-hueckelhoven"
                className="inline-block text-sm text-white/80 hover:text-white mb-3 transition-colors"
              >
                ← Fachmarkt Hückelhoven
              </Link>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                {title}
              </h1>
            </div>
          </div>
        </section>
      ) : (
        <section className="bg-dark">
          <div className="content-container py-16 md:py-20">
            <Link
              href="/fachmarkt-hueckelhoven"
              className="inline-block text-sm text-white/70 hover:text-white mb-3 transition-colors"
            >
              ← Fachmarkt Hückelhoven
            </Link>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
              {title}
            </h1>
          </div>
        </section>
      )}

      {/* ── Content ── */}
      <section className="content-container py-12 md:py-16">
        <div className="max-w-3xl mx-auto">
          <div
            className="fachmarkt-content"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="border-t border-ash">
        <div className="content-container py-14 md:py-20">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-dark mb-3">
              Noch Fragen?
            </h2>
            <p className="text-mid text-lg mb-8">
              Wir beraten dich gerne — persönlich im Fachmarkt oder telefonisch.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/kontakt"
                className="inline-flex items-center justify-center bg-brand text-white px-8 py-3.5 rounded-lg font-bold hover:bg-[#d41920] transition-colors"
              >
                Kontakt aufnehmen
              </Link>
              <a
                href="tel:+4924339388840"
                className="inline-flex items-center justify-center border-2 border-dark text-dark px-8 py-3.5 rounded-lg font-bold hover:bg-dark hover:text-white transition-colors"
              >
                02433 – 938 88 4
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
