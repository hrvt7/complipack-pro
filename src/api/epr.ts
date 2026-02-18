import { backendFetch } from "@/lib/backendClient";

export type EprExportPayload = {
  period_start?: string;
  period_end?: string;
  country_code?: string;
};

export type EprExportResponse = {
  totals?: Array<{ material: string; weight_kg: number }>;
  xlsx_url?: string;
  pdf_url?: string;
};

export async function exportEpr(payload?: EprExportPayload) {
  return backendFetch<EprExportResponse | Blob>("/api/epr/export", {
    method: "POST",
    json: payload ?? {},
  });
}
