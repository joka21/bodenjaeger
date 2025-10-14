import { notFound } from "next/navigation";
import { wooCommerceClient, type StoreApiProduct } from "@/lib/woocommerce";
import ImageGallery from "@/components/product/ImageGallery";
import ProductInfo from "@/components/product/ProductInfo";
import AddToCartButton from "./AddToCartButton";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

// Enable ISR - revalidate every 60 seconds
export const revalidate = 60;

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  let product: StoreApiProduct | null = null;

  try {
    // Server-side data fetching (much faster)
    product = await wooCommerceClient.getProduct(slug);

    if (!product) {
      notFound();
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Product Section - 2 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-8 mb-12">
          {/* LEFT COLUMN - Image Gallery */}
          <div className="space-y-6">
            <ImageGallery product={product} />

            {/* Action Buttons - Placeholder for now */}
            <div className="grid grid-cols-2 gap-4">
              <button className="px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:border-gray-400 transition-colors flex items-center justify-center gap-2">
                📦 Kostenloses Muster bestellen
              </button>
              <button className="px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:border-gray-400 transition-colors flex items-center justify-center gap-2">
                🏠 Virtuell im Bodenplaner ansehen
              </button>
            </div>

            {/* Service Icons - Placeholder for now */}
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-center gap-3">
                <span>📞</span>
                <span>Persönliche Beratung unter 0800 123 4567</span>
              </div>
              <div className="flex items-center gap-3">
                <span>📦</span>
                <span>Kostenlose Einlagerung bis zu 6 Monate</span>
              </div>
              <div className="flex items-center gap-3">
                <span>🚚</span>
                <span>Lieferung zum Wunschtermin</span>
              </div>
              <div className="flex items-center gap-3">
                <span>💰</span>
                <span>Kostenlose Lieferung ab 999€</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Product Info & Cart */}
          <div className="space-y-6">
            <ProductInfo product={product} />

            {/* Temporary: Show current price */}
            <div className="p-6 bg-white rounded-lg shadow-md">
              <div className="mb-6">
                {product.on_sale ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-900 text-sm">Set-Angebot</span>
                      <span className="text-gray-500 line-through text-sm">
                        {product.prices?.regular_price
                          ? (parseFloat(product.prices.regular_price) / 100).toFixed(2)
                          : product.regular_price}€/{product.jaeger_meta?.einheit_short || 'm²'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-900 font-medium">Gesamt</span>
                      <span className="text-red-600 font-bold text-2xl">
                        {product.prices?.price
                          ? (parseFloat(product.prices.price) / 100).toFixed(2)
                          : product.price}€/{product.jaeger_meta?.einheit_short || 'm²'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-900 font-medium">Preis</span>
                    <span className="text-gray-900 font-bold text-2xl">
                      {product.prices?.price
                        ? (parseFloat(product.prices.price) / 100).toFixed(2)
                        : product.price}€/{product.jaeger_meta?.einheit_short || 'm²'}
                    </span>
                  </div>
                )}
              </div>

              <AddToCartButton product={product} />

              {/* Lieferzeit */}
              {product.jaeger_meta?.show_lieferzeit && product.jaeger_meta?.lieferzeit && (
                <div className="mt-4 text-sm text-gray-600">
                  🚚 {product.jaeger_meta.lieferzeit}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Placeholder sections for later */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Passendes Zubehör
          </h2>
          <p className="text-gray-600">Coming soon...</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Produktdetails
          </h2>
          {product.description && (
            <div
              className="prose prose-gray max-w-none"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Generate static params for most popular products (optional)
export async function generateStaticParams() {
  try {
    const products = await wooCommerceClient.getProducts({
      per_page: 10, // Top 10 most popular products
      orderby: 'popularity'
    });

    return products.map((product) => ({
      slug: product.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// Dynamic metadata generation
export async function generateMetadata({ params }: ProductPageProps) {
  try {
    const { slug } = await params;
    const product = await wooCommerceClient.getProduct(slug);

    if (!product) {
      return {
        title: 'Produkt nicht gefunden'
      };
    }

    return {
      title: `${product.name} | Bodenjäger`,
      description: product.short_description || product.description?.substring(0, 160) || `${product.name} bei Bodenjäger kaufen`,
      openGraph: {
        title: product.name,
        description: product.short_description || product.description?.substring(0, 160),
        images: product.images?.[0]?.src ? [product.images[0].src] : [],
      },
    };
  } catch (error) {
    return {
      title: 'Bodenjäger - Hochwertige Bodenbeläge'
    };
  }
}