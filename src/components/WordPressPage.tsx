import { WordPressPage } from '@/lib/wordpress';

interface WordPressPageProps {
  page: WordPressPage;
}

export default function WordPressPageComponent({ page }: WordPressPageProps) {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <div className="content-container py-12">
        {/* Page Title */}
        <h1
          className="text-4xl md:text-5xl font-bold text-[#2e2d32] mb-8"
          dangerouslySetInnerHTML={{ __html: page.title.rendered }}
        />

        {/* Page Content */}
        <div
          className="prose prose-lg max-w-none
            prose-headings:text-[#2e2d32]
            prose-p:text-[#333333]
            prose-a:text-[#5095cb] prose-a:hover:text-[#1e40af]
            prose-strong:text-[#2e2d32]
            prose-ul:text-[#333333]
            prose-ol:text-[#333333]"
          dangerouslySetInnerHTML={{ __html: page.content.rendered }}
        />
      </div>
    </div>
  );
}
