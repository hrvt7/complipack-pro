import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";

export interface DashboardStats {
  totalProducts: number;
  compliantProducts: number;
  nonCompliantProducts: number;
  reportsGenerated: number;
  complianceRate: number;
}

export function useDashboardStats(userId: string | undefined) {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    compliantProducts: 0,
    nonCompliantProducts: 0,
    reportsGenerated: 0,
    complianceRate: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    if (!userId) {
      setStats({
        totalProducts: 0,
        compliantProducts: 0,
        nonCompliantProducts: 0,
        reportsGenerated: 0,
        complianceRate: 0
      });
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Fetch all counts in parallel
      const [productsResult, reportsResult, compliantResult, nonCompliantResult] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }).eq('user_id', userId),
        supabase.from('compliance_reports').select('*', { count: 'exact', head: true }).eq('user_id', userId),
        supabase.from('compliance_reports').select('*', { count: 'exact', head: true }).eq('user_id', userId).eq('is_ppwr_compliant', true),
        supabase.from('compliance_reports').select('*', { count: 'exact', head: true }).eq('user_id', userId).eq('is_ppwr_compliant', false)
      ]);

      const totalProducts = productsResult.count || 0;
      const reportsGenerated = reportsResult.count || 0;
      const compliantProducts = compliantResult.count || 0;
      const nonCompliantProducts = nonCompliantResult.count || 0;

      const complianceRate = reportsGenerated > 0
        ? Math.round((compliantProducts / reportsGenerated) * 100)
        : 0;

      setStats({
        totalProducts,
        compliantProducts,
        nonCompliantProducts,
        reportsGenerated,
        complianceRate
      });
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    refreshStats: fetchStats
  };
}
