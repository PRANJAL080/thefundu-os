/**
 * Supabase & PostgreSQL REST Client for TheFundu Inventory OS
 * Implemented using native Next.js fetch - zero extra dependencies required!
 * 
 * Works instantly with Supabase PostgREST endpoints.
 */

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  serviceKey?: string;
  databaseUrl?: string;
}

export function getSupabaseEnvConfig(): SupabaseConfig {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
    databaseUrl: process.env.DATABASE_URL || "",
  };
}

export function isSupabaseReady(config?: Partial<SupabaseConfig>): boolean {
  const env = getSupabaseEnvConfig();
  const url = config?.url || env.url;
  const key = config?.anonKey || env.anonKey;
  return Boolean(
    url &&
    key &&
    url.startsWith("http") &&
    !url.includes("your-project")
  );
}

/**
 * Perform a live ping to test connectivity to Supabase PostgREST
 */
export async function testSupabaseConnection(overrideConfig?: Partial<SupabaseConfig>): Promise<{
  success: boolean;
  message: string;
  statusCode?: number;
}> {
  const env = getSupabaseEnvConfig();
  const url = (overrideConfig?.url || env.url).trim().replace(/\/$/, "");
  const key = (overrideConfig?.anonKey || env.anonKey).trim();

  if (!url || !key) {
    return {
      success: false,
      message: "Please enter both Supabase Project URL and Public Anon Key.",
    };
  }

  try {
    const res = await fetch(`${url}/rest/v1/`, {
      method: "GET",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
    });

    if (res.ok || res.status === 200 || res.status === 404) {
      return {
        success: true,
        statusCode: res.status,
        message: "Successfully connected to Supabase PostgreSQL REST gateway! Connection verified.",
      };
    } else {
      return {
        success: false,
        statusCode: res.status,
        message: `Supabase returned HTTP status ${res.status} (${res.statusText}). Check if your API Key is valid.`,
      };
    }
  } catch (err: any) {
    return {
      success: false,
      message: `Failed to connect to ${url}: ${err.message || "Network timeout or unreachable host"}`,
    };
  }
}
