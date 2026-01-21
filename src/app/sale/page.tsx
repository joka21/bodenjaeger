import CategoryPageClient from '@/components/category/CategoryPageClient';

/**
 * Sale-Übersichtsseite
 * Zeigt alle Produkte im Sale
 */
export default async function SalePage() {
  return (
    <CategoryPageClient
      slug="sale"
      categoryName="Sale - Reduzierte Bodenbeläge"
      categoryDescription="Entdecken Sie unsere reduzierten Bodenbeläge zu unschlagbaren Preisen. Hochwertige Qualität zum Sonderpreis - Nur solange der Vorrat reicht!"
      categoryImage={null}
    />
  );
}

export const metadata = {
  title: 'Sale - Reduzierte Bodenbeläge | Bodenjäger',
  description: 'Hochwertige Bodenbeläge zu reduzierten Preisen. Laminat, Vinyl, Parkett im Sale - Nur solange der Vorrat reicht!',
};
