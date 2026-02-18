import { backendFetch } from "@/lib/backendClient";

export type ComplianceStatsResponse = {
  total_products?: number;
  confirmed_packaging_products?: number;
  reports_generated?: number;
};

export async function getComplianceStats() {
  return backendFetch<ComplianceStatsResponse>("/api/compliance/stats", {
    method: "GET",
  });
}
