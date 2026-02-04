import { supabase } from "@/integrations/supabase/client";

export interface StandardBox {
  id: string;
  name: string;
  length_cm: number;
  width_cm: number;
  height_cm: number;
  volume_cm3: number;
  cost_eur: number;
}

export interface PPWRResult {
  recommendedBox: StandardBox;
  productVolume: number;
  boxVolume: number;
  voidSpace: number;
  isCompliant: boolean;
  explanation: string;
  costSaving?: number;
}

export interface DPPData {
  productName: string;
  dimensions: string;
  volume: number;
  materials: string;
  carbonFootprintKg: number;
  waterUsageLiters: number;
  recyclabilityScore: number;
  durabilityRating: number;
  careInstructions: string;
  repairInstructions: string;
  endOfLifeOptions: string;
}

// Fetch standard boxes from database
export const getStandardBoxes = async (): Promise<StandardBox[]> => {
  const { data, error } = await supabase
    .from('standard_boxes')
    .select('*')
    .order('volume_cm3', { ascending: true });

  if (error) throw error;

  return (data || []).map(box => ({
    id: box.id,
    name: box.name,
    length_cm: box.length_cm,
    width_cm: box.width_cm,
    height_cm: box.height_cm,
    volume_cm3: box.volume_cm3 || 0,
    cost_eur: parseFloat(String(box.cost_eur))
  }));
};

// Check if product fits in box (with 1cm padding on each side)
const productFitsInBox = (
  product: { length: number; width: number; height: number },
  box: StandardBox
): boolean => {
  const paddedLength = product.length + 2;
  const paddedWidth = product.width + 2;
  const paddedHeight = product.height + 2;

  // Sort dimensions to find best orientation
  const productDims = [paddedLength, paddedWidth, paddedHeight].sort((a, b) => b - a);
  const boxDims = [box.length_cm, box.width_cm, box.height_cm].sort((a, b) => b - a);

  return (
    productDims[0] <= boxDims[0] &&
    productDims[1] <= boxDims[1] &&
    productDims[2] <= boxDims[2]
  );
};

// Calculate PPWR compliance for a product
export const calculatePPWRCompliance = async (product: {
  length: number;
  width: number;
  height: number;
}): Promise<PPWRResult> => {
  const boxes = await getStandardBoxes();
  
  const productVolume = product.length * product.width * product.height;

  // Find smallest box that fits the product
  const fittingBoxes = boxes.filter(box => productFitsInBox(product, box));

  if (fittingBoxes.length === 0) {
    // Product too large for any standard box
    const largestBox = boxes[boxes.length - 1];
    return {
      recommendedBox: largestBox,
      productVolume,
      boxVolume: largestBox.volume_cm3,
      voidSpace: 100,
      isCompliant: false,
      explanation: 'Product exceeds maximum standard box dimensions. Custom packaging required.'
    };
  }

  const recommendedBox = fittingBoxes[0]; // Smallest fitting box
  const boxVolume = recommendedBox.volume_cm3;
  const voidSpace = Math.round(((boxVolume - productVolume) / boxVolume) * 100 * 100) / 100;
  const isCompliant = voidSpace < 40;

  // Calculate potential cost saving by using optimal box
  let costSaving: number | undefined;
  if (fittingBoxes.length > 1) {
    const currentBoxCost = fittingBoxes[1].cost_eur;
    costSaving = Math.round((currentBoxCost - recommendedBox.cost_eur) * 100) / 100;
  }

  return {
    recommendedBox,
    productVolume,
    boxVolume,
    voidSpace,
    isCompliant,
    explanation: isCompliant
      ? `Compliant: ${voidSpace}% void space is under the 40% PPWR threshold`
      : `Non-compliant: ${voidSpace}% void space exceeds the 40% PPWR threshold`,
    costSaving: costSaving && costSaving > 0 ? costSaving : undefined
  };
};

// Material-based recyclability scores
const materialRecyclability: Record<string, number> = {
  glass: 100,
  metal: 90,
  aluminum: 95,
  steel: 85,
  paper: 95,
  cardboard: 95,
  wood: 80,
  bamboo: 85,
  cotton: 60,
  wool: 55,
  textile: 50,
  fabric: 50,
  leather: 40,
  plastic: 35,
  polyester: 30,
  nylon: 25,
  rubber: 45,
  silicone: 50,
  ceramic: 70,
  porcelain: 70,
};

// Estimate recyclability score based on materials
const estimateRecyclability = (materials?: string): number => {
  if (!materials) return 50;

  const lower = materials.toLowerCase();
  let totalScore = 0;
  let matches = 0;

  for (const [material, score] of Object.entries(materialRecyclability)) {
    if (lower.includes(material)) {
      totalScore += score;
      matches++;
    }
  }

  if (matches === 0) return 50;
  return Math.round(totalScore / matches);
};

// Estimate carbon footprint based on volume and materials
const estimateCarbonFootprint = (volume: number, materials?: string): number => {
  // Base calculation: volume in liters * material factor
  const volumeLiters = volume / 1000;
  
  let materialFactor = 0.5; // Default factor
  
  if (materials) {
    const lower = materials.toLowerCase();
    if (lower.includes('plastic') || lower.includes('polyester')) materialFactor = 0.8;
    else if (lower.includes('metal') || lower.includes('steel')) materialFactor = 1.2;
    else if (lower.includes('cotton') || lower.includes('bamboo')) materialFactor = 0.3;
    else if (lower.includes('glass')) materialFactor = 0.9;
    else if (lower.includes('paper') || lower.includes('cardboard')) materialFactor = 0.2;
  }

  return Math.round(volumeLiters * materialFactor * 100) / 100;
};

// Estimate water usage based on volume
const estimateWaterUsage = (volume: number, materials?: string): number => {
  // Base: 1 liter of water per 10 cm³ of product
  let baseLiters = volume / 10;
  
  if (materials) {
    const lower = materials.toLowerCase();
    if (lower.includes('cotton')) baseLiters *= 2.5; // Cotton is water-intensive
    else if (lower.includes('paper')) baseLiters *= 1.5;
    else if (lower.includes('plastic')) baseLiters *= 0.8;
  }

  return Math.round(baseLiters);
};

// Generate DPP data for a product
export const generateDPPData = (product: {
  name: string;
  description?: string;
  length: number;
  width: number;
  height: number;
  materials?: string;
}): DPPData => {
  const volume = product.length * product.width * product.height;

  return {
    productName: product.name,
    dimensions: `${product.length}×${product.width}×${product.height} cm`,
    volume,
    materials: product.materials || 'Not specified',
    carbonFootprintKg: estimateCarbonFootprint(volume, product.materials),
    waterUsageLiters: estimateWaterUsage(volume, product.materials),
    recyclabilityScore: estimateRecyclability(product.materials),
    durabilityRating: 7, // Default estimate
    careInstructions: generateCareInstructions(product.materials),
    repairInstructions: 'Contact manufacturer for repair options. Check warranty terms before attempting self-repair.',
    endOfLifeOptions: generateEndOfLifeOptions(product.materials)
  };
};

const generateCareInstructions = (materials?: string): string => {
  if (!materials) return 'Follow manufacturer guidelines for care and maintenance.';

  const lower = materials.toLowerCase();
  const instructions: string[] = [];

  if (lower.includes('cotton') || lower.includes('textile') || lower.includes('fabric')) {
    instructions.push('Machine wash cold. Tumble dry low.');
  }
  if (lower.includes('leather')) {
    instructions.push('Wipe with damp cloth. Apply leather conditioner periodically.');
  }
  if (lower.includes('metal') || lower.includes('steel')) {
    instructions.push('Wipe clean with dry cloth. Avoid abrasive cleaners.');
  }
  if (lower.includes('wood') || lower.includes('bamboo')) {
    instructions.push('Wipe with damp cloth. Oil occasionally to maintain finish.');
  }
  if (lower.includes('glass') || lower.includes('ceramic')) {
    instructions.push('Hand wash recommended. Avoid thermal shock.');
  }
  if (lower.includes('plastic') || lower.includes('silicone')) {
    instructions.push('Dishwasher safe. Avoid high temperatures.');
  }

  return instructions.length > 0 
    ? instructions.join(' ') 
    : 'Follow manufacturer guidelines for care and maintenance.';
};

const generateEndOfLifeOptions = (materials?: string): string => {
  if (!materials) return 'Recycle according to local regulations. Contact local waste management for guidance.';

  const lower = materials.toLowerCase();
  const options: string[] = [];

  if (lower.includes('glass')) options.push('Glass recycling bin');
  if (lower.includes('metal') || lower.includes('steel') || lower.includes('aluminum')) {
    options.push('Metal recycling');
  }
  if (lower.includes('paper') || lower.includes('cardboard')) options.push('Paper recycling');
  if (lower.includes('plastic')) options.push('Check local plastic recycling codes');
  if (lower.includes('textile') || lower.includes('cotton') || lower.includes('fabric')) {
    options.push('Textile donation or recycling');
  }
  if (lower.includes('electronic')) options.push('E-waste recycling center');

  return options.length > 0
    ? `Disposal options: ${options.join(', ')}. Check local regulations.`
    : 'Recycle according to local regulations. Contact local waste management for guidance.';
};
