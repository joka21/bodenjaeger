'use client';

import { useState, useEffect } from 'react';
import { wooCommerceClient, type StoreApiProduct } from '@/lib/woocommerce';

interface JaegerMeta {
  uvp?: number | null;
  show_uvp?: boolean;
  paketpreis?: number | null;
  paketpreis_s?: number | null;
  paketinhalt?: number | null;
  einheit_short?: string | null;
  verpackungsart_short?: string | null;
  verschnitt?: number | null;
  text_produktuebersicht?: string | null;
  show_text_produktuebersicht?: boolean;
  lieferzeit?: string | null;
  show_lieferzeit?: boolean;
  setangebot_titel?: string | null;
  show_setangebot?: boolean;
  standard_addition_daemmung?: number | null;
  standard_addition_sockelleisten?: number | null;
  aktion?: string | null;
  show_aktion?: boolean;
  angebotspreis_hinweis?: string | null;
  show_angebotspreis_hinweis?: boolean;
}

interface ExtendedProduct extends StoreApiProduct {
  jaeger_meta?: JaegerMeta;
}

export default function APITestPage() {
  const [products, setProducts] = useState<ExtendedProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ExtendedProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rawResponse, setRawResponse] = useState<string>('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔍 Fetching products from Store API...');
      const fetchedProducts = await wooCommerceClient.getProducts({
        per_page: 5,
        orderby: 'date',
        order: 'desc'
      });

      console.log('📦 Raw Products Response:', fetchedProducts);

      setProducts(fetchedProducts as ExtendedProduct[]);

      if (fetchedProducts.length > 0) {
        const firstProduct = fetchedProducts[0] as ExtendedProduct;
        console.log('🎯 First Product Details:', firstProduct);
        console.log('🔧 Jaeger Meta Fields:', firstProduct.jaeger_meta);
        setSelectedProduct(firstProduct);
      }

    } catch (err) {
      console.error('❌ Error fetching products:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchSingleProduct = async (slug: string) => {
    try {
      console.log(`🔍 Fetching single product: ${slug}`);

      const response = await fetch(`/api/products/${slug}`);
      const product = await response.json();

      console.log('📦 Single Product Raw Response:', product);
      console.log('🔧 Single Product Jaeger Meta:', (product as ExtendedProduct).jaeger_meta);

      setRawResponse(JSON.stringify(product, null, 2));
      setSelectedProduct(product as ExtendedProduct);

    } catch (err) {
      console.error('❌ Error fetching single product:', err);
    }
  };

  const testDirectAPICall = async () => {
    try {
      console.log('🌐 Testing direct WooCommerce Store API call...');

      const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL;
      const apiUrl = `${baseUrl}/wp-json/wc/store/v1/products?per_page=1`;

      console.log('📡 API URL:', apiUrl);

      const response = await fetch(apiUrl);
      const data = await response.json();

      console.log('🎯 Direct Store API Response:', data);

      if (data && data.length > 0) {
        console.log('🔧 First Product Jaeger Meta (Direct):', (data[0] as ExtendedProduct).jaeger_meta);
      }

      setRawResponse(JSON.stringify(data, null, 2));

    } catch (err) {
      console.error('❌ Direct API call failed:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">WooCommerce Store API Test</h1>
          <div className="bg-white rounded-lg shadow p-8">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-300 rounded mb-4"></div>
              <div className="h-4 bg-gray-300 rounded mb-4"></div>
              <div className="h-4 bg-gray-300 rounded"></div>
            </div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          WooCommerce Store API Test - Jaeger Meta Fields
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Control Buttons */}
        <div className="mb-6 space-x-4">
          <button
            onClick={fetchProducts}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Reload Products
          </button>
          <button
            onClick={testDirectAPICall}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Test Direct API Call
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Products List */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Products ({products.length})</h2>

            <div className="space-y-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedProduct?.id === product.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => {
                    setSelectedProduct(product);
                    console.log('🎯 Selected Product:', product);
                    console.log('🔧 Selected Product Jaeger Meta:', product.jaeger_meta);
                  }}
                >
                  <h3 className="font-medium text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-600">ID: {product.id} | Slug: {product.slug}</p>
                  <p className="text-sm text-gray-600">
                    Jaeger Meta: {product.jaeger_meta ? '✅ Available' : '❌ Missing'}
                  </p>
                  {product.jaeger_meta && (
                    <div className="mt-2 text-xs text-green-600">
                      Fields: {Object.keys(product.jaeger_meta).length}
                    </div>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      fetchSingleProduct(product.slug);
                    }}
                    className="mt-2 text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
                  >
                    Test Single API Call
                  </button>
                </div>
              ))}

              {products.length === 0 && (
                <p className="text-gray-500">No products found.</p>
              )}
            </div>
          </div>

          {/* Selected Product Details */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Product Details</h2>

            {selectedProduct ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">{selectedProduct.name}</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>ID: {selectedProduct.id}</p>
                    <p>Slug: {selectedProduct.slug}</p>
                    <p>Price: €{selectedProduct.prices?.price ? (parseFloat(selectedProduct.prices.price) / 100).toFixed(2) : selectedProduct.price}</p>
                    <p>In Stock: {selectedProduct.is_in_stock ? '✅' : '❌'}</p>
                  </div>
                </div>

                {/* Jaeger Meta Fields */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Jaeger Meta Fields {selectedProduct.jaeger_meta ? '✅' : '❌'}
                  </h4>

                  {selectedProduct.jaeger_meta ? (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <pre className="text-xs text-gray-800 overflow-x-auto">
                        {JSON.stringify(selectedProduct.jaeger_meta, null, 2)}
                      </pre>
                    </div>
                  ) : (
                    <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                      <p className="text-red-700 text-sm">
                        ❌ No jaeger_meta fields found.
                        The WordPress plugin may not be installed or active.
                      </p>
                    </div>
                  )}
                </div>

                {/* Complete Product Data */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Complete Product Data</h4>
                  <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                    <pre className="text-xs text-gray-800">
                      {JSON.stringify(selectedProduct, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Select a product to view details.</p>
            )}
          </div>
        </div>

        {/* Raw Response Viewer */}
        {rawResponse && (
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Raw API Response</h2>
            <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
              <pre className="text-xs text-gray-800">
                {rawResponse}
              </pre>
            </div>
          </div>
        )}

        {/* Debug Info */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-yellow-800 mb-4">Debug Information</h3>
          <div className="text-sm text-yellow-700 space-y-2">
            <p>
              <strong>WordPress URL:</strong> {process.env.NEXT_PUBLIC_WORDPRESS_URL}
            </p>
            <p>
              <strong>Store API Endpoint:</strong> {process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wc/store/v1/products
            </p>
            <p>
              <strong>Expected jaeger_meta fields:</strong> uvp, show_uvp, paketpreis, paketpreis_s, paketinhalt, einheit_short, verpackungsart_short, verschnitt, text_produktuebersicht, show_text_produktuebersicht, lieferzeit, show_lieferzeit, setangebot_titel, show_setangebot, standard_addition_daemmung, standard_addition_sockelleisten, aktion, show_aktion, angebotspreis_hinweis, show_angebotspreis_hinweis
            </p>
            <p className="mt-4 font-medium">
              📝 Instructions: Check the browser console for detailed API responses and debug information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}