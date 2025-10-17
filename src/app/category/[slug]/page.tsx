import CategoryPageClient from '@/components/category/CategoryPageClient';

// Category mapping for display names
const categoryNames: Record<string, string> = {
  'vinylboden': 'Vinylboden',
  'klebe-vinyl': 'Klebe-Vinyl',
  'rigid-vinyl': 'Rigid-Vinyl',
  'laminat': 'Laminat',
  'parkett': 'Parkett',
  'teppichboden': 'Teppichboden',
  'sockelleisten': 'Sockelleisten',
  'daemmung': 'Dämmung',
  'zubehoer': 'Zubehör'
};

export default async function CategoryPage({ params }: PageProps<'/category/[slug]'>) {
  const { slug } = await params;
  const categoryName = categoryNames[slug] || slug;

  return <CategoryPageClient slug={slug} categoryName={categoryName} />;
}

// Generate static params for common categories to avoid 404 on direct access
export async function generateStaticParams() {
  const categories = [
    'vinylboden',
    'klebe-vinyl',
    'rigid-vinyl',
    'laminat',
    'parkett',
    'teppichboden',
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
