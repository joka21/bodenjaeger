'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import { WordPressPage } from '@/lib/wordpress';

interface ServicePageProps {
  page: WordPressPage;
}

export default function ServicePage({ page }: ServicePageProps) {
  const { heroImage, cleanContent } = useMemo(() => {
    const content = page.content.rendered;

    // Extract hero image
    const imgMatch = content.match(/<img[^>]+src="([^"]+)"[^>]*>/);
    const hero = imgMatch ? imgMatch[1] : null;

    // Remove hero image from content
    const clean = (hero && imgMatch) ? content.replace(imgMatch[0], '') : content;

    return { heroImage: hero, cleanContent: clean };
  }, [page.content.rendered]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Image */}
      {heroImage && (
        <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px]">
          <Image
            src={heroImage}
            alt="Service"
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
          className="prose prose-lg max-w-none
            prose-h1:text-4xl prose-h1:font-bold prose-h1:mb-6
            prose-h2:text-3xl prose-h2:font-bold prose-h2:mb-4 prose-h2:mt-8
            prose-h3:text-2xl prose-h3:font-bold prose-h3:mb-3 prose-h3:mt-6
            prose-p:text-gray-700 prose-p:mb-4
            prose-a:text-blue-600 prose-a:hover:text-blue-800"
          dangerouslySetInnerHTML={{ __html: cleanContent }}
        />
      </div>
    </div>
  );
}
