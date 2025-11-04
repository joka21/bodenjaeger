import { wordPressClient } from '@/lib/wordpress';
import Image from 'next/image';
import Link from 'next/link';

export const revalidate = 300; // 5 minutes

interface BlogPageProps {
  searchParams: {
    page?: string;
  };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const currentPage = Number(searchParams.page) || 1;
  const perPage = 10;

  const { posts, total, totalPages } = await wordPressClient.getPosts(currentPage, perPage);

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Page Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-[#2e2d32] mb-12">Blog</h1>

        {/* Posts Grid */}
        {posts.length === 0 ? (
          <p className="text-[#666666] text-lg">Keine Blog-Posts gefunden.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {posts.map((post) => {
                const featuredImage = post._embedded?.['wp:featuredmedia']?.[0];
                const author = post._embedded?.author?.[0];
                const postDate = new Date(post.date).toLocaleDateString('de-DE', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                });

                return (
                  <article key={post.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    {/* Featured Image */}
                    {featuredImage && (
                      <Link href={`/blog/${post.slug}`}>
                        <div className="relative w-full h-64">
                          <Image
                            src={featuredImage.source_url}
                            alt={featuredImage.alt_text || post.title.rendered}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </Link>
                    )}

                    {/* Post Content */}
                    <div className="p-6">
                      {/* Title */}
                      <Link href={`/blog/${post.slug}`}>
                        <h2
                          className="text-2xl font-bold text-[#2e2d32] mb-3 hover:text-[#5095cb] transition-colors"
                          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                        />
                      </Link>

                      {/* Meta Info */}
                      <div className="flex items-center gap-4 text-sm text-[#666666] mb-4">
                        <time dateTime={post.date}>{postDate}</time>
                        {author && <span>von {author.name}</span>}
                      </div>

                      {/* Excerpt */}
                      <div
                        className="text-[#333333] mb-4 line-clamp-3"
                        dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                      />

                      {/* Read More Link */}
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-[#5095cb] hover:text-[#1e40af] font-semibold inline-flex items-center"
                      >
                        Weiterlesen
                        <span className="ml-2">→</span>
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                {/* Previous Button */}
                {currentPage > 1 && (
                  <Link
                    href={`/blog?page=${currentPage - 1}`}
                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                  >
                    ← Zurück
                  </Link>
                )}

                {/* Page Numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                  const isCurrentPage = pageNum === currentPage;
                  return (
                    <Link
                      key={pageNum}
                      href={`/blog?page=${pageNum}`}
                      className={`px-4 py-2 border rounded transition-colors ${
                        isCurrentPage
                          ? 'bg-[#5095cb] text-white border-[#5095cb]'
                          : 'border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {pageNum}
                    </Link>
                  );
                })}

                {/* Next Button */}
                {currentPage < totalPages && (
                  <Link
                    href={`/blog?page=${currentPage + 1}`}
                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                  >
                    Weiter →
                  </Link>
                )}
              </div>
            )}

            {/* Total Posts Info */}
            <p className="text-center text-[#666666] mt-8">
              Zeige {posts.length} von {total} Beiträgen (Seite {currentPage} von {totalPages})
            </p>
          </>
        )}
      </div>
    </div>
  );
}
