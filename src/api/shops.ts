import { backendFetch } from "@/lib/backendClient";
import { supabase } from "@/integrations/supabase/client";

export type CreateShopResponse = {
  shop?: {
    id: string;
    name?: string;
    api_key?: string;
    created_at?: string;
  };
  api_key?: string;
};

export async function createShop(payload: { name: string }) {
  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session) {
    throw new Error("No active session. Please log in again.");
  }

  const accessToken = data.session.access_token;

  return backendFetch<CreateShopResponse>("/api/auth/create-shop", {
    method: "POST",
    json: payload,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
