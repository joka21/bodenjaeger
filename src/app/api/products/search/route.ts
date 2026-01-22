import { NextRequest, NextResponse } from 'next/server';
import { wooCommerceClient, type StoreApiProduct } from '@/lib/woocommerce';

interface ProductWithScore {
  product: StoreApiProduct;
  score: number;
}

/**
 * Calculate search relevance score for a product
 * Higher score = more relevant
 */
function calculateRelevanceScore(product: StoreApiProduct, searchTerm: string): number {
  const search = searchTerm.toLowerCase().trim();
  let score = 0;

  // Helper: Check if text contains search term
  const contains = (text: string | undefined | null) => {
    if (!text) return false;
    return text.toLowerCase().includes(search);
  };

  // Helper: Check if text starts with search term
  const startsWith = (text: string | undefined | null) => {
    if (!text) return false;
    return text.toLowerCase().startsWith(search);
  };

  // Helper: Exact match
  const exactMatch = (text: string | undefined | null) => {
    if (!text) return false;
    return text.toLowerCase() === search;
  };

  // 1. PRODUCT NAME (highest priority)
  if (exactMatch(product.name)) {
    score += 1000; // Exact name match - highest priority
  } else if (startsWith(product.name)) {
    score += 500; // Name starts with search term
  } else if (contains(product.name)) {
    score += 200; // Name contains search term
  }

  // 2. SKU (very high priority for exact codes)
  if (exactMatch(product.sku)) {
    score += 800; // Exact SKU match
  } else if (startsWith(product.sku)) {
    score += 400;
  } else if (contains(product.sku)) {
    score += 150;
  }

  // 3. SLUG (URL-friendly name)
  if (exactMatch(product.slug)) {
    score += 700;
  } else if (contains(product.slug)) {
    score += 100;
  }

  // 4. CATEGORIES (important for discovery)
  if (product.categories && Array.isArray(product.categories)) {
    for (const category of product.categories) {
      if (exactMatch(category.name)) {
        score += 300;
      } else if (contains(category.name)) {
        score += 80;
      }
      if (contains(category.slug)) {
        score += 50;
      }
    }
  }

  // 5. TAGS (helpful for additional keywords)
  if (product.tags && Array.isArray(product.tags)) {
    for (const tag of product.tags) {
      if (exactMatch(tag.name)) {
        score += 200;
      } else if (contains(tag.name)) {
        score += 60;
      }
    }
  }

  // 6. SHORT DESCRIPTION (good for feature matching)
  if (contains(product.short_description)) {
    score += 40;
  }

  // 7. FULL DESCRIPTION (lower priority, might be too broad)
  if (contains(product.description)) {
    score += 20;
  }

  // 8. CUSTOM FIELDS (Jäger-specific)
  const artikelbeschreibung = product.artikelbeschreibung || product.jaeger_fields?.artikelbeschreibung;
  if (contains(artikelbeschreibung)) {
    score += 30;
  }

  // Bonus: Product is on sale (ONLY if there was already a match)
  if (score > 0 && product.on_sale) {
    score += 5;
  }

  // Bonus: Product has high sales (ONLY if there was already a match)
  if (score > 0 && product.total_sales && product.total_sales > 10) {
    score += Math.min(product.total_sales / 10, 20); // Max +20 points
  }

  return score;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';

    if (!query || query.trim().length < 2) {
      return NextResponse.json([]);
    }

    // Check if searching for sample products
    // Allow: "MUSTER" (exact), "MUSTER " (with space), "MUSTER [Produktname]"
    // Block: "muster" (lowercase only - likely searching in descriptions)
    const queryUpper = query.trim().toUpperCase();
    const queryLower = query.trim().toLowerCase();
    const isSearchingForSamples = queryUpper === 'MUSTER' || queryUpper.startsWith('MUSTER ');

    // Block lowercase "muster" search (not looking for sample products)
    if (queryLower === 'muster' && !isSearchingForSamples) {
      return NextResponse.json([]);
    }

    // IMPROVED STRATEGY:
    // Try WooCommerce search first (fast for common queries)
    const products = await wooCommerceClient.getProducts({
      per_page: 100,
      search: query.trim(),
    });

    // Helper: Check if product is in "Muster" category
    const isInMusterCategory = (product: StoreApiProduct): boolean => {
      if (!product.categories || !Array.isArray(product.categories)) return false;
      return product.categories.some(cat =>
        cat.slug === 'muster' ||
        cat.name.toLowerCase() === 'muster'
      );
    };

    // Calculate relevance scores for initial results
    let scoredProducts: ProductWithScore[] = products
      .map((product) => ({
        product,
        score: calculateRelevanceScore(product, query),
      }))
      .filter((item) => item.score > 0) // Only include products with any match
      .filter((item) => {
        // Exclude "Muster" category UNLESS we're explicitly searching for sample products
        if (isSearchingForSamples) {
          return true; // Include all results (including Muster category)
        }
        return !isInMusterCategory(item.product); // Exclude "Muster" category
      });

    // If NO relevant products found, WooCommerce search failed
    // Fetch ALL products and search manually (e.g., "sockelleisten")
    if (scoredProducts.length === 0) {
      // Load up to 500 products (5 pages) to balance performance and backend load
      // Using 5 parallel requests instead of 10 to avoid overwhelming the backend
      const pageRequests = [];
      for (let page = 1; page <= 5; page++) {
        pageRequests.push(
          wooCommerceClient.getProducts({ per_page: 100, page })
        );
      }

      const allPages = await Promise.all(pageRequests);

      // Merge all results (avoid duplicates)
      const productIds = new Set(products.map(p => p.id));
      const additionalProducts = allPages.flat().filter(p => !productIds.has(p.id));
      const allProducts = [...products, ...additionalProducts];

      // Re-calculate scores for ALL products
      scoredProducts = allProducts
        .map((product) => ({
          product,
          score: calculateRelevanceScore(product, query),
        }))
        .filter((item) => item.score > 0)
        .filter((item) => {
          // Exclude "Muster" category UNLESS we're explicitly searching for sample products
          if (isSearchingForSamples) {
            return true; // Include all results (including Muster category)
          }
          return !isInMusterCategory(item.product); // Exclude "Muster" category
        });
    }

    // Sort by score (highest first)
    scoredProducts.sort((a, b) => b.score - a.score);

    // Return top 50 results
    const results = scoredProducts.slice(0, 50).map((item) => item.product);

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error searching products:', error);
    return NextResponse.json(
      { error: 'Failed to search products' },
      { status: 500 }
    );
  }
}
