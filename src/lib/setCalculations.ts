/**
 * Set Calculations for Floor Product Bundles
 *
 * ✅ NUR MENGENBERECHNUNG - KEINE PREISE!
 * Preise kommen DIREKT aus der Datenbank (product.jaeger_meta.setangebot_*)
 *
 * Berechnet nur:
 * - Floor packages (Boden-Pakete)
 * - Insulation packages (Dämmungs-Pakete)
 * - Baseboard packages (Sockelleisten-Pakete)
 */

import type { StoreApiProduct } from './woocommerce';

/**
 * Calculate required packages for a given area and package content
 * @param isFree - true = KOSTENLOS (Math.floor), false = AUFPREIS (Math.ceil)
 */
export function calculatePackages(
  targetM2: number,
  paketinhalt: number,
  isFree: boolean = false
): number {
  if (isFree) {
    // KOSTENLOS: ABRUNDEN → drunter bleiben (kundenfreundlich)
    return Math.floor(targetM2 / paketinhalt);
  } else {
    // AUFPREIS oder BODEN: AUFRUNDEN → drüber gehen (Kunde bekommt mehr)
    return Math.ceil(targetM2 / paketinhalt);
  }
}

/**
 * Calculate required linear meters for baseboards
 * Formula: m² × 1.0 = lfm
 *
 * Rationale: For typical room proportions, the perimeter (in meters)
 * approximately equals the floor area (in m²). This is a practical
 * rule of thumb used in the flooring industry.
 *
 * Example: A 26.7 m² room requires ~26.4 m of baseboard
 * (verified in Berechnung_Hintergund_Warenkorb_1_.xlsx)
 */
export function calculateBaseboard_lfm(floorM2: number): number {
  return floorM2 * 1.0;
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
  // BODEN immer AUFRUNDEN (isFree = false)
  const packages = calculatePackages(wantedM2, paketinhalt, false);
  const actualM2 = packages * paketinhalt;
  const targetM2 = wantedM2;

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
  isFree: boolean;           // KOSTENLOS oder AUFPREIS
}

export function calculateInsulationQuantity(
  wantedM2: number,
  insulationPaketinhalt: number,
  isFree: boolean = false
): InsulationQuantityCalculation {
  // KOSTENLOS: ABRUNDEN, AUFPREIS: AUFRUNDEN
  const packages = calculatePackages(wantedM2, insulationPaketinhalt, isFree);
  const actualM2 = packages * insulationPaketinhalt;

  return {
    requiredM2: wantedM2,
    paketinhalt: insulationPaketinhalt,
    packages,
    actualM2,
    isFree,
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
  isFree: boolean;           // KOSTENLOS oder AUFPREIS
}

export function calculateBaseboardQuantity(
  wantedLfm: number,
  baseboardPaketinhalt: number,
  isFree: boolean = false
): BaseboardQuantityCalculation {
  // KOSTENLOS: ABRUNDEN, AUFPREIS: AUFRUNDEN
  const packages = calculatePackages(wantedLfm, baseboardPaketinhalt, isFree);
  const actualLfm = packages * baseboardPaketinhalt;

  return {
    requiredLfm: wantedLfm,
    paketinhalt: baseboardPaketinhalt,
    packages,
    actualLfm,
    isFree,
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
  customBaseboardLfm?: number,
  standardInsulationProduct?: StoreApiProduct | null,
  standardBaseboardProduct?: StoreApiProduct | null
): SetQuantityCalculation {
  // Floor calculation - ✅ USE ROOT-LEVEL FIELDS
  const verschnitt = floorProduct.verschnitt || 0;
  const floorPaketinhalt = floorProduct.paketinhalt || 1;
  const floor = calculateFloorQuantity(wantedM2, verschnitt, floorPaketinhalt);

  // Insulation calculation (if product exists) - ✅ USE ROOT-LEVEL FIELDS
  let insulation: InsulationQuantityCalculation | null = null;
  if (insulationProduct && insulationProduct.paketinhalt) {
    // Calculate verrechnung (use backend value or calculate difference from standard)
    const insulationPrice = insulationProduct.price || 0;
    const standardInsulationPrice = standardInsulationProduct?.price || 0;
    const calculatedVerrechnung = insulationProduct.verrechnung ?? Math.max(0, insulationPrice - standardInsulationPrice);

    // Check if insulation is FREE (verrechnung = 0)
    const insulationIsFree = calculatedVerrechnung === 0;

    // Use custom m² if provided, otherwise default to floor m²
    const insulationM2 = customInsulationM2 !== undefined ? customInsulationM2 : wantedM2;
    insulation = calculateInsulationQuantity(
      insulationM2,
      insulationProduct.paketinhalt,
      insulationIsFree
    );
  }

  // Baseboard calculation (if product exists) - ✅ USE ROOT-LEVEL FIELDS
  let baseboard: BaseboardQuantityCalculation | null = null;
  if (baseboardProduct && baseboardProduct.paketinhalt) {
    // Calculate verrechnung (use backend value or calculate difference from standard)
    const baseboardPrice = baseboardProduct.price || 0;
    const standardBaseboardPrice = standardBaseboardProduct?.price || 0;
    const calculatedVerrechnung = baseboardProduct.verrechnung ?? Math.max(0, baseboardPrice - standardBaseboardPrice);

    // Check if baseboard is FREE (verrechnung = 0)
    const baseboardIsFree = calculatedVerrechnung === 0;

    // Use custom lfm if provided, otherwise calculate from floor m²
    const baseboardLfm = customBaseboardLfm !== undefined
      ? customBaseboardLfm
      : calculateBaseboard_lfm(wantedM2);
    baseboard = calculateBaseboardQuantity(
      baseboardLfm,
      baseboardProduct.paketinhalt,
      baseboardIsFree
    );
  }

  return {
    floor,
    insulation,
    baseboard,
  };
}

// ========================================
// PREISBERECHNUNG ENTFERNT
// ========================================
// Preise kommen DIREKT aus der Datenbank:
// - product.jaeger_meta.setangebot_einzelpreis
// - product.jaeger_meta.setangebot_gesamtpreis
// - product.jaeger_meta.setangebot_ersparnis_euro
// - product.jaeger_meta.setangebot_ersparnis_prozent ✅
//
// Keine Frontend-Berechnung mehr nötig!

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
