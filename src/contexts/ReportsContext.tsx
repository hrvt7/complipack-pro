import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';
import { useReports as useReportsHook, ComplianceReport } from '@/hooks/useReports';

export interface Report {
  id: string;
  productId: string;
  productName: string;
  type: 'ppwr' | 'dpp' | 'combined';
  status: 'complete' | 'pending' | 'failed';
  generatedAt: string;
  verificationUrl: string;
  voidSpace?: number;
  isCompliant?: boolean;
  ppwrQrUrl?: string;
  dppQrUrl?: string;
  pdfUrl?: string;
}

interface ReportsContextType {
  reports: Report[];
  loading: boolean;
  generating: boolean;
  addReport: (report: { productId: string; productName: string; type: 'ppwr' | 'dpp' | 'combined'; status: string }) => Promise<Report | null>;
  deleteReport: (id: string) => Promise<boolean>;
  getReport: (id: string) => Report | undefined;
  getReportsByProduct: (productId: string) => Report[];
  generateReport: (productId: string, reportType: 'ppwr' | 'dpp' | 'combined') => Promise<Report | null>;
  refreshReports: () => Promise<void>;
}

const ReportsContext = createContext<ReportsContextType | undefined>(undefined);

// Transform database report to context report
const transformReport = (dbReport: ComplianceReport): Report => {
  return {
    id: dbReport.id,
    productId: dbReport.product_id,
    productName: dbReport.products?.name || 'Unknown Product',
    type: dbReport.report_type as 'ppwr' | 'dpp' | 'combined',
    status: dbReport.status as 'complete' | 'pending' | 'failed',
    generatedAt: dbReport.created_at,
    verificationUrl: `${window.location.origin}/verify/${dbReport.report_type}/${dbReport.id}`,
    voidSpace: dbReport.void_space_percent ? Number(dbReport.void_space_percent) : undefined,
    isCompliant: dbReport.is_ppwr_compliant || undefined,
    ppwrQrUrl: dbReport.ppwr_qr_url || undefined,
    dppQrUrl: dbReport.dpp_qr_url || undefined,
    pdfUrl: dbReport.pdf_url || undefined,
  };
};

export function ReportsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const {
    reports: dbReports,
    loading,
    generating,
    generateReport: generateDbReport,
    deleteReport: deleteDbReport,
    getReport: getDbReport,
    refreshReports
  } = useReportsHook(user?.id);

  // Transform database reports to context reports
  const reports = dbReports.map(transformReport);

  const addReport = async (reportData: { productId: string; productName: string; type: 'ppwr' | 'dpp' | 'combined'; status: string }): Promise<Report | null> => {
    // Use generateReport instead of direct add
    const result = await generateDbReport(reportData.productId, reportData.type);
    if (result) {
      return transformReport(result);
    }
    return null;
  };

  const deleteReport = async (id: string): Promise<boolean> => {
    return deleteDbReport(id);
  };

  const getReport = (id: string): Report | undefined => {
    return reports.find(r => r.id === id);
  };

  const getReportsByProduct = (productId: string): Report[] => {
    return reports.filter(r => r.productId === productId);
  };

  const generateReport = async (productId: string, reportType: 'ppwr' | 'dpp' | 'combined'): Promise<Report | null> => {
    const result = await generateDbReport(productId, reportType);
    if (result) {
      return transformReport(result);
    }
    return null;
  };

  return (
    <ReportsContext.Provider value={{
      reports,
      loading,
      generating,
      addReport,
      deleteReport,
      getReport,
      getReportsByProduct,
      generateReport,
      refreshReports
    }}>
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
