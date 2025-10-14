import Image from "next/image";
import Link from "next/link";
import { wooCommerceClient, type StoreApiProduct } from "@/lib/woocommerce";
import HeroSlider from "@/components/startseite/HeroSlider";
import SaleProductSlider from "@/components/sections/home/SaleProductSlider";

export default async function Home() {
  // Fetch products from WooCommerce
  let products: StoreApiProduct[] = [];
  let saleProducts: StoreApiProduct[] = [];

  try {
    products = await wooCommerceClient.getProducts({
      per_page: 12,
      orderby: 'date',
      order: 'desc'
    });

    // Fetch sale products from "Sale" category
    saleProducts = await wooCommerceClient.getProducts({
      per_page: 12,
      category: 'sale',
      orderby: 'popularity',
      order: 'desc'
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    products = [];
    saleProducts = [];
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Slider */}
      <HeroSlider />

      {/* Sale Product Slider */}
      <SaleProductSlider products={saleProducts} />

      {/* Products Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Unsere Produkte
            </h1>
            <p className="text-lg text-gray-600">
              Entdecken Sie unsere hochwertigen Bodenbeläge
            </p>
          </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              Keine Produkte verfügbar oder Verbindung zu WooCommerce fehlgeschlagen.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <Link href={`/products/${product.slug}`}>
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={product.images[0]?.src || "https://via.placeholder.com/400x300/f3f4f6/9ca3af?text=Kein+Bild"}
                    alt={product.images[0]?.alt || product.name}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              </Link>

              <div className="p-6">
                <Link href={`/products/${product.slug}`}>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors cursor-pointer">
                    {product.name}
                  </h2>
                </Link>

                <div className="flex items-center justify-between">
                  {product.on_sale ? (
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-red-600">
                        {product.sale_price}€
                      </span>
                      <span className="text-lg text-gray-500 line-through">
                        {product.regular_price}€
                      </span>
                    </div>
                  ) : (
                    <span className="text-2xl font-bold text-gray-900">
                      {product.price}€
                    </span>
                  )}

                  <Link
                    href={`/products/${product.slug}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors inline-block text-center"
                  >
                    Details ansehen
                  </Link>
                </div>
              </div>
            </div>
            ))}
          </div>
        )}
        </div>
      </div>
    </div>
  );
}