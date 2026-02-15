'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { WordPressPage } from '@/lib/wordpress';

interface KarrierePageProps {
  page: WordPressPage;
}

export default function KarrierePage({ page }: KarrierePageProps) {
  const { galleryImages, cleanContent } = useMemo(() => {
    const content = page.content.rendered;

    // Extract gallery images from data-thumbnail attributes (Elementor Gallery)
    const thumbnailMatches = content.match(/data-thumbnail="([^"]+)"/g) || [];
    const imgs = thumbnailMatches.map(m => {
      const srcMatch = m.match(/data-thumbnail="([^"]+)"/);
      return srcMatch ? srcMatch[1] : null;
    }).filter((img): img is string => img !== null);

    // Remove entire gallery section from content
    let clean = content.replace(/<div class="elementor-gallery__container">[\s\S]*?<\/div>\s*<\/div>/g, '');

    // Also remove gallery widget wrapper
    clean = clean.replace(/<div class="elementor-element.*?elementor-widget-gallery.*?">[\s\S]*?<div class="elementor-widget-container">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g, '');

    return { galleryImages: imgs, cleanContent: clean };
  }, [page.content.rendered]);

  const [lightboxImage, setLightboxImage] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white">
      {/* Content with integrated gallery */}
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

        {/* Masonry Gallery - Elementor Style */}
        {galleryImages.length > 0 && (
          <div className="mb-12">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
              {galleryImages.map((img, index) => {
                // Deterministic height pattern for masonry effect
                const heightClass = index % 3 === 0 ? 'h-64' : index % 3 === 1 ? 'h-80' : 'h-72';

                return (
                  <div
                    key={index}
                    className={`relative group cursor-pointer overflow-hidden rounded-sm ${heightClass}`}
                    onClick={() => setLightboxImage(index)}
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={img}
                        alt={`Team Bild ${index + 1}`}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                      />
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition-opacity duration-300" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxImage !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white text-4xl font-light hover:text-gray-300 transition-colors"
            onClick={() => setLightboxImage(null)}
          >
            ×
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
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxImage(prev => prev === null ? null : Math.max(0, prev - 1));
              }}
              disabled={lightboxImage === 0}
              className="px-6 py-2 bg-white text-black rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ←
            </button>
            <span className="px-6 py-2 bg-white text-black rounded">
              {lightboxImage + 1} / {galleryImages.length}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxImage(prev => prev === null ? null : Math.min(galleryImages.length - 1, prev + 1));
              }}
              disabled={lightboxImage === galleryImages.length - 1}
              className="px-6 py-2 bg-white text-black rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
