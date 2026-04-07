import { readFileSync } from 'fs';
import { resolve } from 'path';

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const WP_URL = 'https://2025.bodenjaeger.de';

interface EnvVars {
  WC_CONSUMER_KEY: string;
  WC_CONSUMER_SECRET: string;
}

function loadEnv(): EnvVars {
  const envPath = resolve(process.cwd(), '.env.local');
  const content = readFileSync(envPath, 'utf-8');
  const vars: Record<string, string> = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    vars[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
  return vars as unknown as EnvVars;
}

const env = loadEnv();

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PageTest {
  slug: string;
  label: string;
}

type Status = 'ok' | 'warn' | 'fail';

interface PageResult {
  slug: string;
  label: string;
  status: Status;
  title?: string;
  charCount?: number;
  elementor?: boolean;
  error?: string;
}

interface ApiResult {
  name: string;
  status: Status;
  detail: string;
}

// ---------------------------------------------------------------------------
// Pages to test
// ---------------------------------------------------------------------------

const PAGES: PageTest[] = [
  { slug: 'allgemeine-geschaeftsbedingungen', label: 'AGB' },
  { slug: 'datenschutzerklaerung-2', label: 'Datenschutz' },
  { slug: 'impressum', label: 'Impressum' },
  { slug: 'widerrufsbelehrung-widerrufsformular', label: 'Widerruf' },
  { slug: 'versandkosten-lieferzeit', label: 'Versand' },
  { slug: 'beratung', label: 'Beratung' },
  { slug: 'karriere', label: 'Karriere' },
  { slug: 'filiale-hueckelhoven', label: 'Filiale' },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function fetchJson(url: string, headers?: Record<string, string>): Promise<{ status: number; data: unknown }> {
  const res = await fetch(url, { headers });
  const data = await res.json();
  return { status: res.status, data };
}

function pad(str: string, len: number): string {
  return str.length >= len ? str : str + ' '.repeat(len - str.length);
}

// ---------------------------------------------------------------------------
// Test: WordPress Pages
// ---------------------------------------------------------------------------

async function testPage(page: PageTest): Promise<PageResult> {
  const url = `${WP_URL}/wp-json/wp/v2/pages?slug=${page.slug}`;
  try {
    const { status, data } = await fetchJson(url);

    if (status !== 200) {
      return { slug: page.slug, label: page.label, status: 'fail', error: `HTTP ${status}` };
    }

    const arr = data as Array<Record<string, unknown>>;
    if (!Array.isArray(arr) || arr.length === 0) {
      return { slug: page.slug, label: page.label, status: 'fail', error: 'NICHT GEFUNDEN (falscher Slug?)' };
    }

    const entry = arr[0];
    const title = (entry.title as { rendered?: string })?.rendered ?? '';
    const content = (entry.content as { rendered?: string })?.rendered ?? '';

    if (!content) {
      return { slug: page.slug, label: page.label, status: 'fail', title, error: 'content.rendered leer' };
    }

    const charCount = content.length;
    const hasElementor = /elementor/i.test(content);

    if (charCount < 100) {
      return { slug: page.slug, label: page.label, status: 'fail', title, charCount, elementor: hasElementor, error: `Nur ${charCount} Zeichen (< 100)` };
    }

    if (!title) {
      return { slug: page.slug, label: page.label, status: 'warn', charCount, elementor: hasElementor, error: 'title.rendered fehlt' };
    }

    if (hasElementor) {
      return { slug: page.slug, label: page.label, status: 'warn', title, charCount, elementor: true };
    }

    return { slug: page.slug, label: page.label, status: 'ok', title, charCount, elementor: false };
  } catch (err) {
    return { slug: page.slug, label: page.label, status: 'fail', error: `Netzwerkfehler: ${(err as Error).message}` };
  }
}

// ---------------------------------------------------------------------------
// Test: Jäger API
// ---------------------------------------------------------------------------

async function testJaegerApi(): Promise<ApiResult> {
  const url = `${WP_URL}/wp-json/jaeger/v1/products?per_page=1`;
  try {
    const { status, data } = await fetchJson(url);
    if (status !== 200) return { name: 'Jäger API', status: 'fail', detail: `HTTP ${status}` };

    const arr = data as Array<Record<string, unknown>>;
    if (!Array.isArray(arr) || arr.length === 0) return { name: 'Jäger API', status: 'fail', detail: 'Kein Produkt zurückgegeben' };

    const product = arr[0];
    const missing: string[] = [];
    for (const field of ['id', 'name', 'price', 'paketpreis', 'paketinhalt']) {
      if (product[field] === undefined || product[field] === null) missing.push(field);
    }

    if (missing.length > 0) {
      return { name: 'Jäger API', status: 'warn', detail: `Fehlende Felder: ${missing.join(', ')} │ Beispiel: "${product.name}"` };
    }

    return { name: 'Jäger API', status: 'ok', detail: `Produkte erreichbar │ Beispiel: "${product.name}"` };
  } catch (err) {
    return { name: 'Jäger API', status: 'fail', detail: `Netzwerkfehler: ${(err as Error).message}` };
  }
}

// ---------------------------------------------------------------------------
// Test: WooCommerce API (Auth)
// ---------------------------------------------------------------------------

async function testWooCommerceApi(): Promise<ApiResult> {
  const url = `${WP_URL}/wp-json/wc/v3/products?per_page=1`;
  const auth = Buffer.from(`${env.WC_CONSUMER_KEY}:${env.WC_CONSUMER_SECRET}`).toString('base64');
  try {
    const { status } = await fetchJson(url, { Authorization: `Basic ${auth}` });
    if (status === 401) return { name: 'WooCommerce API', status: 'fail', detail: 'Authentifizierung fehlgeschlagen (401)' };
    if (status !== 200) return { name: 'WooCommerce API', status: 'fail', detail: `HTTP ${status}` };
    return { name: 'WooCommerce API', status: 'ok', detail: 'Authentifizierung OK' };
  } catch (err) {
    return { name: 'WooCommerce API', status: 'fail', detail: `Netzwerkfehler: ${(err as Error).message}` };
  }
}

// ---------------------------------------------------------------------------
// Test: Blog
// ---------------------------------------------------------------------------

async function testBlogApi(): Promise<ApiResult> {
  const url = `${WP_URL}/wp-json/wp/v2/posts?per_page=1`;
  try {
    const { status } = await fetchJson(url);
    if (status !== 200) return { name: 'Blog', status: 'fail', detail: `HTTP ${status}` };
    return { name: 'Blog', status: 'ok', detail: 'Blog-Endpunkt erreichbar' };
  } catch (err) {
    return { name: 'Blog', status: 'fail', detail: `Netzwerkfehler: ${(err as Error).message}` };
  }
}

// ---------------------------------------------------------------------------
// Output
// ---------------------------------------------------------------------------

function icon(s: Status): string {
  return s === 'ok' ? '✅' : s === 'warn' ? '⚠️' : '❌';
}

function printResults(pageResults: PageResult[], apiResults: ApiResult[]) {
  console.log('');
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║     Bodenjäger WordPress API Test            ║');
  console.log('╚══════════════════════════════════════════════╝');
  console.log('');

  // Pages
  console.log('📄 WORDPRESS SEITEN');
  console.log('─────────────────────────────────────────────');
  for (const r of pageResults) {
    const slug = pad(r.slug, 42);
    if (r.status === 'fail') {
      console.log(`${icon(r.status)}  ${slug} │ ${r.error}`);
    } else {
      let line = `${icon(r.status)}  ${slug} │ ${r.title ?? r.label} │ ${r.charCount} Zeichen`;
      if (r.elementor) line += ' │ Elementor erkannt!';
      console.log(line);
    }
  }
  console.log('');

  // API results grouped
  const jaeger = apiResults.find(r => r.name === 'Jäger API');
  const woo = apiResults.find(r => r.name === 'WooCommerce API');
  const blog = apiResults.find(r => r.name === 'Blog');

  if (jaeger) {
    console.log('🛒 JÄGER API');
    console.log('─────────────────────────────────────────────');
    console.log(`${icon(jaeger.status)}  ${jaeger.detail}`);
    console.log('');
  }

  if (woo) {
    console.log('🔐 WOOCOMMERCE API');
    console.log('─────────────────────────────────────────────');
    console.log(`${icon(woo.status)}  ${woo.detail}`);
    console.log('');
  }

  if (blog) {
    console.log('📝 BLOG');
    console.log('─────────────────────────────────────────────');
    console.log(`${icon(blog.status)}  ${blog.detail}`);
    console.log('');
  }

  // Summary
  const allResults = [
    ...pageResults.map(r => r.status),
    ...apiResults.map(r => r.status),
  ];
  const okCount = allResults.filter(s => s === 'ok').length;
  const warnCount = allResults.filter(s => s === 'warn').length;
  const failCount = allResults.filter(s => s === 'fail').length;
  const total = allResults.length;

  console.log('══════════════════════════════════════════════');
  console.log(`ERGEBNIS: ${okCount}/${total} OK │ ${failCount} Fehler │ ${warnCount} Warnungen`);
  console.log('══════════════════════════════════════════════');
  console.log('');

  if (failCount > 0) process.exit(1);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const pageResults = await Promise.all(PAGES.map(testPage));
  const apiResults = await Promise.all([testJaegerApi(), testWooCommerceApi(), testBlogApi()]);
  printResults(pageResults, apiResults);
}

main();
