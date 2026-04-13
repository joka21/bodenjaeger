import { WordPressPage } from '@/lib/wordpress';

interface WordPressPageProps {
  page: WordPressPage;
}

export default function WordPressPageComponent({ page }: WordPressPageProps) {
  return (
    <div className="min-h-screen bg-white">
      <div className="content-container py-12 max-w-4xl">
        <h1
          className="text-4xl md:text-5xl font-bold mb-8 text-gray-900"
          dangerouslySetInnerHTML={{ __html: page.title.rendered }}
        />
        <div
          className="prose prose-lg max-w-none
            prose-headings:text-gray-900
            prose-h1:text-4xl prose-h1:font-bold prose-h1:mb-6 prose-h1:mt-8
            prose-h2:text-3xl prose-h2:font-bold prose-h2:mb-4 prose-h2:mt-8
            prose-h3:text-2xl prose-h3:font-semibold prose-h3:mb-3 prose-h3:mt-6
            prose-h4:text-xl prose-h4:font-semibold prose-h4:mb-2 prose-h4:mt-4
            prose-p:text-gray-700 prose-p:mb-4 prose-p:leading-relaxed
            prose-a:text-brand prose-a:no-underline prose-a:hover:underline prose-a:hover:text-[#d11820]
            prose-strong:text-gray-900 prose-strong:font-semibold
            prose-ul:text-gray-700 prose-ul:mb-4
            prose-ol:text-gray-700 prose-ol:mb-4
            prose-li:mb-2
            prose-table:text-gray-700
            prose-blockquote:text-gray-700 prose-blockquote:border-brand"
          dangerouslySetInnerHTML={{ __html: page.content.rendered }}
        />
      </div>
    </div>
  );
}
