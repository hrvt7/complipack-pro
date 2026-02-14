/**
 * AI Packaging Suggestion Algorithm
 * 
 * Finds the smallest box that is PPWR-compliant (< 40% void space).
 * Uses a rule-based approach with incremental buffer sizing.
 */

export interface PackagingSuggestion {
  packLength: number;
  packWidth: number;
  packHeight: number;
  voidSpace: number;
  ppwrCompliant: boolean;
}

/**
 * Calculate void space percentage given product and packaging dimensions.
 */
export function calculateVoidSpace(
  productL: number, productW: number, productH: number,
  packL: number, packW: number, packH: number
): number {
  const productVolume = productL * productW * productH;
  const packVolume = packL * packW * packH;
  if (packVolume <= 0) return 100;
  return Math.round(((packVolume - productVolume) / packVolume) * 100);
}

/**
 * Suggest optimal packaging dimensions for a product.
 * 
 * Strategy:
 * - Start with minimum buffer (0.5cm per side = 1cm total per dimension)
 * - Increment by 0.5cm until we find a PPWR-compliant fit (< 40% void space)
 * - If product is very small, the minimum buffer may already exceed 40% — 
 *   in that case, use the tightest possible fit (0.5cm buffer)
 * 
 * The algorithm ensures physical feasibility (minimum 0.5cm clearance per side)
 * while optimizing for PPWR compliance.
 */
export function suggestPackaging(
  lengthCm: number,
  widthCm: number,
  heightCm: number
): PackagingSuggestion {
  const MIN_BUFFER = 0.5; // minimum clearance per side (cm)
  const MAX_BUFFER = 10;  // maximum buffer to try per side (cm)
  const STEP = 0.5;
  const PPWR_THRESHOLD = 40;

  // For very small items, even minimum buffer gives high void space.
  // Start with minimum and find the sweet spot.
  let bestSuggestion: PackagingSuggestion | null = null;

  for (let buffer = MIN_BUFFER; buffer <= MAX_BUFFER; buffer += STEP) {
    const packL = Math.round((lengthCm + buffer * 2) * 10) / 10;
    const packW = Math.round((widthCm + buffer * 2) * 10) / 10;
    const packH = Math.round((heightCm + buffer * 2) * 10) / 10;
    const voidSpace = calculateVoidSpace(lengthCm, widthCm, heightCm, packL, packW, packH);
    const ppwrCompliant = voidSpace < PPWR_THRESHOLD;

    const suggestion: PackagingSuggestion = {
      packLength: packL,
      packWidth: packW,
      packHeight: packH,
      voidSpace,
      ppwrCompliant,
    };

    // If compliant, this is the tightest compliant box — return it
    if (ppwrCompliant) {
      return suggestion;
    }

    // Track the tightest fit as fallback
    if (!bestSuggestion || voidSpace < bestSuggestion.voidSpace) {
      bestSuggestion = suggestion;
    }
  }

  // If no compliant box found (very small items), return tightest fit
  return bestSuggestion ?? {
    packLength: Math.round((lengthCm + MIN_BUFFER * 2) * 10) / 10,
    packWidth: Math.round((widthCm + MIN_BUFFER * 2) * 10) / 10,
    packHeight: Math.round((heightCm + MIN_BUFFER * 2) * 10) / 10,
    voidSpace: calculateVoidSpace(
      lengthCm, widthCm, heightCm,
      lengthCm + MIN_BUFFER * 2, widthCm + MIN_BUFFER * 2, heightCm + MIN_BUFFER * 2
    ),
    ppwrCompliant: false,
  };
}

/**
 * Batch suggest packaging for multiple products.
 */
export function suggestPackagingBatch(
  products: Array<{ id: string; length_cm: number; width_cm: number; height_cm: number }>
): Map<string, PackagingSuggestion> {
  const results = new Map<string, PackagingSuggestion>();
  for (const product of products) {
    results.set(product.id, suggestPackaging(product.length_cm, product.width_cm, product.height_cm));
  }
  return results;
}
