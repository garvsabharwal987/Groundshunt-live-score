import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '../database.types';

// Note: SQLite mode only works server-side. Client components should use API routes.
export const createClient = () => {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};

// Singleton instance for client-side
let browserClient: ReturnType<typeof createClient> | null = null;

export const getSupabaseClient = () => {
  if (!browserClient) {
    browserClient = createClient();
  }
  return browserClient;
};
