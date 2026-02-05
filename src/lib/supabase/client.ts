import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '../database.types';

// Note: SQLite mode only works server-side. Client components should use API routes.
export const createClient = () => {
  return createClientComponentClient<Database>();
};

// Singleton instance for client-side
let browserClient: ReturnType<typeof createClient> | null = null;

export const getSupabaseClient = () => {
  if (!browserClient) {
    browserClient = createClient();
  }
  return browserClient;
};
