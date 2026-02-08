import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '../database.types';

// Check if using local SQLite mode
const USE_LOCAL_SQLITE = process.env.NEXT_PUBLIC_USE_LOCAL_SQLITE === 'true';

export const createServerSupabaseClient = async () => {
  // Use SQLite for local testing
  if (USE_LOCAL_SQLITE) {
    const { createLocalClient } = await import('../sqlite/client');
    return createLocalClient() as any;
  }

  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Handle cookies in Server Components
          }
        },
      },
    }
  );
};

// Admin client with service role (for server-side operations)
export const createAdminSupabaseClient = async () => {
  // Use SQLite for local testing
  if (USE_LOCAL_SQLITE) {
    const { createLocalClient } = await import('../sqlite/client');
    return createLocalClient() as any;
  }

  const cookieStore = await cookies();
  
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Handle cookies in Server Components
          }
        },
      },
    }
  );
};
