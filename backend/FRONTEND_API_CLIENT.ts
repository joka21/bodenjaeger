/**
 * Jaeger Backend API Client
 *
 * TypeScript Client für Set-Angebot Berechnungen
 * Frontend: Next.js
 * Backend: WordPress Jaeger Plugin
 *
 * INSTALLATION:
 * Kopiere diese Datei nach: src/lib/api/jaegerApi.ts
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
 *
 * WICHTIG: Passe diese URL an deine WordPress-Installation an!
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
 *
 * @param params Berechnungsparameter
 * @returns Mengen-Daten
 *
 * @example
 * const quantities = await calculateQuantities({
 *   wantedM2: 26.7,
 *   floorProductId: 123,
 *   insulationProductId: 456,
 *   baseboardProductId: 789
 * });
 * console.log(`Benötigt: ${quantities.floor.packages} Pakete`);
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
 *
 * @param params Berechnungsparameter
 * @returns Preis-Daten
 *
 * @example
 * const prices = await calculatePrices({
 *   wantedM2: 26.7,
 *   floorProductId: 123,
 *   insulationProductId: 456,
 *   baseboardProductId: 789
 * });
 * console.log(`Gesamtpreis: ${prices.totalDisplayPrice}€`);
 * console.log(`Ersparnis: ${prices.savingsPercent}%`);
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
 *
 * @param params Berechnungsparameter
 * @returns Komplette Set-Daten (Mengen + Preise)
 *
 * @example
 * const setData = await calculateSetBundle({
 *   wantedM2: 26.7,
 *   floorProductId: 123,
 *   insulationProductId: 456,
 *   baseboardProductId: 789
 * });
 *
 * // Mengen anzeigen
 * console.log(`Pakete: ${setData.quantities.floor.packages}`);
 * console.log(`Tatsächliche m²: ${setData.quantities.floor.actualM2}`);
 *
 * // Preise anzeigen
 * console.log(`Gesamtpreis: ${setData.prices.totalDisplayPrice}€`);
 * console.log(`Ersparnis: ${setData.prices.savings}€ (${setData.prices.savingsPercent}%)`);
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
 *
 * @param params Berechnungsparameter
 * @returns Warenkorb-Items mit Produkt-IDs und Mengen
 *
 * @example
 * const cartData = await prepareCartItems({
 *   wantedM2: 26.7,
 *   floorProductId: 123,
 *   insulationProductId: 456,
 *   baseboardProductId: 789
 * });
 *
 * // Items zum Warenkorb hinzufügen
 * cartData.items.forEach(item => {
 *   addToCart(item.productId, item.quantity);
 * });
 */
export async function prepareCartItems(
  params: SetCalculationRequest
): Promise<PrepareCartResponse> {
  return apiRequest<PrepareCartResponse>('/prepare-cart', 'POST', params);
}

// ==============================================
// REACT HOOKS (Optional)
// ==============================================

/**
 * React Hook für Set-Berechnungen mit SWR
 *
 * VERWENDUNG MIT SWR:
 *
 * import useSWR from 'swr';
 *
 * export function useSetCalculation(params: SetCalculationRequest) {
 *   const { data, error, isLoading } = useSWR(
 *     params ? ['set-calculation', params] : null,
 *     () => calculateSetBundle(params),
 *     {
 *       revalidateOnFocus: false,
 *       dedupingInterval: 5000
 *     }
 *   );
 *
 *   return {
 *     setData: data,
 *     isLoading,
 *     isError: error
 *   };
 * }
 *
 * // Im Component:
 * const { setData, isLoading, isError } = useSetCalculation({
 *   wantedM2: 26.7,
 *   floorProductId: 123,
 *   insulationProductId: 456,
 *   baseboardProductId: 789
 * });
 */

// ==============================================
// EXAMPLE USAGE IN COMPONENT
// ==============================================

/**
 * BEISPIEL: Set-Angebot Component
 *
 * ```tsx
 * import { useState, useEffect } from 'react';
 * import { calculateSetBundle, SetCalculationResponse } from '@/lib/api/jaegerApi';
 *
 * export default function SetAngebotComponent({ floorProductId }: { floorProductId: number }) {
 *   const [wantedM2, setWantedM2] = useState(25);
 *   const [setData, setSetData] = useState<SetCalculationResponse | null>(null);
 *   const [loading, setLoading] = useState(false);
 *
 *   useEffect(() => {
 *     const fetchCalculation = async () => {
 *       setLoading(true);
 *       try {
 *         const data = await calculateSetBundle({
 *           wantedM2,
 *           floorProductId,
 *           insulationProductId: 456,  // Standard-Dämmung
 *           baseboardProductId: 789    // Standard-Sockelleiste
 *         });
 *         setSetData(data);
 *       } catch (error) {
 *         console.error('Calculation failed:', error);
 *       } finally {
 *         setLoading(false);
 *       }
 *     };
 *
 *     fetchCalculation();
 *   }, [wantedM2, floorProductId]);
 *
 *   if (loading) return <div>Wird berechnet...</div>;
 *   if (!setData) return null;
 *
 *   return (
 *     <div className="set-angebot">
 *       <h2>Set-Angebot</h2>
 *
 *       <div>
 *         <label>Gewünschte m²:</label>
 *         <input
 *           type="number"
 *           value={wantedM2}
 *           onChange={(e) => setWantedM2(parseFloat(e.target.value))}
 *         />
 *       </div>
 *
 *       <div className="quantities">
 *         <p>Pakete: {setData.quantities.floor.packages}</p>
 *         <p>Tatsächliche m²: {setData.quantities.floor.actualM2}</p>
 *       </div>
 *
 *       <div className="prices">
 *         <p className="total-price">{setData.prices.totalDisplayPrice}€</p>
 *         {setData.prices.savings && (
 *           <p className="savings">
 *             Sie sparen: {setData.prices.savings}€ ({setData.prices.savingsPercent}%)
 *           </p>
 *         )}
 *       </div>
 *
 *       <button onClick={() => addSetToCart(setData)}>
 *         In den Warenkorb
 *       </button>
 *     </div>
 *   );
 * }
 *
 * async function addSetToCart(setData: SetCalculationResponse) {
 *   const cartData = await prepareCartItems({
 *     wantedM2: setData.quantities.floor.wantedM2,
 *     floorProductId: 123,
 *     insulationProductId: 456,
 *     baseboardProductId: 789
 *   });
 *
 *   // WooCommerce Store API Integration
 *   for (const item of cartData.items) {
 *     await fetch('/wp-json/wc/store/v1/cart/add-item', {
 *       method: 'POST',
 *       headers: { 'Content-Type': 'application/json' },
 *       body: JSON.stringify({
 *         id: item.productId,
 *         quantity: item.quantity
 *       })
 *     });
 *   }
 * }
 * ```
 */

// ==============================================
// ENVIRONMENT VARIABLES
// ==============================================

/**
 * Erforderliche Environment Variables (.env.local):
 *
 * NEXT_PUBLIC_WP_API_URL=https://plan-dein-ding.de/wp-json
 *
 * Optional:
 * NEXT_PUBLIC_API_TIMEOUT=10000
 */
