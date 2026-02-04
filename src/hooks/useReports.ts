import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/hooks/use-toast';
import { calculatePPWRCompliance, generateDPPData, DPPData } from '@/services/complianceService';
import { generatePPWRQR, generateDPPQR } from '@/services/qrService';

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
  // Joined data
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

  // Fetch reports from database
  const fetchReports = useCallback(async () => {
    if (!userId) {
      setReports([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('compliance_reports')
        .select(`
          *,
          products (name, length_cm, width_cm, height_cm, materials, description),
          standard_boxes (name, length_cm, width_cm, height_cm, cost_eur)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Type assertion to handle the joined data - cast through unknown for Json compatibility
      setReports((data || []) as unknown as ComplianceReport[]);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
      toast({
        title: 'Error',
        description: 'Failed to load reports',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [userId, toast]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // Generate a new compliance report
  const generateReport = async (
    productId: string,
    reportType: 'ppwr' | 'dpp' | 'combined'
  ): Promise<ComplianceReport | null> => {
    if (!userId) return null;

    setGenerating(true);
    try {
      // 1. Fetch product
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (productError || !product) throw new Error('Product not found');

      // 2. Calculate PPWR compliance
      const ppwrResult = await calculatePPWRCompliance({
        length: Number(product.length_cm),
        width: Number(product.width_cm),
        height: Number(product.height_cm)
      });

      // 3. Generate DPP data
      const dppData = generateDPPData({
        name: product.name,
        description: product.description || undefined,
        length: Number(product.length_cm),
        width: Number(product.width_cm),
        height: Number(product.height_cm),
        materials: product.materials || undefined
      });

      // 4. Create report record (status: generating)
      const { data: reportRecord, error: reportError } = await supabase
        .from('compliance_reports')
        .insert({
          user_id: userId,
          product_id: productId,
          report_type: reportType,
          recommended_box_id: ppwrResult.recommendedBox.id,
          void_space_percent: ppwrResult.voidSpace,
          is_ppwr_compliant: ppwrResult.isCompliant,
          dpp_data: dppData as any,
          status: 'generating'
        })
        .select()
        .single();

      if (reportError || !reportRecord) throw reportError;

      // 5. Generate QR codes
      let ppwrQrUrl: string | undefined;
      let dppQrUrl: string | undefined;

      if (reportType === 'ppwr' || reportType === 'combined') {
        ppwrQrUrl = await generatePPWRQR(reportRecord.id, userId, {
          boxName: ppwrResult.recommendedBox.name,
          voidSpace: ppwrResult.voidSpace,
          compliant: ppwrResult.isCompliant
        });
      }

      if (reportType === 'dpp' || reportType === 'combined') {
        dppQrUrl = await generateDPPQR(reportRecord.id, userId, {
          productName: product.name,
          carbonKg: dppData.carbonFootprintKg,
          recyclability: dppData.recyclabilityScore
        });
      }

      // 6. Update report with QR URLs (status: complete)
      const { error: updateError } = await supabase
        .from('compliance_reports')
        .update({
          ppwr_qr_url: ppwrQrUrl,
          dpp_qr_url: dppQrUrl,
          status: 'complete'
        })
        .eq('id', reportRecord.id);

      if (updateError) throw updateError;

      toast({
        title: '✅ Report generated',
        description: `Compliance report for ${product.name} is ready.`
      });

      // Refresh reports list
      await fetchReports();

      return {
        ...reportRecord,
        ppwr_qr_url: ppwrQrUrl,
        dpp_qr_url: dppQrUrl,
        status: 'complete'
      } as unknown as ComplianceReport;

    } catch (error) {
      console.error('Failed to generate report:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate report',
        variant: 'destructive'
      });
      return null;
    } finally {
      setGenerating(false);
    }
  };

  // Delete a report
  const deleteReport = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('compliance_reports')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setReports(prev => prev.filter(r => r.id !== id));
      toast({
        title: 'Report deleted',
        description: 'Report has been removed.'
      });

      return true;
    } catch (error) {
      console.error('Failed to delete report:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete report',
        variant: 'destructive'
      });
      return false;
    }
  };

  // Get report by ID
  const getReport = async (id: string): Promise<ComplianceReport | null> => {
    try {
      const { data, error } = await supabase
        .from('compliance_reports')
        .select(`
          *,
          products (name, length_cm, width_cm, height_cm, materials, description),
          standard_boxes (name, length_cm, width_cm, height_cm, cost_eur)
        `)
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data as unknown as ComplianceReport | null;
    } catch (error) {
      console.error('Failed to get report:', error);
      return null;
    }
  };

  return {
    reports,
    loading,
    generating,
    generateReport,
    deleteReport,
    getReport,
    refreshReports: fetchReports
  };
}
