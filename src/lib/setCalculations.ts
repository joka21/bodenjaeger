/**
 * Set Calculations for Floor Product Bundles
 *
 * Handles quantity and price calculations for floor sets including:
 * - Floor (Boden)
 * - Insulation (Dämmung)
 * - Baseboards (Sockelleisten)
 */

import type { StoreApiProduct } from './woocommerce';

/**
 * Calculate required packages for a given area and package content
 */
export function calculatePackages(targetM2: number, paketinhalt: number): number {
  return Math.ceil(targetM2 / paketinhalt);
}

/**
 * Calculate required linear meters for baseboards
 * Formula: m² × 0.6 = lfm (assumes perimeter calculation)
 */
export function calculateBaseboard_lfm(floorM2: number): number {
  return floorM2 * 0.6;
}

/**
 * Calculate floor quantity with Verschnitt (waste factor)
 */
export interface FloorQuantityCalculation {
  wantedM2: number;          // User input
  verschnitt: number;        // Waste percentage
  targetM2: number;          // With waste
  paketinhalt: number;       // Package content
  packages: number;          // Packages needed
  actualM2: number;          // Actual m² after packages
}

export function calculateFloorQuantity(
  wantedM2: number,
  verschnitt: number,
  paketinhalt: number
): FloorQuantityCalculation {
  // Calculate packages directly from wanted m² without adding verschnitt first
  // The verschnitt is automatically included by rounding up packages
  const packages = calculatePackages(wantedM2, paketinhalt);
  const actualM2 = packages * paketinhalt;
  const targetM2 = wantedM2; // Target is what user wants, not including extra verschnitt

  return {
    wantedM2,
    verschnitt,
    targetM2,
    paketinhalt,
    packages,
    actualM2,
  };
}

/**
 * Calculate insulation (Dämmung) quantity
 * Can use either user-specified m² or default to floor m²
 */
export interface InsulationQuantityCalculation {
  requiredM2: number;        // User-specified or floor m²
  paketinhalt: number;       // Insulation package content
  packages: number;          // Packages needed
  actualM2: number;          // Actual m² after packages
}

export function calculateInsulationQuantity(
  wantedM2: number,
  insulationPaketinhalt: number
): InsulationQuantityCalculation {
  const packages = calculatePackages(wantedM2, insulationPaketinhalt);
  const actualM2 = packages * insulationPaketinhalt;

  return {
    requiredM2: wantedM2,
    paketinhalt: insulationPaketinhalt,
    packages,
    actualM2,
  };
}

/**
 * Calculate baseboard (Sockelleisten) quantity
 * Can use either user-specified lfm or default calculated from floor m²
 */
export interface BaseboardQuantityCalculation {
  requiredLfm: number;       // User-specified or calculated from floor m²
  paketinhalt: number;       // Baseboard package content in lfm
  packages: number;          // Packages needed
  actualLfm: number;         // Actual lfm after packages
}

export function calculateBaseboardQuantity(
  wantedLfm: number,
  baseboardPaketinhalt: number
): BaseboardQuantityCalculation {
  const packages = calculatePackages(wantedLfm, baseboardPaketinhalt);
  const actualLfm = packages * baseboardPaketinhalt;

  return {
    requiredLfm: wantedLfm,
    paketinhalt: baseboardPaketinhalt,
    packages,
    actualLfm,
  };
}

/**
 * Complete set quantity calculation
 */
export interface SetQuantityCalculation {
  floor: FloorQuantityCalculation;
  insulation: InsulationQuantityCalculation | null;
  baseboard: BaseboardQuantityCalculation | null;
}

export function calculateSetQuantities(
  wantedM2: number,
  floorProduct: StoreApiProduct,
  insulationProduct: StoreApiProduct | null,
  baseboardProduct: StoreApiProduct | null,
  customInsulationM2?: number,
  customBaseboardLfm?: number
): SetQuantityCalculation {
  // Floor calculation
  const verschnitt = floorProduct.jaeger_meta?.verschnitt || 0;
  const floorPaketinhalt = floorProduct.jaeger_meta?.paketinhalt || 1;
  const floor = calculateFloorQuantity(wantedM2, verschnitt, floorPaketinhalt);

  // Insulation calculation (if product exists)
  let insulation: InsulationQuantityCalculation | null = null;
  if (insulationProduct && insulationProduct.jaeger_meta?.paketinhalt) {
    // Use custom m² if provided, otherwise default to floor m²
    const insulationM2 = customInsulationM2 !== undefined ? customInsulationM2 : wantedM2;
    insulation = calculateInsulationQuantity(
      insulationM2,
      insulationProduct.jaeger_meta.paketinhalt
    );
  }

  // Baseboard calculation (if product exists)
  let baseboard: BaseboardQuantityCalculation | null = null;
  if (baseboardProduct && baseboardProduct.jaeger_meta?.paketinhalt) {
    // Use custom lfm if provided, otherwise calculate from floor m²
    const baseboardLfm = customBaseboardLfm !== undefined
      ? customBaseboardLfm
      : calculateBaseboard_lfm(wantedM2);
    baseboard = calculateBaseboardQuantity(
      baseboardLfm,
      baseboardProduct.jaeger_meta.paketinhalt
    );
  }

  return {
    floor,
    insulation,
    baseboard,
  };
}

/**
 * Price calculation for display (per m²/lfm)
 */
export interface SetPriceCalculation {
  // Floor prices
  floorPricePerM2: number;           // Active price (sale or regular) per m²
  floorRegularPricePerM2: number;    // Regular price per m²
  floorUvpPerM2?: number;            // UVP per m² (if available)

  // Insulation prices
  insulationPricePerM2: number;      // Active price per m²
  insulationUvpPerM2?: number;       // UVP per m² (if available)
  insulationSurcharge: number;       // Surcharge compared to standard (per m²)

  // Baseboard prices
  baseboardPricePerLfm: number;      // Active price per lfm
  baseboardUvpPerLfm?: number;       // UVP per lfm (if available)
  baseboardSurcharge: number;        // Surcharge compared to standard (per lfm)

  // Total display price
  displayPricePerM2: number;         // Combined price per m² for display
  totalDisplayPrice: number;         // Total price for wanted m²

  // Comparison prices
  comparisonPriceTotal?: number;     // UVP total if available
  savings?: number;                  // Savings in €
  savingsPercent?: number;           // Savings in %
}

/**
 * Get active price per unit (m² or lfm) from product
 */
function getPricePerUnit(product: StoreApiProduct): number {
  const meta = product.jaeger_meta;
  if (!meta) return 0;

  const paketinhalt = meta.paketinhalt || 1;
  const paketpreis = meta.paketpreis || 0;
  const paketpreisS = meta.paketpreis_s;

  // Use sale price if available
  const activePrice = (paketpreisS !== undefined && paketpreisS !== null && paketpreisS > 0)
    ? paketpreisS
    : paketpreis;

  return activePrice / paketinhalt;
}

/**
 * Get UVP per unit if available
 */
function getUvpPerUnit(product: StoreApiProduct): number | undefined {
  const meta = product.jaeger_meta;
  if (!meta || !meta.show_uvp) return undefined;
  return meta.uvp && meta.uvp > 0 ? meta.uvp : undefined;
}

/**
 * Calculate set prices for display
 */
export function calculateSetPrices(
  quantities: SetQuantityCalculation,
  floorProduct: StoreApiProduct,
  standardInsulation: StoreApiProduct | null,
  selectedInsulation: StoreApiProduct | null,
  standardBaseboard: StoreApiProduct | null,
  selectedBaseboard: StoreApiProduct | null
): SetPriceCalculation {
  // Floor prices
  const floorPricePerM2 = getPricePerUnit(floorProduct);
  const floorPaketpreis = floorProduct.jaeger_meta?.paketpreis || 0;
  const floorPaketinhalt = floorProduct.jaeger_meta?.paketinhalt || 1;
  const floorRegularPricePerM2 = floorPaketpreis / floorPaketinhalt;
  const floorUvpPerM2 = getUvpPerUnit(floorProduct);

  // Insulation prices and surcharge
  let insulationPricePerM2 = 0;
  let insulationUvpPerM2: number | undefined;
  let insulationSurcharge = 0;

  if (selectedInsulation) {
    insulationPricePerM2 = getPricePerUnit(selectedInsulation);
    insulationUvpPerM2 = getUvpPerUnit(selectedInsulation);

    if (standardInsulation) {
      const standardPrice = getPricePerUnit(standardInsulation);
      insulationSurcharge = Math.max(0, insulationPricePerM2 - standardPrice);
    }
  }

  // Baseboard prices and surcharge
  let baseboardPricePerLfm = 0;
  let baseboardUvpPerLfm: number | undefined;
  let baseboardSurcharge = 0;

  if (selectedBaseboard) {
    baseboardPricePerLfm = getPricePerUnit(selectedBaseboard);
    baseboardUvpPerLfm = getUvpPerUnit(selectedBaseboard);

    if (standardBaseboard) {
      const standardPrice = getPricePerUnit(standardBaseboard);
      baseboardSurcharge = Math.max(0, baseboardPricePerLfm - standardPrice);
    }
  }

  // Calculate total display price by summing actual costs
  // Floor: packages × package price (reuse floorPaketpreis from above)
  const floorPaketpreisS = floorProduct.jaeger_meta?.paketpreis_s;
  const floorActivePackagePrice = (floorPaketpreisS !== undefined && floorPaketpreisS !== null && floorPaketpreisS > 0)
    ? floorPaketpreisS
    : floorPaketpreis;
  const floorTotalPrice = floorActivePackagePrice * quantities.floor.packages;

  // Insulation: packages × package price (only if selected)
  let insulationTotalPrice = 0;
  if (selectedInsulation && quantities.insulation) {
    const insulationPaketpreis = selectedInsulation.jaeger_meta?.paketpreis || 0;
    const insulationPaketpreisS = selectedInsulation.jaeger_meta?.paketpreis_s;
    const insulationActivePackagePrice = (insulationPaketpreisS !== undefined && insulationPaketpreisS !== null && insulationPaketpreisS > 0)
      ? insulationPaketpreisS
      : insulationPaketpreis;
    insulationTotalPrice = insulationActivePackagePrice * quantities.insulation.packages;
  }

  // Baseboard: packages × package price (only if selected)
  let baseboardTotalPrice = 0;
  if (selectedBaseboard && quantities.baseboard) {
    const baseboardPaketpreis = selectedBaseboard.jaeger_meta?.paketpreis || 0;
    const baseboardPaketpreisS = selectedBaseboard.jaeger_meta?.paketpreis_s;
    const baseboardActivePackagePrice = (baseboardPaketpreisS !== undefined && baseboardPaketpreisS !== null && baseboardPaketpreisS > 0)
      ? baseboardPaketpreisS
      : baseboardPaketpreis;
    baseboardTotalPrice = baseboardActivePackagePrice * quantities.baseboard.packages;
  }

  // Total display price
  const totalDisplayPrice = floorTotalPrice + insulationTotalPrice + baseboardTotalPrice;

  // Display price per m² for UI (total / wanted m²)
  const displayPricePerM2 = totalDisplayPrice / quantities.floor.wantedM2;

  // Comparison price (UVP) if available - uses regular package prices
  let comparisonPriceTotal: number | undefined;
  let savings: number | undefined;
  let savingsPercent: number | undefined;

  // Floor regular price (without sale)
  const floorRegularTotal = floorPaketpreis * quantities.floor.packages;
  comparisonPriceTotal = floorRegularTotal;

  // Insulation regular price
  if (selectedInsulation && quantities.insulation) {
    const insulationRegularPaketpreis = selectedInsulation.jaeger_meta?.paketpreis || 0;
    comparisonPriceTotal += insulationRegularPaketpreis * quantities.insulation.packages;
  }

  // Baseboard regular price
  if (selectedBaseboard && quantities.baseboard) {
    const baseboardRegularPaketpreis = selectedBaseboard.jaeger_meta?.paketpreis || 0;
    comparisonPriceTotal += baseboardRegularPaketpreis * quantities.baseboard.packages;
  }

  // Calculate savings
  if (comparisonPriceTotal > totalDisplayPrice) {
    savings = comparisonPriceTotal - totalDisplayPrice;
    savingsPercent = (savings / comparisonPriceTotal) * 100;
  } else {
    comparisonPriceTotal = undefined;
  }

  return {
    floorPricePerM2,
    floorRegularPricePerM2,
    floorUvpPerM2,
    insulationPricePerM2,
    insulationUvpPerM2,
    insulationSurcharge,
    baseboardPricePerLfm,
    baseboardUvpPerLfm,
    baseboardSurcharge,
    displayPricePerM2,
    totalDisplayPrice,
    comparisonPriceTotal,
    savings,
    savingsPercent,
  };
}

/**
 * Cart item for set bundle
 */
export interface SetCartItem {
  floor: {
    product: StoreApiProduct;
    packages: number;
  };
  insulation: {
    product: StoreApiProduct;
    packages: number;
  } | null;
  baseboard: {
    product: StoreApiProduct;
    packages: number;
  } | null;
}

/**
 * Prepare set for cart
 */
export function prepareSetForCart(
  quantities: SetQuantityCalculation,
  floorProduct: StoreApiProduct,
  insulationProduct: StoreApiProduct | null,
  baseboardProduct: StoreApiProduct | null
): SetCartItem {
  return {
    floor: {
      product: floorProduct,
      packages: quantities.floor.packages,
    },
    insulation: insulationProduct && quantities.insulation ? {
      product: insulationProduct,
      packages: quantities.insulation.packages,
    } : null,
    baseboard: baseboardProduct && quantities.baseboard ? {
      product: baseboardProduct,
      packages: quantities.baseboard.packages,
    } : null,
  };
}
