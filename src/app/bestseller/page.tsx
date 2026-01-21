import CategoryPageClient from '@/components/category/CategoryPageClient';

/**
 * Bestseller-Übersichtsseite
 * Zeigt die beliebtesten Produkte
 */
export default async function BestsellerPage() {
  return (
    <CategoryPageClient
      slug="bestseller"
      categoryName="Bestseller - Unsere beliebtesten Bodenbeläge"
      categoryDescription="Die Top-Seller unserer Kunden! Diese Bodenbeläge überzeugen durch hervorragende Qualität, ansprechendes Design und ein unschlagbares Preis-Leistungs-Verhältnis."
      categoryImage={null}
    />
  );
}

export const metadata = {
  title: 'Bestseller - Beliebteste Bodenbeläge | Bodenjäger',
  description: 'Entdecken Sie unsere Bestseller: Die beliebtesten Bodenbeläge unserer Kunden. Laminat, Vinyl und Parkett in Top-Qualität.',
};
