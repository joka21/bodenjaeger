'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import { WordPressPage } from '@/lib/wordpress';

interface KarrierePageProps {
  page: WordPressPage;
}

export default function KarrierePage({ page }: KarrierePageProps) {
  const { images, cleanContent } = useMemo(() => {
    const content = page.content.rendered;

    // Extract all images
    const imgMatches = content.match(/<img[^>]+src="([^"]+)"[^>]*>/g) || [];
    const imgs = imgMatches.map(m => {
      const srcMatch = m.match(/src="([^"]+)"/);
      return srcMatch ? srcMatch[1] : null;
    }).filter((img): img is string => img !== null);

    // Remove all images from content
    let clean = content;
    imgMatches.forEach(img => {
      clean = clean.replace(img, '');
    });

    return { images: imgs, cleanContent: clean };
  }, [page.content.rendered]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Image */}
      {images[0] && (
        <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px]">
          <Image
            src={images[0]}
            alt="Karriere"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>
      )}

      {/* Content */}
      <div className="content-container py-12">
        <div
          className="prose prose-lg max-w-none mb-12
            prose-h1:text-4xl prose-h1:font-bold prose-h1:mb-6
            prose-h2:text-3xl prose-h2:font-bold prose-h2:mb-4 prose-h2:mt-8
            prose-h3:text-2xl prose-h3:font-bold prose-h3:mb-3 prose-h3:mt-6
            prose-p:text-gray-700 prose-p:mb-4
            prose-a:text-blue-600 prose-a:hover:text-blue-800
            prose-ul:text-gray-700
            prose-li:mb-2"
          dangerouslySetInnerHTML={{ __html: cleanContent }}
        />

        {/* Image Gallery - remaining images */}
        {images.length > 1 && (
          <div className="mt-12">
            <h2 className="text-3xl font-bold text-black mb-8">Eindrücke aus unserem Team</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.slice(1).map((img, index) => (
                <div key={index} className="relative h-64 rounded-lg overflow-hidden">
                  <Image
                    src={img}
                    alt={`Team ${index + 1}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
