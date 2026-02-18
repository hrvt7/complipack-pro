import { backendFetch } from "@/lib/backendClient";

export type Product = {
  id: string;
  title?: string;
  name?: string;
  sku?: string | null;
  length_cm?: number | null;
  width_cm?: number | null;
  height_cm?: number | null;
  weight_g?: number | null;
  weight_kg?: number | null;
  packaging_status?: string | null;
  materials?: string | null;
  description?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type ListProductsResponse = {
  products: Product[];
};

export type ProductImportRow = {
  product_name: string;
  length_cm: number;
  width_cm: number;
  height_cm: number;
  weight_kg?: number;
  materials?: string;
  description?: string;
};

export type ImportProductsPayload = {
  rows?: ProductImportRow[];
  csv_text?: string;
  csv?: string;
};

export type ImportProductsResponse = {
  imported?: number;
  failed?: number;
  message?: string;
};

export type ConfirmDimensionsPayload = {
  product_id: string;
  length_cm: number;
  width_cm: number;
  height_cm: number;
};

export type ConfirmDimensionsResponse = {
  message?: string;
  product?: Product;
};

export async function listProducts() {
  return backendFetch<ListProductsResponse>("/api/compliance/products", {
    method: "GET",
  });
}

export async function getProduct(id: string) {
  return backendFetch<Product>(`/api/compliance/products/${id}`, {
    method: "GET",
  });
}

export async function importProducts(payload: ImportProductsPayload) {
  return backendFetch<ImportProductsResponse>("/api/compliance/products/import", {
    method: "POST",
    json: payload,
  });
}

export async function confirmProductDimensions(payload: ConfirmDimensionsPayload) {
  return backendFetch<ConfirmDimensionsResponse>("/api/compliance/products/confirm-dimensions", {
    method: "POST",
    json: payload,
  });
}
