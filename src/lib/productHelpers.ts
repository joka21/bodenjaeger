import type { StoreApiProduct } from './woocommerce';

/**
 * Check if a product is an accessory product (Zubehör, Sockelleisten, Dämmung)
 * These products use the simple product layout without Set-Angebot calculations
 */
export function isAccessoryProduct(product: StoreApiProduct): boolean {
  const accessoryCategories = ['zubehoer', 'sockelleisten', 'daemmung'];
  return product.categories?.some(cat =>
    accessoryCategories.includes(cat.slug.toLowerCase())
  ) ?? false;
}

/**
 * Check if a product is a floor product (Laminat, Vinyl, Parkett, etc.)
 * These products use the full Set-Angebot layout with Dämmung/Sockelleiste selection
 */
export function isFloorProduct(product: StoreApiProduct): boolean {
  const floorCategories = ['vinylboden', 'klebe-vinyl', 'rigid-vinyl',
                          'laminat', 'parkett'];
  return product.categories?.some(cat =>
    floorCategories.includes(cat.slug.toLowerCase())
  ) ?? false;
}
