/**
 * Redis/KV Cache Utilities for WooCommerce Products
 *
 * Provides fast caching layer to reduce WooCommerce API calls
 * Expected performance: 2000ms → 50ms for cached products
 */

import type { VercelKV } from '@vercel/kv';
import type { StoreApiProduct } from './woocommerce';

// Cache TTL: 5 minutes (300 seconds)
const CACHE_TTL = 300;

// Cache key prefixes
const PRODUCT_KEY_PREFIX = 'product:';
const PRODUCTS_BATCH_KEY_PREFIX = 'products:batch:';

// Check if KV is available (environment variables are set)
const isKvAvailable = () => {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
};

// Lazy load KV only if available
let kv: VercelKV | null = null;
const getKv = async (): Promise<VercelKV | null> => {
  if (!isKvAvailable()) {
    return null;
  }
  if (!kv) {
    try {
      const { kv: kvClient } = await import('@vercel/kv');
      kv = kvClient;
    } catch (error) {
      console.warn('⚠️ Vercel KV not available, caching disabled:', error);
      return null;
    }
  }
  return kv;
};

/**
 * Get a single product from cache
 */
export async function getCachedProduct(slug: string): Promise<StoreApiProduct | null> {
  try {
    const kvClient = await getKv();
    if (!kvClient) {
      return null; // KV not available, skip cache
    }
    const cached = await kvClient.get<StoreApiProduct>(`${PRODUCT_KEY_PREFIX}${slug}`);
    if (cached) {
      console.log(`💾 Cache HIT for product: ${slug}`);
      return cached;
    }
    console.log(`❌ Cache MISS for product: ${slug}`);
    return null;
  } catch (error) {
    console.error('Cache read error:', error);
    return null; // Fail gracefully
  }
}

/**
 * Cache a single product
 */
export async function setCachedProduct(slug: string, product: StoreApiProduct): Promise<void> {
  try {
    const kvClient = await getKv();
    if (!kvClient) {
      return; // KV not available, skip cache
    }
    await kvClient.set(`${PRODUCT_KEY_PREFIX}${slug}`, product, { ex: CACHE_TTL });
    console.log(`✅ Cached product: ${slug}`);
  } catch (error) {
    console.error('Cache write error:', error);
    // Fail gracefully - don't throw
  }
}

/**
 * Get multiple products from cache by IDs
 */
export async function getCachedProductsBatch(ids: number[]): Promise<Map<number, StoreApiProduct> | null> {
  try {
    const kvClient = await getKv();
    if (!kvClient) {
      return null; // KV not available, skip cache
    }
    const batchKey = `${PRODUCTS_BATCH_KEY_PREFIX}${ids.sort().join(',')}`;
    const cached = await kvClient.get<Record<number, StoreApiProduct>>(batchKey);

    if (cached) {
      console.log(`💾 Cache HIT for ${ids.length} products batch`);
      return new Map(Object.entries(cached).map(([id, product]) => [parseInt(id), product]));
    }

    console.log(`❌ Cache MISS for products batch`);
    return null;
  } catch (error) {
    console.error('Cache read error:', error);
    return null;
  }
}

/**
 * Cache multiple products by IDs
 */
export async function setCachedProductsBatch(productsMap: Map<number, StoreApiProduct>): Promise<void> {
  try {
    const kvClient = await getKv();
    if (!kvClient) {
      return; // KV not available, skip cache
    }
    const ids = Array.from(productsMap.keys()).sort();
    const batchKey = `${PRODUCTS_BATCH_KEY_PREFIX}${ids.join(',')}`;

    // Convert Map to plain object for JSON serialization
    const productsObject = Object.fromEntries(productsMap);

    await kvClient.set(batchKey, productsObject, { ex: CACHE_TTL });
    console.log(`✅ Cached ${productsMap.size} products batch`);
  } catch (error) {
    console.error('Cache write error:', error);
    // Fail gracefully
  }
}

/**
 * Clear product cache (useful for webhooks/updates)
 */
export async function clearProductCache(slug: string): Promise<void> {
  try {
    const kvClient = await getKv();
    if (!kvClient) {
      return; // KV not available, skip cache
    }
    await kvClient.del(`${PRODUCT_KEY_PREFIX}${slug}`);
    console.log(`🗑️ Cleared cache for product: ${slug}`);
  } catch (error) {
    console.error('Cache clear error:', error);
  }
}

/**
 * Clear cache for a product by ID
 * Note: This requires finding the slug first, which isn't cached
 * Best to use clearProductCache(slug) directly if possible
 */
export async function clearProductCacheById(id: number): Promise<void> {
  try {
    const kvClient = await getKv();
    if (!kvClient) {
      return;
    }
    // We can't easily clear by ID without knowing the slug
    // So we just clear all batch caches that might contain this product
    const keys = await kvClient.keys(`${PRODUCTS_BATCH_KEY_PREFIX}*`);
    if (keys && keys.length > 0) {
      await kvClient.del(...keys);
      console.log(`🗑️ Cleared ${keys.length} batch caches (product ID: ${id})`);
    }
  } catch (error) {
    console.error('Cache clear by ID error:', error);
  }
}

/**
 * Clear ALL product caches
 * Use with caution - this will clear the entire cache
 */
export async function clearAllProductCaches(): Promise<void> {
  try {
    const kvClient = await getKv();
    if (!kvClient) {
      return;
    }

    // Get all product-related keys
    const productKeys = await kvClient.keys(`${PRODUCT_KEY_PREFIX}*`);
    const batchKeys = await kvClient.keys(`${PRODUCTS_BATCH_KEY_PREFIX}*`);

    const allKeys = [...(productKeys || []), ...(batchKeys || [])];

    if (allKeys.length > 0) {
      await kvClient.del(...allKeys);
      console.log(`🗑️ Cleared ALL product caches (${allKeys.length} keys)`);
    } else {
      console.log('📭 No cache keys to clear');
    }
  } catch (error) {
    console.error('Cache clear all error:', error);
  }
}
