import { backendFetch } from "@/lib/backendClient";

export type CreateShopResponse = {
  shop?: {
    id: string;
    name?: string;
    api_key?: string;
    created_at?: string;
  };
  api_key?: string;
};

export function createShop(payload: { name: string }) {
  return backendFetch<CreateShopResponse>("/api/auth/create-shop", {
    method: "POST",
    json: payload,
  });
}
