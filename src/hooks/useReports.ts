import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { DPPData } from '@/services/complianceService';

export interface ComplianceReport {
  id: string;
  user_id: string;
  product_id: string;
  report_type: 'ppwr' | 'dpp' | 'combined';
  recommended_box_id?: string;
  void_space_percent?: number;
  is_ppwr_compliant?: boolean;
  dpp_data?: DPPData | null;
  ppwr_qr_url?: string | null;
  dpp_qr_url?: string | null;
  pdf_url?: string | null;
  status: 'pending' | 'generating' | 'complete' | 'failed';
  created_at: string;
  updated_at: string;
  products?: {
    name: string;
    length_cm: number;
    width_cm: number;
    height_cm: number;
    materials?: string;
    description?: string;
  };
  standard_boxes?: {
    name: string;
    length_cm: number;
    width_cm: number;
    height_cm: number;
    cost_eur: number;
  };
}

export function useReports(userId: string | undefined) {
  const [reports, setReports] = useState<ComplianceReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const { toast } = useToast();

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setReports([]);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!userId) {
      setReports([]);
      setLoading(false);
      return;
    }
    fetchReports();
  }, [fetchReports, userId]);

  const generateReport = async (
    productId: string,
    reportType: 'ppwr' | 'dpp' | 'combined'
  ): Promise<ComplianceReport | null> => {
    if (!userId) return null;

    setGenerating(true);
    const now = new Date().toISOString();
    const report: ComplianceReport = {
      id: `rpt-${Date.now()}`,
      user_id: userId,
      product_id: productId,
      report_type: reportType,
      status: 'complete',
      created_at: now,
      updated_at: now,
    };

    setReports((prev) => [report, ...prev]);
    toast({
      title: 'Report saved',
      description: 'Report history updated locally for this session.',
    });
    setGenerating(false);

    return report;
  };

  const deleteReport = async (id: string): Promise<boolean> => {
    setReports((prev) => prev.filter((r) => r.id !== id));
    return true;
  };

  const getReport = async (id: string): Promise<ComplianceReport | null> => {
    return reports.find((r) => r.id === id) || null;
  };

  return {
    reports,
    loading,
    generating,
    generateReport,
    deleteReport,
    getReport,
    refreshReports: fetchReports,
  };
}
