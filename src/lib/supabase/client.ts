import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '../database.types';
import type { SupabaseClient } from '@supabase/supabase-js';

// Note: SQLite mode only works server-side. Client components should use API routes.
export const createClient = () => {
  return createClientComponentClient<Database>();
};

// Singleton instance for client-side
let browserClient: SupabaseClient<Database> | null = null;

export const getSupabaseClient = (): SupabaseClient<Database> => {
  if (!browserClient) {
    browserClient = createClient();
  }
  return browserClient;
};
