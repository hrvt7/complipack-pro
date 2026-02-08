import { supabase } from "@/integrations/supabase/client";

async function getBearerToken(): Promise<string> {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw new Error(error.message);

  const token = data.session?.access_token;
  if (!token) throw new Error("Not authenticated (missing access_token).");
  return token;
}

export async function backendFetch<T>(
  path: string,
  options: RequestInit & { json?: any } = {}
): Promise<T> {
  const token = await getBearerToken();

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    ...(options.headers as Record<string, string> | undefined),
  };

  let body: BodyInit | undefined = options.body;

  if (options.json !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(options.json);
  }

  // If VITE_BACKEND_BASE_URL is set, call the backend directly (not the Vite dev server)
  const base = import.meta.env.VITE_BACKEND_BASE_URL as string | undefined;

  const url =
    base && base.startsWith("http")
      ? new URL(
          path.replace(/^\//, ""),
          base.endsWith("/") ? base : base + "/"
        ).toString()
      : path;

  const res = await fetch(url, { ...options, headers, body });

  if (!res.ok) {
    let payload: any = null;
    try {
      payload = await res.json();
    } catch {}

    const msg =
      payload?.message ||
      payload?.error ||
      `Backend error ${res.status} ${res.statusText}`;
    throw new Error(msg);
  }

  if (res.status === 204) return {} as T;
  return (await res.json()) as T;
}

