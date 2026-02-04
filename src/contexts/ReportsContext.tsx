import React, { createContext, useContext, useEffect, useState } from 'react';

export interface Report {
  id: string;
  productId: string;
  productName: string;
  type: 'ppwr' | 'dpp' | 'combined';
  status: 'complete' | 'pending' | 'failed';
  generatedAt: string;
  verificationUrl: string;
}

interface ReportsContextType {
  reports: Report[];
  addReport: (report: Omit<Report, 'id' | 'generatedAt' | 'verificationUrl'>) => Report;
  deleteReport: (id: string) => void;
  getReport: (id: string) => Report | undefined;
  getReportsByProduct: (productId: string) => Report[];
}

const ReportsContext = createContext<ReportsContextType | undefined>(undefined);

// Generate 127 demo reports
const generateMockReports = (): Report[] => {
  const reports: Report[] = [];
  const productNames = [
    'Blue Cotton T-Shirt', 'Wireless Headphones', 'Ceramic Coffee Mug', 'Organic Face Cream',
    'Bamboo Cutting Board', 'LED Desk Lamp', 'Leather Wallet', 'Yoga Mat Pro',
    'Stainless Steel Water Bottle', 'Wool Blend Scarf', 'Portable Charger 10000mAh', 'Natural Lip Balm Set',
    'Wooden Photo Frame', 'Silicone Kitchen Utensils', 'Running Shoes Size 42', 'Organic Green Tea',
  ];
  
  const types: ('ppwr' | 'dpp' | 'combined')[] = ['ppwr', 'dpp', 'combined'];
  const statuses: ('complete' | 'pending' | 'failed')[] = ['complete', 'complete', 'complete', 'complete', 'pending', 'failed'];

  for (let i = 0; i < 127; i++) {
    const generatedDate = new Date();
    generatedDate.setDate(generatedDate.getDate() - Math.floor(Math.random() * 60));
    
    const productIndex = Math.floor(Math.random() * productNames.length);
    
    reports.push({
      id: `RPT-${String(10000 + i).padStart(5, '0')}`,
      productId: `prod-${String(productIndex + 1).padStart(4, '0')}`,
      productName: productNames[productIndex],
      type: types[Math.floor(Math.random() * types.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      generatedAt: generatedDate.toISOString(),
      verificationUrl: `https://verify.complipack.eu/${crypto.randomUUID().slice(0, 8)}`,
    });
  }

  return reports.sort((a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime());
};

const STORAGE_KEY = 'complipack-reports';

export function ReportsProvider({ children }: { children: React.ReactNode }) {
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setReports(JSON.parse(stored));
    } else {
      const mockReports = generateMockReports();
      setReports(mockReports);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockReports));
    }
  }, []);

  const saveReports = (newReports: Report[]) => {
    setReports(newReports);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newReports));
  };

  const addReport = (reportData: Omit<Report, 'id' | 'generatedAt' | 'verificationUrl'>): Report => {
    const newReport: Report = {
      ...reportData,
      id: `RPT-${String(10000 + reports.length).padStart(5, '0')}`,
      generatedAt: new Date().toISOString(),
      verificationUrl: `https://verify.complipack.eu/${crypto.randomUUID().slice(0, 8)}`,
    };
    
    saveReports([newReport, ...reports]);
    return newReport;
  };

  const deleteReport = (id: string) => {
    saveReports(reports.filter(r => r.id !== id));
  };

  const getReport = (id: string) => reports.find(r => r.id === id);

  const getReportsByProduct = (productId: string) => reports.filter(r => r.productId === productId);

  return (
    <ReportsContext.Provider value={{ reports, addReport, deleteReport, getReport, getReportsByProduct }}>
      {children}
    </ReportsContext.Provider>
  );
}

export function useReports() {
  const context = useContext(ReportsContext);
  if (context === undefined) {
    throw new Error('useReports must be used within a ReportsProvider');
  }
  return context;
}
