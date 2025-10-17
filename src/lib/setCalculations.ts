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
  const targetM2 = wantedM2 * (1 + verschnitt / 100);
  const packages = calculatePackages(targetM2, paketinhalt);
  const actualM2 = packages * paketinhalt;

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
 * Uses the same m² as floor but different package content
 */
export interface InsulationQuantityCalculation {
  requiredM2: number;        // Same as floor actualM2
  paketinhalt: number;       // Insulation package content
  packages: number;          // Packages needed
  actualM2: number;          // Actual m² after packages
}

export function calculateInsulationQuantity(
  floorActualM2: number,
  insulationPaketinhalt: number
): InsulationQuantityCalculation {
  const packages = calculatePackages(floorActualM2, insulationPaketinhalt);
  const actualM2 = packages * insulationPaketinhalt;

  return {
    requiredM2: floorActualM2,
    paketinhalt: insulationPaketinhalt,
    packages,
    actualM2,
  };
}

/**
 * Calculate baseboard (Sockelleisten) quantity
 * Uses lfm (linear meters) instead of m²
 */
export interface BaseboardQuantityCalculation {
  requiredLfm: number;       // Calculated from floor m²
  paketinhalt: number;       // Baseboard package content in lfm
  packages: number;          // Packages needed
  actualLfm: number;         // Actual lfm after packages
}

export function calculateBaseboardQuantity(
  floorActualM2: number,
  baseboardPaketinhalt: number
): BaseboardQuantityCalculation {
  const requiredLfm = calculateBaseboard_lfm(floorActualM2);
  const packages = calculatePackages(requiredLfm, baseboardPaketinhalt);
  const actualLfm = packages * baseboardPaketinhalt;

  return {
    requiredLfm,
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
  baseboardProduct: StoreApiProduct | null
): SetQuantityCalculation {
  // Floor calculation
  const verschnitt = floorProduct.jaeger_meta?.verschnitt || 0;
  const floorPaketinhalt = floorProduct.jaeger_meta?.paketinhalt || 1;
  const floor = calculateFloorQuantity(wantedM2, verschnitt, floorPaketinhalt);

  // Insulation calculation (if product exists)
  let insulation: InsulationQuantityCalculation | null = null;
  if (insulationProduct && insulationProduct.jaeger_meta?.paketinhalt) {
    insulation = calculateInsulationQuantity(
      floor.actualM2,
      insulationProduct.jaeger_meta.paketinhalt
    );
  }

  // Baseboard calculation (if product exists)
  let baseboard: BaseboardQuantityCalculation | null = null;
  if (baseboardProduct && baseboardProduct.jaeger_meta?.paketinhalt) {
    baseboard = calculateBaseboardQuantity(
      floor.actualM2,
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

  // Display price per m² (floor + surcharges)
  const displayPricePerM2 = floorPricePerM2 + insulationSurcharge + baseboardSurcharge;
  const totalDisplayPrice = displayPricePerM2 * quantities.floor.wantedM2;

  // Comparison price (UVP) if available
  let comparisonPriceTotal: number | undefined;
  let savings: number | undefined;
  let savingsPercent: number | undefined;

  if (floorUvpPerM2) {
    comparisonPriceTotal = floorUvpPerM2 * quantities.floor.wantedM2;

    if (insulationUvpPerM2 && quantities.insulation) {
      comparisonPriceTotal += insulationUvpPerM2 * quantities.floor.wantedM2;
    }

    if (baseboardUvpPerLfm && quantities.baseboard) {
      const baseboardLfm = calculateBaseboard_lfm(quantities.floor.wantedM2);
      comparisonPriceTotal += baseboardUvpPerLfm * baseboardLfm;
    }

    savings = comparisonPriceTotal - totalDisplayPrice;
    savingsPercent = (savings / comparisonPriceTotal) * 100;
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
