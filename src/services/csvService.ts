import Papa from 'papaparse';

export interface ParsedProduct {
  product_name: string;
  length_cm: number;
  width_cm: number;
  height_cm: number;
  weight_kg?: number;
  materials?: string;
  description?: string;
  isValid: boolean;
  errors: string[];
}

export interface CSVParseResult {
  data: ParsedProduct[];
  validCount: number;
  invalidCount: number;
  errors: string[];
}

const requiredColumns = ['product_name', 'length_cm', 'width_cm', 'height_cm'];
const optionalColumns = ['weight_kg', 'materials', 'description'];

// Validate a single row
const validateRow = (row: Record<string, string>, rowIndex: number): ParsedProduct => {
  const errors: string[] = [];

  // Check required fields
  if (!row.product_name || row.product_name.trim() === '') {
    errors.push('Missing product name');
  }

  const length = parseFloat(row.length_cm);
  const width = parseFloat(row.width_cm);
  const height = parseFloat(row.height_cm);

  if (isNaN(length) || length <= 0) {
    errors.push('Invalid length (must be a positive number)');
  }
  if (isNaN(width) || width <= 0) {
    errors.push('Invalid width (must be a positive number)');
  }
  if (isNaN(height) || height <= 0) {
    errors.push('Invalid height (must be a positive number)');
  }

  // Validate optional fields
  let weight: number | undefined;
  if (row.weight_kg && row.weight_kg.trim() !== '') {
    weight = parseFloat(row.weight_kg);
    if (isNaN(weight) || weight < 0) {
      errors.push('Invalid weight (must be a non-negative number)');
      weight = undefined;
    }
  }

  return {
    product_name: row.product_name?.trim() || '',
    length_cm: isNaN(length) ? 0 : length,
    width_cm: isNaN(width) ? 0 : width,
    height_cm: isNaN(height) ? 0 : height,
    weight_kg: weight,
    materials: row.materials?.trim() || undefined,
    description: row.description?.trim() || undefined,
    isValid: errors.length === 0,
    errors
  };
};

// Parse CSV file
export const parseCSV = (file: File): Promise<CSVParseResult> => {
  return new Promise((resolve, reject) => {
    // Read file as text first to strip BOM and normalize
    const reader = new FileReader();
    reader.onload = (e) => {
      let text = e.target?.result as string;
      if (!text || text.trim().length === 0) {
        reject(new Error('CSV file is empty'));
        return;
      }

      // Strip BOM if present
      if (text.charCodeAt(0) === 0xFEFF) {
        text = text.slice(1);
      }

      const results = Papa.parse<Record<string, string>>(text, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.replace(/^\uFEFF/, '').toLowerCase().trim(),
      });

      const globalErrors: string[] = [];

      // Check if file has data
      if (!results.data || results.data.length === 0) {
        reject(new Error('CSV file is empty or has no data rows'));
        return;
      }

      // Check for required columns
      const headers = Object.keys(results.data[0] || {});
      const missingColumns = requiredColumns.filter(col => !headers.includes(col));
      
      if (missingColumns.length > 0) {
        reject(new Error(`Missing required columns: ${missingColumns.join(', ')}. Found columns: ${headers.join(', ')}`));
        return;
      }

      // Parse and validate each row
      const parsedData = results.data.map((row, index) => validateRow(row, index));

      const validCount = parsedData.filter(r => r.isValid).length;
      const invalidCount = parsedData.filter(r => !r.isValid).length;

      resolve({
        data: parsedData,
        validCount,
        invalidCount,
        errors: globalErrors
      });
    };
    reader.onerror = () => {
      reject(new Error('Failed to read CSV file'));
    };
    reader.readAsText(file, 'UTF-8');
  });
};

// Parse CSV from text content (for drag-and-drop)
export const parseCSVText = (content: string): CSVParseResult => {
  const result = Papa.parse<Record<string, string>>(content, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.replace(/^\uFEFF/, '').toLowerCase().trim()
  });

  if (!result.data || result.data.length === 0) {
    throw new Error('CSV content is empty or has no data rows');
  }

  const headers = Object.keys(result.data[0] || {});
  const missingColumns = requiredColumns.filter(col => !headers.includes(col));
  
  if (missingColumns.length > 0) {
    throw new Error(`Missing required columns: ${missingColumns.join(', ')}`);
  }

  const parsedData = result.data.map((row, index) => validateRow(row, index));

  return {
    data: parsedData,
    validCount: parsedData.filter(r => r.isValid).length,
    invalidCount: parsedData.filter(r => !r.isValid).length,
    errors: []
  };
};

// Generate CSV template
export const generateCSVTemplate = (): string => {
  const headers = [...requiredColumns, ...optionalColumns].join(',');
  const exampleRow1 = 'Blue Cotton T-Shirt,25,20,5,0.3,100% Cotton,Classic fit t-shirt';
  const exampleRow2 = 'Ceramic Coffee Mug,12,10,10,0.4,Ceramic,350ml capacity';
  
  return `${headers}\n${exampleRow1}\n${exampleRow2}`;
};

// Download CSV template
export const downloadCSVTemplate = (): void => {
  const template = generateCSVTemplate();
  const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'complipack_import_template.csv';
  link.click();
  URL.revokeObjectURL(url);
};
