import { supabase } from "@/integrations/supabase/client";

/**
 * Resolve backend base URL.
 * Vercel / prod: VITE_BACKEND_BASE_URL = https://ppwr-dpp-pack.vercel.app
 * Local dev fallback: relative paths (Vite dev server proxy)
 */
function getBackendBaseUrl(): string {
  return (import.meta.env.VITE_BACKEND_BASE_URL as string | undefined) || "";
}

/**
 * Get Supabase access token for Bearer auth.
 */
async function getBearerToken(): Promise<string> {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    throw new Error(`Auth session error: ${error.message}`);
  }

  const token = data.session?.access_token;
  if (!token) {
    throw new Error("Not authenticated (missing access_token)");
  }

  return token;
}

/**
 * Build absolute backend URL from path.
 */
function buildUrl(path: string): string {
  const base = getBackendBaseUrl().replace(/\/$/, "");
  if (!base) {
    return path;
  }

  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${cleanPath}`;
}

/**
 * Safe JSON parse helper.
 */
async function tryParseJson(res: Response): Promise<any | null> {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Main backend fetch helper.
 */
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

  const url = buildUrl(path);

  const res = await fetch(url, {
    ...options,
    headers,
    body,
  });

  if (!res.ok) {
    const payload = await tryParseJson(res);

    const message =
      payload?.message ||
      payload?.error ||
      `Backend error ${res.status} ${res.statusText}`;

    const err = new Error(message) as Error & {
      status?: number;
      details?: any;
    };

    err.status = res.status;
    err.details = payload;

    throw err;
  }

  if (res.status === 204) {
    return {} as T;
  }

  const contentType = res.headers.get("content-type") ?? "";
  if (contentType.includes("application/json") || contentType.includes("+json")) {
    return (await res.json()) as T;
  }

  return (await res.blob()) as T;
}
