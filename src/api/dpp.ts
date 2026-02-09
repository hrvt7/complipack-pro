import { backendFetch } from "@/lib/backendClient";

export type GenerateComplianceReportPayload = {
  product_id: string;
  buffer_percent?: number;
  distance_km?: number;
  destination_country?: string;
};

export type GenerateComplianceReportResponse = {
  report?: {
    id?: string;
  };
  report_id?: string;
  id?: string;
};

export type FinalizeComplianceReportPayload = {
  report_id: string;
  actor_id: string;
};

export type FinalizeComplianceReportResponse = {
  report?: {
    pdf_url?: string;
    qr_url?: string;
    public_dpp_url?: string;
    carbon_light_total?: number | string;
    disclaimer?: string;
  };
  pdf_url?: string;
  qr_url?: string;
  public_dpp_url?: string;
  carbon_light_total?: number | string;
  disclaimer?: string;
};

export async function generateComplianceReport(
  payload: GenerateComplianceReportPayload
): Promise<GenerateComplianceReportResponse> {
  return backendFetch<GenerateComplianceReportResponse>(
    "/api/compliance/report/generate",
    {
      method: "POST",
      json: payload,
    }
  );
}

export async function finalizeComplianceReport(
  payload: FinalizeComplianceReportPayload
): Promise<FinalizeComplianceReportResponse> {
  return backendFetch<FinalizeComplianceReportResponse>(
    "/api/compliance/report/finalize",
    {
      method: "POST",
      json: payload,
    }
  );
}
