import React, { createContext, useContext, useEffect, useState } from 'react';

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
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'ppwrCompliant' | 'voidSpace' | 'hasDPP'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProduct: (id: string) => Product | undefined;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

// Generate 47 demo products
const generateMockProducts = (): Product[] => {
  const productNames = [
    'Blue Cotton T-Shirt', 'Wireless Headphones', 'Ceramic Coffee Mug', 'Organic Face Cream',
    'Bamboo Cutting Board', 'LED Desk Lamp', 'Leather Wallet', 'Yoga Mat Pro',
    'Stainless Steel Water Bottle', 'Wool Blend Scarf', 'Portable Charger 10000mAh', 'Natural Lip Balm Set',
    'Wooden Photo Frame', 'Silicone Kitchen Utensils', 'Running Shoes Size 42', 'Organic Green Tea',
    'Bluetooth Speaker Mini', 'Cotton Bed Sheets Set', 'Glass Food Container Set', 'Vitamin D Supplements',
    'Recycled Paper Notebook', 'Stainless Steel Cookware', 'Essential Oil Diffuser', 'Linen Throw Pillow',
    'USB-C Cable 2m', 'Organic Shampoo Bar', 'Fitness Resistance Bands', 'Ceramic Plant Pot',
    'Smart Watch Band', 'Natural Deodorant Stick', 'Microfiber Cleaning Cloths', 'Bamboo Toothbrush Set',
    'Insulated Lunch Box', 'Aromatherapy Candle', 'Compression Socks Set', 'Reusable Shopping Bag',
    'Stainless Steel Razor', 'Organic Body Lotion', 'Wooden Sunglasses', 'Eco-Friendly Phone Case',
    'Cotton Tote Bag', 'Glass Water Carafe', 'Natural Soap Bar Set', 'Bamboo Desk Organizer',
    'Recycled Plastic Coasters', 'Organic Cotton Socks', 'Silicone Baking Mat'
  ];

  return productNames.map((name, index) => {
    const length = Math.floor(Math.random() * 30) + 10;
    const width = Math.floor(Math.random() * 25) + 8;
    const height = Math.floor(Math.random() * 20) + 5;
    const voidSpace = Math.floor(Math.random() * 55) + 5;
    const ppwrCompliant = voidSpace < 40;
    const hasDPP = Math.random() > 0.25;
    
    const createdDate = new Date();
    createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 90));
    
    const updatedDate = new Date(createdDate);
    updatedDate.setDate(updatedDate.getDate() + Math.floor(Math.random() * 30));

    return {
      id: `prod-${String(index + 1).padStart(4, '0')}`,
      name,
      description: `High-quality ${name.toLowerCase()} made with sustainable materials.`,
      length,
      width,
      height,
      weight: Math.round((Math.random() * 5 + 0.1) * 100) / 100,
      materials: ['Cotton', 'Polyester', 'Bamboo', 'Stainless Steel', 'Glass', 'Ceramic', 'Recycled Plastic'][Math.floor(Math.random() * 7)],
      ppwrCompliant,
      voidSpace,
      hasDPP,
      createdAt: createdDate.toISOString(),
      updatedAt: updatedDate.toISOString(),
    };
  });
};

const STORAGE_KEY = 'complipack-products';

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setProducts(JSON.parse(stored));
    } else {
      const mockProducts = generateMockProducts();
      setProducts(mockProducts);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockProducts));
    }
  }, []);

  const saveProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProducts));
  };

  const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'ppwrCompliant' | 'voidSpace' | 'hasDPP'>): Product => {
    const productVolume = productData.length * productData.width * productData.height;
    const boxVolume = (productData.length + 4) * (productData.width + 4) * (productData.height + 4);
    const voidSpace = Math.round(((boxVolume - productVolume) / boxVolume) * 100);
    
    const newProduct: Product = {
      ...productData,
      id: `prod-${String(products.length + 1).padStart(4, '0')}`,
      ppwrCompliant: voidSpace < 40,
      voidSpace,
      hasDPP: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    saveProducts([newProduct, ...products]);
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    const updated = products.map(p => 
      p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
    );
    saveProducts(updated);
  };

  const deleteProduct = (id: string) => {
    saveProducts(products.filter(p => p.id !== id));
  };

  const getProduct = (id: string) => products.find(p => p.id === id);

  return (
    <ProductsContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, getProduct }}>
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
