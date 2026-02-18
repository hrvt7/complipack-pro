import { backendFetch } from "@/lib/backendClient";

export type GenerateReportPayload = {
  product_id: string;
  buffer_percent?: number;
  distance_km?: number;
  destination_country?: string;
};

export type GenerateReportResponse = {
  report?: {
    id?: string;
    pdf_url?: string;
    qr_url?: string;
    public_dpp_url?: string;
    public_url?: string;
    carbon_light_total?: number | string;
    disclaimer?: string;
  };
  report_id?: string;
  id?: string;
  pdf_url?: string;
  qr_url?: string;
  public_dpp_url?: string;
  public_url?: string;
  carbon_light_total?: number | string;
  disclaimer?: string;
};

export type FinalizeReportPayload = {
  report_id: string;
  actor_id: string;
};

export type FinalizeReportResponse = {
  report?: {
    pdf_url?: string;
    qr_url?: string;
    public_dpp_url?: string;
    public_url?: string;
    carbon_light_total?: number | string;
    disclaimer?: string;
  };
  pdf_url?: string;
  qr_url?: string;
  public_dpp_url?: string;
  public_url?: string;
  carbon_light_total?: number | string;
  disclaimer?: string;
};

export async function generateReport(payload: GenerateReportPayload) {
  return backendFetch<GenerateReportResponse>("/api/compliance/report/generate", {
    method: "POST",
    json: payload,
  });
}

export async function finalizeReport(payload: FinalizeReportPayload) {
  return backendFetch<FinalizeReportResponse>("/api/compliance/report/finalize", {
    method: "POST",
    json: payload,
  });
}
