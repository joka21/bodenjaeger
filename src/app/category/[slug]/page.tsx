import type { Metadata } from 'next';
import CategoryPageClient from '@/components/category/CategoryPageClient';
import { wooCommerceClient } from '@/lib/woocommerce';
import { JsonLd } from '@/components/JsonLd';
import { buildBreadcrumbSchema } from '@/lib/schema';

// Category mapping for display names (fallback)
const categoryNames: Record<string, string> = {
  'vinylboden': 'Vinylboden',
  'klebe-vinyl': 'Klebe-Vinyl',
  'rigid-vinyl': 'Rigid-Vinyl',
  'laminat': 'Laminat',
  'parkett': 'Parkett',
  'sockelleisten': 'Sockelleisten',
  'daemmung': 'Dämmung',
  'zubehoer': 'Zubehör'
};

export async function generateMetadata({ params }: PageProps<'/category/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const categoryData = await wooCommerceClient.getCategoryBySlug(slug).catch(() => null);
  const name = categoryData?.name || categoryNames[slug] || slug;

  return {
    title: `${name} – Bodenbeläge online kaufen | Bodenjäger`,
    description: `${name} in großer Auswahl bei Bodenjäger – Top-Qualität, schnelle Lieferung und persönliche Beratung.`,
    alternates: {
      canonical: `https://bodenjaeger.de/category/${slug}`,
    },
  };
}

export default async function CategoryPage({ params }: PageProps<'/category/[slug]'>) {
  const { slug } = await params;

  // Try to fetch category information from WordPress
  let categoryData = null;
  try {
    categoryData = await wooCommerceClient.getCategoryBySlug(slug);
    console.log('📁 Category data fetched:', categoryData ? `Found: ${categoryData.name}` : 'Not found');
  } catch (error) {
    console.error('Error fetching category:', error);
  }

  // Use WordPress name if available, otherwise use fallback
  const categoryName = categoryData?.name || categoryNames[slug] || slug;
  const categoryDescription = categoryData?.description || null;
  const categoryImage = categoryData?.image || null;

  const breadcrumb = buildBreadcrumbSchema([
    { name: 'Startseite', url: 'https://bodenjaeger.de' },
    { name: categoryName, url: `https://bodenjaeger.de/category/${slug}` },
  ]);

  return (
    <>
      <JsonLd data={breadcrumb} />
      <CategoryPageClient
        slug={slug}
        categoryName={categoryName}
        categoryDescription={categoryDescription}
        categoryImage={categoryImage}
      />
    </>
  );
}

// Generate static params for common categories to avoid 404 on direct access
export async function generateStaticParams() {
  const categories = [
    'vinylboden',
    'klebe-vinyl',
    'rigid-vinyl',
    'laminat',
    'parkett',
    'sockelleisten',
    'daemmung',
    'zubehoer',
    'coretec',
    'primecore'
  ];

  return categories.map((slug) => ({
    slug,
  }));
}

// Enable dynamic rendering for categories not in generateStaticParams
export const dynamicParams = true;
