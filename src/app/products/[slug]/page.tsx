import Image from "next/image";
import { notFound } from "next/navigation";
import { wooCommerceClient, type StoreApiProduct } from "@/lib/woocommerce";
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
                priority={true}
                sizes="(max-width: 768px) 100vw, 50vw"
                quality={85}
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
                        {product.prices?.price ? (parseFloat(product.prices.price) / 100).toFixed(2) : product.sale_price}€
                      </span>
                      <span className="text-xl text-gray-500 line-through">
                        {product.prices?.regular_price ? (parseFloat(product.prices.regular_price) / 100).toFixed(2) : product.regular_price}€
                      </span>
                      <span className="bg-red-100 text-red-800 text-sm font-semibold px-2 py-1 rounded">
                        Sale
                      </span>
                    </div>
                  ) : (
                    <span className="text-3xl font-bold text-gray-900">
                      {product.prices?.price ? (parseFloat(product.prices.price) / 100).toFixed(2) : product.price}€
                    </span>
                  )}
                </div>

                {product.description && (
                  <div className="prose prose-gray max-w-none mb-8">
                    <div
                      className="text-gray-600 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: product.description }}
                    />
                  </div>
                )}

                {product.short_description && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Kurzbeschreibung</h3>
                    <div
                      className="text-gray-600 text-sm"
                      dangerouslySetInnerHTML={{ __html: product.short_description }}
                    />
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
                      product.is_in_stock
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.is_in_stock ? 'Auf Lager' : 'Nicht verfügbar'}
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

              {/* Client Component for interactive elements */}
              <AddToCartButton product={product} />
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
                    alt={image.alt || `${product.name} Bild ${index + 2}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform"
                    sizes="(max-width: 768px) 50vw, 25vw"
                    quality={80}
                    loading="lazy"
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