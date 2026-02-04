import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { useProducts as useProductsHook, Product as ProductType, NewProductData } from '@/hooks/useProducts';

export interface Product {
  id: string;
  name: string;
  description?: string;
  length: number;
  width: number;
  height: number;
  weight?: number;
  materials?: string;
  ppwrCompliant: boolean;
  voidSpace: number;
  hasDPP: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ProductsContextType {
  products: Product[];
  loading: boolean;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'ppwrCompliant' | 'voidSpace' | 'hasDPP'>) => Promise<Product | null>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  getProduct: (id: string) => Product | undefined;
  importProducts: (products: Array<{
    product_name: string;
    length_cm: number;
    width_cm: number;
    height_cm: number;
    weight_kg?: number;
    materials?: string;
    description?: string;
  }>) => Promise<{ success: number; failed: number }>;
  refreshProducts: () => Promise<void>;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

// Helper to calculate PPWR compliance from dimensions
const calculateCompliance = (length: number, width: number, height: number) => {
  const productVolume = length * width * height;
  // Simple box calculation: add 4cm to each dimension
  const boxVolume = (length + 4) * (width + 4) * (height + 4);
  const voidSpace = Math.round(((boxVolume - productVolume) / boxVolume) * 100);
  const ppwrCompliant = voidSpace < 40;
  return { voidSpace, ppwrCompliant };
};

// Transform database product to context product
const transformProduct = (dbProduct: ProductType): Product => {
  const { voidSpace, ppwrCompliant } = calculateCompliance(
    Number(dbProduct.length_cm),
    Number(dbProduct.width_cm),
    Number(dbProduct.height_cm)
  );

  return {
    id: dbProduct.id,
    name: dbProduct.name,
    description: dbProduct.description || undefined,
    length: Number(dbProduct.length_cm),
    width: Number(dbProduct.width_cm),
    height: Number(dbProduct.height_cm),
    weight: dbProduct.weight_kg ? Number(dbProduct.weight_kg) : undefined,
    materials: dbProduct.materials || undefined,
    ppwrCompliant,
    voidSpace,
    hasDPP: true, // All products can have DPP
    createdAt: dbProduct.created_at,
    updatedAt: dbProduct.updated_at,
  };
};

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const {
    products: dbProducts,
    loading,
    addProduct: addDbProduct,
    updateProduct: updateDbProduct,
    deleteProduct: deleteDbProduct,
    importProducts: importDbProducts,
    refreshProducts
  } = useProductsHook(user?.id);

  // Transform database products to context products
  const products = dbProducts.map(transformProduct);

  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'ppwrCompliant' | 'voidSpace' | 'hasDPP'>): Promise<Product | null> => {
    const newProduct = await addDbProduct({
      name: productData.name,
      description: productData.description,
      length: productData.length,
      width: productData.width,
      height: productData.height,
      weight: productData.weight,
      materials: productData.materials,
    });

    if (newProduct) {
      return transformProduct(newProduct);
    }
    return null;
  };

  const updateProduct = async (id: string, updates: Partial<Product>): Promise<boolean> => {
    return updateDbProduct(id, {
      name: updates.name,
      description: updates.description,
      length: updates.length,
      width: updates.width,
      height: updates.height,
      weight: updates.weight,
      materials: updates.materials,
    });
  };

  const deleteProduct = async (id: string): Promise<boolean> => {
    return deleteDbProduct(id);
  };

  const getProduct = (id: string): Product | undefined => {
    return products.find(p => p.id === id);
  };

  const importProducts = async (csvProducts: Array<{
    product_name: string;
    length_cm: number;
    width_cm: number;
    height_cm: number;
    weight_kg?: number;
    materials?: string;
    description?: string;
  }>): Promise<{ success: number; failed: number }> => {
    return importDbProducts(csvProducts);
  };

  return (
    <ProductsContext.Provider value={{
      products,
      loading,
      addProduct,
      updateProduct,
      deleteProduct,
      getProduct,
      importProducts,
      refreshProducts
    }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
}
