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
  packLength?: number;
  packWidth?: number;
  packHeight?: number;
  packagingConfirmed: boolean;
  packagingConfirmedAt?: string;
  ppwrCompliant: boolean;
  voidSpace: number;
  hasDPP: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ProductsContextType {
  products: Product[];
  loading: boolean;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'ppwrCompliant' | 'voidSpace' | 'hasDPP' | 'packagingConfirmed' | 'packagingConfirmedAt'>) => Promise<Product | null>;
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
    pack_length_cm?: number;
    pack_width_cm?: number;
    pack_height_cm?: number;
  }>) => Promise<{ success: number; failed: number }>;
  updatePackaging: (id: string, packLength: number, packWidth: number, packHeight: number) => Promise<boolean>;
  confirmPackaging: (ids: string[]) => Promise<boolean>;
  refreshProducts: () => Promise<void>;
}

import { calculateVoidSpace } from '@/services/packagingAlgorithm';

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

// Helper to calculate PPWR compliance from product + packaging dimensions
const calculateCompliance = (
  productL: number, productW: number, productH: number,
  packL?: number, packW?: number, packH?: number
) => {
  if (packL && packW && packH) {
    const voidSpace = calculateVoidSpace(productL, productW, productH, packL, packW, packH);
    return { voidSpace, ppwrCompliant: voidSpace < 40 };
  }
  // Fallback: no packaging dims yet — use old +4cm estimate
  const productVolume = productL * productW * productH;
  const boxVolume = (productL + 4) * (productW + 4) * (productH + 4);
  const voidSpace = Math.round(((boxVolume - productVolume) / boxVolume) * 100);
  return { voidSpace, ppwrCompliant: voidSpace < 40 };
};

// Transform database product to context product
const transformProduct = (dbProduct: ProductType): Product => {
  const { voidSpace, ppwrCompliant } = calculateCompliance(
    Number(dbProduct.length_cm),
    Number(dbProduct.width_cm),
    Number(dbProduct.height_cm),
    dbProduct.pack_length_cm ? Number(dbProduct.pack_length_cm) : undefined,
    dbProduct.pack_width_cm ? Number(dbProduct.pack_width_cm) : undefined,
    dbProduct.pack_height_cm ? Number(dbProduct.pack_height_cm) : undefined,
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
    packLength: dbProduct.pack_length_cm ? Number(dbProduct.pack_length_cm) : undefined,
    packWidth: dbProduct.pack_width_cm ? Number(dbProduct.pack_width_cm) : undefined,
    packHeight: dbProduct.pack_height_cm ? Number(dbProduct.pack_height_cm) : undefined,
    packagingConfirmed: dbProduct.packaging_confirmed ?? false,
    packagingConfirmedAt: dbProduct.packaging_confirmed_at || undefined,
    ppwrCompliant,
    voidSpace,
    hasDPP: true,
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
    updatePackaging: updateDbPackaging,
    confirmPackaging: confirmDbPackaging,
    refreshProducts
  } = useProductsHook(user?.id);

  // Transform database products to context products
  const products = dbProducts.map(transformProduct);

  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'ppwrCompliant' | 'voidSpace' | 'hasDPP' | 'packagingConfirmed' | 'packagingConfirmedAt'>): Promise<Product | null> => {
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
    pack_length_cm?: number;
    pack_width_cm?: number;
    pack_height_cm?: number;
  }>): Promise<{ success: number; failed: number }> => {
    return importDbProducts(csvProducts);
  };

  const updatePackaging = async (id: string, packLength: number, packWidth: number, packHeight: number): Promise<boolean> => {
    return updateDbPackaging(id, packLength, packWidth, packHeight);
  };

  const confirmPackaging = async (ids: string[]): Promise<boolean> => {
    return confirmDbPackaging(ids);
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
      updatePackaging,
      confirmPackaging,
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
