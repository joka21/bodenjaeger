import { wooCommerceClient, type StoreApiProduct } from "@/lib/woocommerce";
import HeroSlider from "@/components/startseite/HeroSlider";
import BodenkategorienSection from "@/components/sections/home/BodenkategorienSection";
import VorteileSlider from "@/components/sections/home/VorteileSlider";
import GoogleReviewsSlider from "@/components/sections/home/GoogleReviewsSlider";
import SaleProductSlider from "@/components/sections/home/SaleProductSlider";
import BestsellerSlider from "@/components/sections/home/BestsellerSlider";

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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Slider */}
      <HeroSlider />

      {/* Bodenkategorien Section - Position 2 */}
      <BodenkategorienSection />

      {/* Vorteile Slider */}
      <VorteileSlider />

      {/* Sale Product Slider */}
      <SaleProductSlider products={saleProducts} />

      {/* Bestseller Product Slider */}
      <BestsellerSlider products={bestsellerProducts} />

      {/* Google Reviews Slider - ganz am Ende */}
      <GoogleReviewsSlider />
    </div>
  );
}