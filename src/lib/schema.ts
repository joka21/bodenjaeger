import type { StoreApiProduct } from '@/lib/woocommerce'

const SITE_URL = 'https://bodenjaeger.de'

export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function buildProductSchema(product: StoreApiProduct): object {
  const url = `${SITE_URL}/products/${product.slug}`
  const description = product.short_description
    ? stripHtml(product.short_description)
    : undefined
  const image = product.images?.[0]?.src || undefined

  const additionalProperty: object[] = []

  if (product.einheit) {
    additionalProperty.push({
      '@type': 'PropertyValue',
      name: 'Einheit',
      value: product.einheit,
    })
  }

  if (product.paketinhalt && product.einheit_short) {
    additionalProperty.push({
      '@type': 'PropertyValue',
      name: 'Paketinhalt',
      value: `${product.paketinhalt} ${product.einheit_short}`,
    })
  }

  if (product.verschnitt) {
    additionalProperty.push({
      '@type': 'PropertyValue',
      name: 'Verschnitt',
      value: `${product.verschnitt}%`,
    })
  }

  if (product.verpackungsart) {
    additionalProperty.push({
      '@type': 'PropertyValue',
      name: 'Verpackungsart',
      value: product.verpackungsart,
    })
  }

  if (product.show_lieferzeit && product.lieferzeit) {
    additionalProperty.push({
      '@type': 'PropertyValue',
      name: 'Lieferzeit',
      value: product.lieferzeit,
    })
  }

  const priceValidUntil = new Date()
  priceValidUntil.setFullYear(priceValidUntil.getFullYear() + 1)
  const priceValidUntilStr = priceValidUntil.toISOString().split('T')[0]

  const offers =
    product.price && product.price > 0
      ? {
          '@type': 'Offer',
          price: product.price,
          priceCurrency: 'EUR',
          priceValidUntil: priceValidUntilStr,
          availability:
            product.stock_status === 'instock'
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
          url,
          seller: { '@type': 'Organization', name: 'Bodenjäger' },
        }
      : undefined

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    sku: product.sku || undefined,
    url,
    image,
    description: description || undefined,
    brand: { '@type': 'Brand', name: 'Bodenjäger' },
    category: product.categories?.[0]?.name || undefined,
    offers,
    ...(additionalProperty.length > 0 ? { additionalProperty } : {}),
  }
}

export function buildOrganizationSchema(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Bodenjäger',
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo/logo-bodenjaeger-fff.svg`,
    description:
      'Premium Bodenbeläge online kaufen – Vinyl, Laminat und Parkett von Bodenjäger.',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'DE',
    },
    areaServed: 'DE',
  }
}

export function buildWebSiteSchema(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Bodenjäger',
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

export function buildBreadcrumbSchema(
  items: { name: string; url: string }[]
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
