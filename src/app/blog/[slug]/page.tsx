import { wordPressClient } from '@/lib/wordpress';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const revalidate = 300; // 5 minutes

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await wordPressClient.getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const featuredImage = post._embedded?.['wp:featuredmedia']?.[0];
  const author = post._embedded?.author?.[0];
  const postDate = new Date(post.date).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-white">
      <article className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Back to Blog Link */}
        <Link
          href="/blog"
          className="inline-flex items-center text-[#5095cb] hover:text-[#1e40af] mb-8 font-semibold"
        >
          <span className="mr-2">←</span>
          Zurück zum Blog
        </Link>

        {/* Featured Image */}
        {featuredImage && (
          <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden">
            <Image
              src={featuredImage.source_url}
              alt={featuredImage.alt_text || post.title.rendered}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Post Title */}
        <h1
          className="text-4xl md:text-5xl font-bold text-[#2e2d32] mb-6"
          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
        />

        {/* Post Meta */}
        <div className="flex items-center gap-6 text-[#666666] mb-8 pb-8 border-b border-gray-200">
          <time dateTime={post.date} className="text-sm">
            {postDate}
          </time>
          {author && (
            <div className="flex items-center gap-2">
              <span className="text-sm">von</span>
              <span className="text-sm font-semibold text-[#2e2d32]">{author.name}</span>
            </div>
          )}
        </div>

        {/* Post Content */}
        <div
          className="prose prose-lg max-w-none
            prose-headings:text-[#2e2d32]
            prose-h2:text-3xl prose-h2:font-bold prose-h2:mt-12 prose-h2:mb-6
            prose-h3:text-2xl prose-h3:font-bold prose-h3:mt-8 prose-h3:mb-4
            prose-p:text-[#333333] prose-p:leading-relaxed prose-p:mb-6
            prose-a:text-[#5095cb] prose-a:hover:text-[#1e40af] prose-a:no-underline prose-a:hover:underline
            prose-strong:text-[#2e2d32] prose-strong:font-bold
            prose-ul:text-[#333333] prose-ul:my-6
            prose-ol:text-[#333333] prose-ol:my-6
            prose-li:mb-2
            prose-blockquote:border-l-4 prose-blockquote:border-[#5095cb] prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-[#666666]
            prose-img:rounded-lg prose-img:shadow-lg prose-img:my-8"
          dangerouslySetInnerHTML={{ __html: post.content.rendered }}
        />

        {/* Author Info */}
        {author && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-start gap-4">
              {author.avatar_urls?.['96'] && (
                <Image
                  src={author.avatar_urls['96']}
                  alt={author.name}
                  width={64}
                  height={64}
                  className="rounded-full"
                />
              )}
              <div>
                <h3 className="text-xl font-bold text-[#2e2d32] mb-2">
                  Über {author.name}
                </h3>
                {author.description && (
                  <p className="text-[#666666]">{author.description}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Back to Blog */}
        <div className="mt-12 text-center">
          <Link
            href="/blog"
            className="inline-block bg-[#5095cb] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#1e40af] transition-colors"
          >
            Weitere Beiträge lesen
          </Link>
        </div>
      </article>
    </div>
  );
}
