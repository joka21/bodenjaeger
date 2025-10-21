import dynamic from 'next/dynamic';
import { wooCommerceClient, type StoreApiProduct } from "@/lib/woocommerce";
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
  // Fetch products from WooCommerce
  let saleProducts: StoreApiProduct[] = [];
  let bestsellerProducts: StoreApiProduct[] = [];

  try {
    // Fetch sale products from "Sale" category
    saleProducts = await wooCommerceClient.getProducts({
      per_page: 12,
      category: 'sale',
      orderby: 'popularity',
      order: 'desc'
    });

    // Fetch bestseller products from "Bestseller" category
    bestsellerProducts = await wooCommerceClient.getProducts({
      per_page: 12,
      category: 'bestseller',
      orderby: 'popularity',
      order: 'desc'
    });

  } catch (error) {
    console.error('Error fetching products:', error);
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