'use client';

import Image from "next/image";
import { notFound } from "next/navigation";
import { useState, useEffect } from "react";
import { type StoreApiProduct } from "@/lib/woocommerce";
import { useCart } from "@/contexts/CartContext";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const [product, setProduct] = useState<StoreApiProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addToCart, isInCart, getItemQuantity } = useCart();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const resolvedParams = await params;
        const { slug } = resolvedParams;

        console.log('Fetching product with slug:', slug);
        const response = await fetch(`/api/products/${encodeURIComponent(slug)}`);

        console.log('Response status:', response.status);

        if (!response.ok) {
          if (response.status === 404) {
            console.error('Product not found:', slug);
            notFound();
            return;
          }
          throw new Error(`Failed to fetch product: ${response.status} ${response.statusText}`);
        }

        const fetchedProduct = await response.json();
        console.log('Fetched product:', fetchedProduct);
        setProduct(fetchedProduct);
      } catch (error) {
        console.error('Error fetching product:', error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [params]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      setAddedToCart(true);
      // Reset feedback after 3 seconds
      setTimeout(() => setAddedToCart(false), 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden p-8">
            <div className="animate-pulse">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="aspect-square bg-gray-300 rounded-lg"></div>
                <div className="space-y-4">
                  <div className="h-8 bg-gray-300 rounded"></div>
                  <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
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

              {/* Quantity Selector */}
              {product.is_in_stock && (
                <div className="mb-6">
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                    Anzahl:
                  </label>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      id="quantity"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-20 text-center border border-gray-300 rounded-lg py-2"
                      min="1"
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Success Message */}
              {addedToCart && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="font-medium">
                    {quantity} {quantity === 1 ? 'Artikel wurde' : 'Artikel wurden'} erfolgreich in den Warenkorb gelegt!
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-4">
                <button
                  onClick={handleAddToCart}
                  className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${
                    product.is_in_stock
                      ? addedToCart
                        ? 'bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-200'
                        : 'bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                  disabled={!product.is_in_stock}
                >
                  {product.is_in_stock
                    ? addedToCart
                      ? (
                        <span className="flex items-center justify-center">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Hinzugefügt! ({getItemQuantity(product.id)} im Warenkorb)
                        </span>
                      )
                      : isInCart(product.id)
                        ? `Weitere ${quantity} hinzufügen (${getItemQuantity(product.id)} bereits im Warenkorb)`
                        : `In den Warenkorb (${quantity} Stück)`
                    : 'Nicht verfügbar'
                  }
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

