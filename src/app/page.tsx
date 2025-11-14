import dynamic from 'next/dynamic';
import { wooCommerceClient, type StoreApiProduct } from "@/lib/woocommerce";
import { adaptStoreApiProductsToCritical } from "@/lib/api/adapters";
import HeroSlider from "@/components/startseite/HeroSlider";
import VorteileSlider from "@/components/sections/home/VorteileSlider";

// Dynamic imports for below-the-fold components to reduce initial bundle size
const BodenkategorienSection = dynamic(() => import("@/components/sections/home/BodenkategorienSection"), {
  loading: () => <div className="py-16 bg-gray-50" style={{ minHeight: '400px' }} />
});

const SaleProductSlider = dynamic(() => import("@/components/sections/home/SaleProductSlider"), {
  loading: () => <div className="py-16 bg-gray-50" style={{ minHeight: '500px' }} />
});

const BestsellerSlider = dynamic(() => import("@/components/sections/home/BestsellerSlider"), {
  loading: () => <div className="py-16 bg-gray-50" style={{ minHeight: '500px' }} />
});

const GoogleReviewsSlider = dynamic(() => import("@/components/sections/home/GoogleReviewsSlider"), {
  loading: () => <div className="py-16 bg-white" style={{ minHeight: '400px' }} />
});

export default async function Home() {
  // Fetch products from WooCommerce (using old API for now, then adapt)
  let saleProducts: StoreApiProduct[] = [];
  let bestsellerProducts: StoreApiProduct[] = [];

  try {
    // Fetch sale products from "Sale" category
    const rawSaleProducts = await wooCommerceClient.getProducts({
      per_page: 12,
      category: 'sale',
      orderby: 'popularity',
      order: 'desc'
    });

    // Adapt to ProductCritical format (optimized data)
    saleProducts = rawSaleProducts;

    console.log('✅ Sale Products fetched & adapted:', saleProducts.length);
    if (saleProducts.length > 0) {
      console.log('🖼️ First sale product (adapted):', {
        name: saleProducts[0].name,
        thumbnail: saleProducts[0].images?.[0]?.src,
        jaeger_meta: saleProducts[0].jaeger_meta,
      });
    }

    // Fetch bestseller products from "Bestseller" category
    const rawBestsellerProducts = await wooCommerceClient.getProducts({
      per_page: 12,
      category: 'bestseller',
      orderby: 'popularity',
      order: 'desc'
    });

    // Adapt to ProductCritical format (optimized data)
    bestsellerProducts = rawBestsellerProducts;

    console.log('✅ Bestseller Products fetched & adapted:', bestsellerProducts.length);
    if (bestsellerProducts.length > 0) {
      console.log('🖼️ First bestseller product (adapted):', {
        name: bestsellerProducts[0].name,
        thumbnail: bestsellerProducts[0].images?.[0]?.src,
        jaeger_meta: bestsellerProducts[0].jaeger_meta,
      });
    }

  } catch (error) {
    console.error('❌ Error fetching products:', error);
    saleProducts = [];
    bestsellerProducts = [];
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Hero Slider */}
      <HeroSlider />

      {/* Vorteile Slider - Position 2 */}
      <VorteileSlider />

      {/* Bodenkategorien Section - Position 3 */}
      <BodenkategorienSection />

      {/* Sale Product Slider */}
      <SaleProductSlider products={saleProducts} />

      {/* Bestseller Product Slider */}
      <BestsellerSlider products={bestsellerProducts} />

      {/* Google Reviews Slider - ganz am Ende */}
      <GoogleReviewsSlider />
    </div>
  );
}