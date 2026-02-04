import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/hooks/use-toast';

export interface Product {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  length_cm: number;
  width_cm: number;
  height_cm: number;
  weight_kg?: number;
  materials?: string;
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

export function useProducts(userId: string | undefined) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch products from database
  const fetchProducts = useCallback(async () => {
    if (!userId) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      toast({
        title: 'Error',
        description: 'Failed to load products',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [userId, toast]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Add a new product
  const addProduct = async (productData: NewProductData): Promise<Product | null> => {
    if (!userId) return null;

    try {
      const { data, error } = await supabase
        .from('products')
        .insert({
          user_id: userId,
          name: productData.name,
          description: productData.description || null,
          length_cm: productData.length,
          width_cm: productData.width,
          height_cm: productData.height,
          weight_kg: productData.weight || null,
          materials: productData.materials || null
        })
        .select()
        .single();

      if (error) throw error;

      setProducts(prev => [data, ...prev]);
      toast({
        title: '✅ Product added',
        description: `${productData.name} has been added to your catalog.`
      });

      return data;
    } catch (error) {
      console.error('Failed to add product:', error);
      toast({
        title: 'Error',
        description: 'Failed to add product',
        variant: 'destructive'
      });
      return null;
    }
  };

  // Update a product
  const updateProduct = async (id: string, updates: Partial<NewProductData>): Promise<boolean> => {
    try {
      const updateData: any = {};
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.length !== undefined) updateData.length_cm = updates.length;
      if (updates.width !== undefined) updateData.width_cm = updates.width;
      if (updates.height !== undefined) updateData.height_cm = updates.height;
      if (updates.weight !== undefined) updateData.weight_kg = updates.weight;
      if (updates.materials !== undefined) updateData.materials = updates.materials;

      const { error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      setProducts(prev => prev.map(p => 
        p.id === id ? { ...p, ...updateData } : p
      ));

      toast({
        title: 'Product updated',
        description: 'Changes have been saved.'
      });

      return true;
    } catch (error) {
      console.error('Failed to update product:', error);
      toast({
        title: 'Error',
        description: 'Failed to update product',
        variant: 'destructive'
      });
      return false;
    }
  };

  // Delete a product
  const deleteProduct = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProducts(prev => prev.filter(p => p.id !== id));
      toast({
        title: 'Product deleted',
        description: 'Product has been removed.'
      });

      return true;
    } catch (error) {
      console.error('Failed to delete product:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete product',
        variant: 'destructive'
      });
      return false;
    }
  };

  // Import products from CSV
  const importProducts = async (products: Array<{
    product_name: string;
    length_cm: number;
    width_cm: number;
    height_cm: number;
    weight_kg?: number;
    materials?: string;
    description?: string;
  }>): Promise<{ success: number; failed: number }> => {
    if (!userId) return { success: 0, failed: 0 };

    let success = 0;
    let failed = 0;

    for (const product of products) {
      try {
        const { error } = await supabase
          .from('products')
          .insert({
            user_id: userId,
            name: product.product_name,
            description: product.description || null,
            length_cm: product.length_cm,
            width_cm: product.width_cm,
            height_cm: product.height_cm,
            weight_kg: product.weight_kg || null,
            materials: product.materials || null
          });

        if (error) throw error;
        success++;
      } catch {
        failed++;
      }
    }

    // Refresh the products list
    await fetchProducts();

    return { success, failed };
  };

  return {
    products,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    importProducts,
    refreshProducts: fetchProducts
  };
}
