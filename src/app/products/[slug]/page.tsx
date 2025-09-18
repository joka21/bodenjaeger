import Image from "next/image";
import { notFound } from "next/navigation";
import { wooCommerceClient } from "@/lib/woocommerce";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  let product;
  try {
    product = await wooCommerceClient.getProduct(slug);
  } catch (error) {
    console.error('Error fetching product:', error);
    notFound();
  }

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Produktbild */}
            <div className="relative aspect-square rounded-lg overflow-hidden">
              <Image
                src={product.images[0]?.src || "https://via.placeholder.com/600x600/f3f4f6/9ca3af?text=Kein+Bild"}
                alt={product.images[0]?.alt || product.name}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Produktinformationen */}
            <div className="flex flex-col justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {product.name}
                </h1>

                <div className="mb-6">
                  {product.on_sale ? (
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl font-bold text-red-600">
                        {product.sale_price}€
                      </span>
                      <span className="text-xl text-gray-500 line-through">
                        {product.regular_price}€
                      </span>
                      <span className="bg-red-100 text-red-800 text-sm font-semibold px-2 py-1 rounded">
                        Sale
                      </span>
                    </div>
                  ) : (
                    <span className="text-3xl font-bold text-gray-900">
                      {product.price}€
                    </span>
                  )}
                </div>

                <div className="prose prose-gray max-w-none mb-8">
                  <p className="text-gray-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {product.short_description && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Kurzbeschreibung</h3>
                    <p className="text-gray-600 text-sm">
                      {product.short_description}
                    </p>
                  </div>
                )}

                {/* Produktdetails */}
                <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
                  <div>
                    <span className="font-semibold text-gray-900">SKU:</span>
                    <span className="text-gray-600 ml-2">{product.sku || "N/A"}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">Status:</span>
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${
                      product.stock_status === 'instock'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.stock_status === 'instock' ? 'Auf Lager' : 'Nicht verfügbar'}
                    </span>
                  </div>
                  {product.weight && (
                    <div>
                      <span className="font-semibold text-gray-900">Gewicht:</span>
                      <span className="text-gray-600 ml-2">{product.weight}kg</span>
                    </div>
                  )}
                  {product.categories && product.categories.length > 0 && (
                    <div>
                      <span className="font-semibold text-gray-900">Kategorie:</span>
                      <span className="text-gray-600 ml-2">{product.categories[0].name}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <button
                  className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
                    product.stock_status === 'instock'
                      ? 'bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                  disabled={product.stock_status !== 'instock'}
                >
                  {product.stock_status === 'instock' ? 'In den Warenkorb' : 'Nicht verfügbar'}
                </button>

                <button className="w-full py-3 px-6 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                  Zur Wunschliste hinzufügen
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Zusätzliche Produktbilder */}
        {product.images && product.images.length > 1 && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Weitere Bilder</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {product.images.slice(1).map((image, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover hover:scale-105 transition-transform"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Generate static params for all products
export async function generateStaticParams() {
  try {
    const products = await wooCommerceClient.getProducts({ per_page: 100 });
    return products.map((product) => ({
      slug: product.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;

  try {
    const product = await wooCommerceClient.getProduct(slug);

    if (!product) {
      return {
        title: 'Produkt nicht gefunden',
      };
    }

    return {
      title: `${product.name} - WooCommerce Store`,
      description: product.short_description || product.description,
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Produkt nicht gefunden',
    };
  }
}