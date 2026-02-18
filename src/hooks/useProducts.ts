import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  listProducts,
  importProducts as importProductsApi,
  Product as ApiProduct,
} from '@/api/products';

export interface Product {
  id: string;
  user_id?: string;
  name: string;
  description?: string;
  length_cm: number;
  width_cm: number;
  height_cm: number;
  weight_kg?: number;
  materials?: string;
  packaging_status?: string;
  created_at: string;
  updated_at: string;
}

export interface NewProductData {
  name: string;
  description?: string;
  length: number;
  width: number;
  height: number;
  weight?: number;
  materials?: string;
}

const mapApiProduct = (product: ApiProduct): Product => ({
  id: product.id,
  name: product.name || product.title || 'Untitled product',
  description: product.description || undefined,
  length_cm: Number(product.length_cm ?? 0),
  width_cm: Number(product.width_cm ?? 0),
  height_cm: Number(product.height_cm ?? 0),
  weight_kg: product.weight_kg != null ? Number(product.weight_kg) : undefined,
  materials: product.materials || undefined,
  packaging_status: product.packaging_status || undefined,
  created_at: product.created_at || new Date().toISOString(),
  updated_at: product.updated_at || new Date().toISOString(),
});

const toErrorMessage = (error: unknown): string => {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === 'string') return error;
  if (error && typeof error === 'object') {
    const maybeMessage = (error as { message?: unknown }).message;
    if (typeof maybeMessage === 'string' && maybeMessage.trim()) return maybeMessage;

    try {
      return JSON.stringify(error);
    } catch {
      return 'Request failed.';
    }
  }
  return 'Request failed.';
};

export function useProducts(_userId: string | undefined) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await listProducts();
      setProducts((response.products || []).map(mapApiProduct));
    } catch (error: unknown) {
      console.error('Failed to fetch products:', error);
      setProducts([]);
      toast({
        title: 'Error',
        description: `Failed to load products: ${toErrorMessage(error)}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addProduct = async (productData: NewProductData): Promise<Product | null> => {
    try {
      await importProductsApi({
        rows: [
          {
            product_name: productData.name,
            length_cm: productData.length,
            width_cm: productData.width,
            height_cm: productData.height,
            weight_kg: productData.weight,
            materials: productData.materials,
            description: productData.description,
          },
        ],
      });

      await fetchProducts();

      toast({
        title: '✅ Product added',
        description: `${productData.name} has been added to your catalog.`,
      });

      return null;
    } catch (error: unknown) {
      console.error('Failed to add product:', error);
      toast({
        title: 'Error',
        description: `Failed to add product: ${toErrorMessage(error)}`,
        variant: 'destructive',
      });
      return null;
    }
  };

  const updateProduct = async (_id: string, _updates: Partial<NewProductData>): Promise<boolean> => {
    toast({
      title: 'Not available',
      description: 'Product updates are not available in this MVP yet.',
      variant: 'destructive',
    });
    return false;
  };

  const deleteProduct = async (_id: string): Promise<boolean> => {
    toast({
      title: 'Not available',
      description: 'Product deletion is not available in this MVP yet.',
      variant: 'destructive',
    });
    return false;
  };

  const importProducts = async (rows: Array<{
    product_name: string;
    length_cm: number;
    width_cm: number;
    height_cm: number;
    weight_kg?: number;
    materials?: string;
    description?: string;
  }>): Promise<{ success: number; failed: number }> => {
    try {
      const response = await importProductsApi({ rows });
      await fetchProducts();
      return {
        success: response.imported ?? rows.length,
        failed: response.failed ?? 0,
      };
    } catch {
      return { success: 0, failed: rows.length };
    }
  };

  return {
    products,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    importProducts,
    refreshProducts: fetchProducts,
  };
}
