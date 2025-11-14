/**
 * Jaeger Backend API Client
 *
 * TypeScript Client für Set-Angebot Berechnungen
 * Frontend: Next.js
 * Backend: WordPress Jaeger Plugin
 *
 * @package Bodenjäger
 * @since 1.1.0
 */

// ==============================================
// TYPE DEFINITIONS
// ==============================================

/**
 * Request-Parameter für Set-Berechnungen
 */
export interface SetCalculationRequest {
  wantedM2: number;
  floorProductId: number;
  insulationProductId?: number;
  baseboardProductId?: number;
}

/**
 * Mengen-Berechnung Response
 */
export interface QuantitiesResponse {
  floor: {
    packages: number;
    actualM2: number;
    wantedM2: number;
    paketinhalt: number;
    wasteM2: number;
  };
  insulation: {
    packages: number;
    actualM2: number;
    neededM2: number;
    paketinhalt: number;
  } | null;
  baseboard: {
    packages: number;
    actualLfm: number;
    neededLfm: number;
    paketinhalt: number;
  } | null;
}

/**
 * Preis-Berechnung Response
 */
export interface PricesResponse {
  floorPrice: number;
  insulationSurcharge: number;
  baseboardSurcharge: number;
  totalDisplayPrice: number;
  comparisonPriceTotal: number | null;
  savings: number | null;
  savingsPercent: number | null;
  pricePerM2: number;
}

/**
 * Kombinierte Set-Berechnung Response
 */
export interface SetCalculationResponse {
  quantities: QuantitiesResponse;
  prices: PricesResponse;
}

/**
 * Warenkorb-Item
 */
export interface CartItem {
  productId: number;
  quantity: number;
  type: 'floor' | 'insulation' | 'baseboard';
  actualM2?: number;
  actualLfm?: number;
}

/**
 * Warenkorb-Vorbereitung Response
 */
export interface PrepareCartResponse {
  items: CartItem[];
  bundleId: string;
}

/**
 * API Error Response
 */
export interface ApiError {
  code: string;
  message: string;
  data?: {
    status: number;
  };
}

// ==============================================
// CONFIGURATION
// ==============================================

/**
 * API Base URL
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_WP_API_URL || 'https://plan-dein-ding.de/wp-json';
const API_NAMESPACE = 'jaeger/v1';

/**
 * Timeout für API-Requests (ms)
 */
const API_TIMEOUT = 10000;

// ==============================================
// HELPER FUNCTIONS
// ==============================================

/**
 * Fetch mit Timeout
 */
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = API_TIMEOUT): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

/**
 * API Request Handler
 */
async function apiRequest<T>(
  endpoint: string,
  method: 'GET' | 'POST' = 'POST',
  body?: unknown
): Promise<T> {
  const url = `${API_BASE_URL}/${API_NAMESPACE}${endpoint}`;

  try {
    const response = await fetchWithTimeout(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined
    });

    if (!response.ok) {
      // WordPress REST API Error Format
      const errorData: ApiError = await response.json();
      throw new Error(errorData.message || `API Error: ${response.status}`);
    }

    const data: T = await response.json();
    return data;

  } catch (error) {
    // Network Error oder Timeout
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('API Request timed out');
      }
      throw error;
    }
    throw new Error('Unknown API error');
  }
}

// ==============================================
// API FUNCTIONS
// ==============================================

/**
 * Mengenberechnung
 *
 * Berechnet Paketanzahl und tatsächliche Mengen für Floor, Insulation, Baseboard
 */
export async function calculateQuantities(
  params: SetCalculationRequest
): Promise<QuantitiesResponse> {
  return apiRequest<QuantitiesResponse>('/calculate-quantities', 'POST', params);
}

/**
 * Preisberechnung
 *
 * Berechnet Gesamtpreis, Aufschläge und Ersparnis
 */
export async function calculatePrices(
  params: SetCalculationRequest
): Promise<PricesResponse> {
  return apiRequest<PricesResponse>('/calculate-prices', 'POST', params);
}

/**
 * Kombinierte Set-Berechnung (Mengen + Preise)
 *
 * Dies ist die HAUPT-FUNKTION für Set-Angebote.
 * Liefert alle Daten für Produktanzeige und Warenkorb.
 */
export async function calculateSetBundle(
  params: SetCalculationRequest
): Promise<SetCalculationResponse> {
  return apiRequest<SetCalculationResponse>('/calculate-set', 'POST', params);
}

/**
 * Warenkorb-Vorbereitung
 *
 * Bereitet Set-Items für WooCommerce-Warenkorb vor
 */
export async function prepareCartItems(
  params: SetCalculationRequest
): Promise<PrepareCartResponse> {
  return apiRequest<PrepareCartResponse>('/prepare-cart', 'POST', params);
}
