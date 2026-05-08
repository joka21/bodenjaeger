/**
 * WooCommerce Order Attribution Tracking
 *
 * Sammelt Quelle/UTM/Referrer der Customer-Journey und stellt sie
 * im WC-Admin via Standard `_wc_order_attribution_*`-Meta-Keys bereit
 * (WooCommerce 8.5+ Native Order Attribution).
 *
 * Session-Modell:
 *   - 30 Min Inaktivität → neue Session
 *   - UTM-Parameter in URL → neue Session (Last-Touch)
 *
 * DSGVO: Persistierung NUR mit `analytics`-Consent (siehe AttributionTracker.tsx).
 *
 * Diese Datei wird sowohl client- als auch serverseitig importiert.
 * Browser-API-Aufrufe (window/document/localStorage) sind in den
 * jeweiligen Funktionen lokal — nicht beim Modul-Top-Level.
 * `buildOrderMetaData` ist eine reine Funktion ohne Browser-Abhängigkeiten.
 */

export type SourceType = 'typein' | 'organic' | 'referral' | 'utm';
export type DeviceType = 'Mobile' | 'Tablet' | 'Desktop';

export interface AttributionData {
  source_type: SourceType;
  referrer: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
  utm_id: string;
  session_entry: string;
  session_start_time: string; // "YYYY-MM-DD HH:MM:SS" (UTC)
  session_pages: number;
  session_count: number;
  user_agent: string;
  device_type: DeviceType;
  last_activity: number; // Unix-ms — nur intern für 30-Min-Logik
}

const STORAGE_KEY = 'bodenjaeger-attribution';
const SESSION_TIMEOUT_MS = 30 * 60 * 1000;

const SEARCH_ENGINES = [
  'google.',
  'bing.',
  'duckduckgo.',
  'ecosia.',
  'yahoo.',
  'yandex.',
  'baidu.',
  'startpage.',
  'qwant.',
  'brave.com',
];

// ============================================================================
// Pure helpers (server-safe)
// ============================================================================

export function detectSourceType(
  referrer: string,
  urlParams: URLSearchParams,
  ownHostname: string
): SourceType {
  const hasUTM =
    !!urlParams.get('utm_source') ||
    !!urlParams.get('utm_medium') ||
    !!urlParams.get('utm_campaign');

  if (hasUTM) return 'utm';

  if (referrer) {
    let referrerHost = '';
    try {
      referrerHost = new URL(referrer).hostname.toLowerCase();
    } catch {
      referrerHost = '';
    }

    if (referrerHost) {
      const isSearchEngine = SEARCH_ENGINES.some((engine) => referrerHost.includes(engine));
      if (isSearchEngine) return 'organic';
      if (referrerHost !== ownHostname.toLowerCase()) return 'referral';
    }
  }

  return 'typein';
}

export function detectDeviceType(userAgent: string): DeviceType {
  if (/Mobile|iPhone|Android.*Mobile/i.test(userAgent)) return 'Mobile';
  if (/iPad|Android(?!.*Mobile)|Tablet/i.test(userAgent)) return 'Tablet';
  return 'Desktop';
}

export function parseUTMs(
  searchParams: URLSearchParams
): Pick<
  AttributionData,
  'utm_source' | 'utm_medium' | 'utm_campaign' | 'utm_content' | 'utm_term' | 'utm_id'
> {
  return {
    utm_source: searchParams.get('utm_source') ?? '',
    utm_medium: searchParams.get('utm_medium') ?? '',
    utm_campaign: searchParams.get('utm_campaign') ?? '',
    utm_content: searchParams.get('utm_content') ?? '',
    utm_term: searchParams.get('utm_term') ?? '',
    utm_id: searchParams.get('utm_id') ?? '',
  };
}

export function isSessionExpired(data: AttributionData): boolean {
  return Date.now() - data.last_activity > SESSION_TIMEOUT_MS;
}

/**
 * ISO 8601 UTC im WooCommerce-Format "YYYY-MM-DD HH:MM:SS"
 */
function formatUTC(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return (
    `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())} ` +
    `${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}`
  );
}

// ============================================================================
// Browser-only (lazy — Aufruf serverseitig wirft kein Fehler beim Import)
// ============================================================================

export function loadAttribution(): AttributionData | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AttributionData;
  } catch {
    return null;
  }
}

export function saveAttribution(data: AttributionData): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore quota errors
  }
}

export function clearAttribution(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

/**
 * Erfasst die aktuelle Browser-Umgebung als neue Session.
 * Nur clientseitig aufrufbar.
 */
export function captureAttribution(): AttributionData {
  const url = new URL(window.location.href);
  const params = url.searchParams;
  const referrer = document.referrer || '';
  const userAgent = navigator.userAgent || '';
  const now = new Date();

  return {
    source_type: detectSourceType(referrer, params, url.hostname),
    referrer,
    ...parseUTMs(params),
    session_entry: window.location.href,
    session_start_time: formatUTC(now),
    session_pages: 1,
    session_count: 1,
    user_agent: userAgent,
    device_type: detectDeviceType(userAgent),
    last_activity: now.getTime(),
  };
}

/**
 * Bei jedem Page-View aufgerufen. Entscheidet, ob bestehende Session
 * fortgeführt oder eine neue gestartet wird.
 *
 * Neue Session wenn:
 *   - existing === null
 *   - Session abgelaufen (>30 Min Inaktivität)
 *   - URL enthält UTM-Parameter (Last-Touch)
 */
export function updateOnPageView(
  existing: AttributionData | null,
  currentUTMsInURL: boolean
): AttributionData {
  if (existing === null) {
    return captureAttribution();
  }

  if (isSessionExpired(existing) || currentUTMsInURL) {
    const fresh = captureAttribution();
    fresh.session_count = existing.session_count + 1;
    return fresh;
  }

  // Bestehende Session fortführen — Source/UTMs NICHT überschreiben
  return {
    ...existing,
    session_pages: existing.session_pages + 1,
    last_activity: Date.now(),
  };
}

// ============================================================================
// Order Meta-Data (server-importierbar)
// ============================================================================

/**
 * Baut das Array für `meta_data` der WC-Order, mit den Standard-WC-Keys
 * `_wc_order_attribution_*`. WooCommerce 8.5+ erkennt diese automatisch
 * und zeigt den Ursprung in der Admin-Ansicht.
 *
 * Reine Funktion — keine Browser-APIs. Serverseitig importierbar.
 */
export function buildOrderMetaData(
  data: AttributionData
): Array<{ key: string; value: string }> {
  return [
    { key: '_wc_order_attribution_source_type', value: data.source_type },
    { key: '_wc_order_attribution_referrer', value: data.referrer },
    { key: '_wc_order_attribution_utm_source', value: data.utm_source },
    { key: '_wc_order_attribution_utm_medium', value: data.utm_medium },
    { key: '_wc_order_attribution_utm_campaign', value: data.utm_campaign },
    { key: '_wc_order_attribution_utm_content', value: data.utm_content },
    { key: '_wc_order_attribution_utm_term', value: data.utm_term },
    { key: '_wc_order_attribution_utm_id', value: data.utm_id },
    { key: '_wc_order_attribution_session_entry', value: data.session_entry },
    { key: '_wc_order_attribution_session_start_time', value: data.session_start_time },
    { key: '_wc_order_attribution_session_pages', value: data.session_pages.toString() },
    { key: '_wc_order_attribution_session_count', value: data.session_count.toString() },
    { key: '_wc_order_attribution_user_agent', value: data.user_agent },
    { key: '_wc_order_attribution_device_type', value: data.device_type },
  ];
}
