import { useState, useEffect, useCallback } from 'react';
import { listProducts } from '@/api/products';
import { getComplianceStats } from '@/api/stats';

export interface DashboardStats {
  totalProducts: number;
  compliantProducts: number;
  nonCompliantProducts: number;
  reportsGenerated: number;
  complianceRate: number;
}

export function useDashboardStats(_userId: string | undefined) {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    compliantProducts: 0,
    nonCompliantProducts: 0,
    reportsGenerated: 0,
    complianceRate: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      try {
        const statsResponse = await getComplianceStats();
        const totalProducts = Number(statsResponse.total_products ?? 0);
        const compliantProducts = Number(statsResponse.confirmed_packaging_products ?? 0);
        const nonCompliantProducts = Math.max(0, totalProducts - compliantProducts);
        const reportsGenerated = Number(statsResponse.reports_generated ?? 0);
        const complianceRate = totalProducts > 0
          ? Math.round((compliantProducts / totalProducts) * 100)
          : 0;

        setStats({
          totalProducts,
          compliantProducts,
          nonCompliantProducts,
          reportsGenerated,
          complianceRate,
        });
        return;
      } catch (statsError) {
        console.warn('Failed to fetch /api/compliance/stats, falling back to products list.', statsError);
      }

      const response = await listProducts();
      const products = response.products || [];

      const totalProducts = products.length;
      const compliantProducts = products.filter((p) => p.packaging_status === 'confirmed').length;
      const nonCompliantProducts = Math.max(0, totalProducts - compliantProducts);
      const reportsGenerated = 0;
      const complianceRate = totalProducts > 0
        ? Math.round((compliantProducts / totalProducts) * 100)
        : 0;

      setStats({
        totalProducts,
        compliantProducts,
        nonCompliantProducts,
        reportsGenerated,
        complianceRate,
      });
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      setStats({
        totalProducts: 0,
        compliantProducts: 0,
        nonCompliantProducts: 0,
        reportsGenerated: 0,
        complianceRate: 0,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    refreshStats: fetchStats,
  };
}
