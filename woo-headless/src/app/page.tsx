import Image from "next/image";
import { dummyProducts } from "@/lib/dummy-data";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            WooCommerce Store
          </h1>
          <p className="text-lg text-gray-600">
            Entdecken Sie unsere hochwertigen Produkte
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dummyProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative h-64">
                <Image
                  src={product.images[0]?.src || "/placeholder.jpg"}
                  alt={product.images[0]?.alt || product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>

              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {product.name}
                </h2>

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

                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                    Zum Produkt
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}