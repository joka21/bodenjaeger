import { notFound } from "next/navigation";
import { wooCommerceClient, type StoreApiProduct } from "@/lib/woocommerce";
import ProductPageContent from "@/components/product/ProductPageContent";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

// Enable ISR - revalidate every 30 seconds
// Products can change frequently in backend, so shorter cache is needed
export const revalidate = 30;

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  let product: StoreApiProduct | null = null;
  let daemmungProduct: StoreApiProduct | null = null;
  let sockelleisteProduct: StoreApiProduct | null = null;
  let daemmungOptions: StoreApiProduct[] = [];
  let sockelleisteOptions: StoreApiProduct[] = [];

  try {
    // OPTIMIZATION: Load main product and check if we need additional products in parallel
    // First, we need to get the product to know which IDs to load
    product = await wooCommerceClient.getProduct(slug);

    if (!product) {
      notFound();
    }

    console.log('Product jaeger_meta:', product.jaeger_meta);
    console.log('🔍 Set-Angebot Ersparnis-Felder vom Backend:');
    console.log('  - setangebot_einzelpreis:', product.jaeger_meta?.setangebot_einzelpreis);
    console.log('  - setangebot_gesamtpreis:', product.jaeger_meta?.setangebot_gesamtpreis);
    console.log('  - setangebot_ersparnis_euro:', product.jaeger_meta?.setangebot_ersparnis_euro);
    console.log('  - setangebot_ersparnis_prozent:', product.jaeger_meta?.setangebot_ersparnis_prozent);

    // Parse all product IDs we need to load
    const daemmungId = product.jaeger_meta?.standard_addition_daemmung;
    const sockelleisteId = product.jaeger_meta?.standard_addition_sockelleisten;

    const daemmungOptionIds = product.jaeger_meta?.option_products_daemmung
      ? product.jaeger_meta.option_products_daemmung.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id))
      : [];
    const sockelleisteOptionIds = product.jaeger_meta?.option_products_sockelleisten
      ? product.jaeger_meta.option_products_sockelleisten.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id))
      : [];

    console.log('Dämmung ID:', daemmungId);
    console.log('Sockelleiste ID:', sockelleisteId);
    console.log('Dämmung option IDs:', daemmungOptionIds);
    console.log('Sockelleiste option IDs:', sockelleisteOptionIds);

    // Check if we need to load additional products
    const needsProducts = daemmungId || sockelleisteId || daemmungOptionIds.length > 0 || sockelleisteOptionIds.length > 0;

    if (needsProducts) {
      try {
        const startTime = Date.now();
        console.log('⚡ Loading addition and option products in batch...');

        // Collect all product IDs to load
        const productIdsToLoad = [
          ...(daemmungId ? [daemmungId] : []),
          ...(sockelleisteId ? [sockelleisteId] : []),
          ...daemmungOptionIds,
          ...sockelleisteOptionIds,
        ];

        // Load all products in one batch request (much more efficient!)
        const productsById = await wooCommerceClient.getProductsByIds(productIdsToLoad);

        const loadTime = Date.now() - startTime;
        console.log(`✅ Loaded ${productsById.size} products in ${loadTime}ms`);

        // Assign standard products
        if (daemmungId) {
          daemmungProduct = productsById.get(daemmungId) || null;
          console.log('Dämmung product:', daemmungProduct ? `${daemmungProduct.name} (ID: ${daemmungProduct.id})` : 'Not found');
        }

        if (sockelleisteId) {
          sockelleisteProduct = productsById.get(sockelleisteId) || null;
          console.log('Sockelleiste product:', sockelleisteProduct ? `${sockelleisteProduct.name} (ID: ${sockelleisteProduct.id})` : 'Not found');
        }

        // Assign option products
        if (daemmungOptionIds.length > 0) {
          daemmungOptions = daemmungOptionIds
            .map(id => productsById.get(id))
            .filter((p): p is StoreApiProduct => p !== undefined);
          console.log(`Loaded ${daemmungOptions.length} Dämmung options`);
        }

        // IMPORTANT: If standard product exists, ensure it's in the options list
        // This ensures that even if there are no other options, the standard product is selectable
        if (daemmungProduct) {
          const standardDaemmungId = daemmungProduct.id;
          if (!daemmungOptions.find(opt => opt.id === standardDaemmungId)) {
            daemmungOptions = [daemmungProduct, ...daemmungOptions];
            console.log('Added standard Dämmung to options list');
          }
        }

        if (sockelleisteOptionIds.length > 0) {
          sockelleisteOptions = sockelleisteOptionIds
            .map(id => productsById.get(id))
            .filter((p): p is StoreApiProduct => p !== undefined);
          console.log(`Loaded ${sockelleisteOptions.length} Sockelleiste options`);
        }

        // IMPORTANT: If standard product exists, ensure it's in the options list
        // This ensures that even if there are no other options, the standard product is selectable
        if (sockelleisteProduct) {
          const standardSockelleisteId = sockelleisteProduct.id;
          if (!sockelleisteOptions.find(opt => opt.id === standardSockelleisteId)) {
            sockelleisteOptions = [sockelleisteProduct, ...sockelleisteOptions];
            console.log('Added standard Sockelleiste to options list');
          }
        }
      } catch (error) {
        console.error('❌ Error loading addition products:', error);
        // Continue without additional products rather than failing completely
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