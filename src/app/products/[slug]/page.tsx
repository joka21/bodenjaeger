import { notFound } from "next/navigation";
import { wooCommerceClient, type StoreApiProduct } from "@/lib/woocommerce";
import ProductPageContent from "@/components/product/ProductPageContent";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

// Enable ISR - revalidate every 60 seconds
export const revalidate = 60;

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  let product: StoreApiProduct | null = null;
  let daemmungProduct: StoreApiProduct | null = null;
  let sockelleisteProduct: StoreApiProduct | null = null;
  let daemmungOptions: StoreApiProduct[] = [];
  let sockelleisteOptions: StoreApiProduct[] = [];

  try {
    // Server-side data fetching (much faster)
    product = await wooCommerceClient.getProduct(slug);

    if (!product) {
      notFound();
    }

    // Load standard addition products if available
    console.log('Product jaeger_meta:', product.jaeger_meta);
    console.log('Dämmung ID:', product.jaeger_meta?.standard_addition_daemmung);
    console.log('Sockelleiste ID:', product.jaeger_meta?.standard_addition_sockelleisten);

    // Parse option product IDs from comma-separated strings
    const daemmungOptionIds = product.jaeger_meta?.option_products_daemmung
      ? product.jaeger_meta.option_products_daemmung.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id))
      : [];
    const sockelleisteOptionIds = product.jaeger_meta?.option_products_sockelleisten
      ? product.jaeger_meta.option_products_sockelleisten.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id))
      : [];

    console.log('Dämmung option IDs:', daemmungOptionIds);
    console.log('Sockelleiste option IDs:', sockelleisteOptionIds);

    // Load addition products using Store API (same as main products)
    // Store IDs in variables to satisfy TypeScript
    const daemmungId = product.jaeger_meta?.standard_addition_daemmung;
    const sockelleisteId = product.jaeger_meta?.standard_addition_sockelleisten;
    const needsProducts = daemmungId || sockelleisteId || daemmungOptionIds.length > 0 || sockelleisteOptionIds.length > 0;

    if (needsProducts) {
      try {
        console.log('Loading all products to find addition and option products...');

        // Load ALL products by fetching multiple pages
        let allProducts: StoreApiProduct[] = [];
        let page = 1;
        let hasMore = true;

        while (hasMore && page <= 10) { // Limit to 10 pages (1000 products max)
          const products = await wooCommerceClient.getProducts({ per_page: 100, page });
          allProducts = [...allProducts, ...products];

          if (products.length < 100) {
            hasMore = false; // Last page
          }
          page++;
        }

        console.log(`Loaded ${allProducts.length} total products from Store API`);

        // Load standard products
        if (daemmungId) {
          daemmungProduct = allProducts.find(p => p.id === daemmungId) || null;
          console.log('Dämmung product:', daemmungProduct ? `${daemmungProduct.name} (ID: ${daemmungProduct.id})` : 'Not found');
        }

        if (sockelleisteId) {
          sockelleisteProduct = allProducts.find(p => p.id === sockelleisteId) || null;
          console.log('Sockelleiste product:', sockelleisteProduct ? `${sockelleisteProduct.name} (ID: ${sockelleisteProduct.id})` : 'Not found');
        }

        // Load option products (alternative selections)
        if (daemmungOptionIds.length > 0) {
          daemmungOptions = allProducts.filter(p => daemmungOptionIds.includes(p.id));
          console.log(`Loaded ${daemmungOptions.length} Dämmung options:`, daemmungOptions.map(p => p.name));
        }

        if (sockelleisteOptionIds.length > 0) {
          sockelleisteOptions = allProducts.filter(p => sockelleisteOptionIds.includes(p.id));
          console.log(`Loaded ${sockelleisteOptions.length} Sockelleiste options:`, sockelleisteOptions.map(p => p.name));
        }
      } catch (error) {
        console.error('Error loading addition products:', error);
      }
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    notFound();
  }

  return (
    <ProductPageContent
      product={product}
      daemmungProduct={daemmungProduct}
      sockelleisteProduct={sockelleisteProduct}
      daemmungOptions={daemmungOptions}
      sockelleisteOptions={sockelleisteOptions}
    />
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
  } catch {
    return {
      title: 'Bodenjäger - Hochwertige Bodenbeläge'
    };
  }
}