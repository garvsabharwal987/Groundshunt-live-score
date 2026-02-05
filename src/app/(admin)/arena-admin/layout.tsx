import { createServerSupabaseClient } from '@/lib/supabase/server';
import { AdminLayoutClient } from './AdminLayoutClient';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabaseClient();
  
  const { data: { user } } = await supabase.auth.getUser();

  // If no Supabase user, let client-side handle auth (for hardcoded login)
  if (!user) {
    return <AdminLayoutClient>{children}</AdminLayoutClient>;
  }

  // Get user role from database
  const { data: userData } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  // If user exists but not valid, let client-side handle
  if (!userData || !userData.is_active) {
    return <AdminLayoutClient>{children}</AdminLayoutClient>;
  }

  const userInfo = {
    email: user.email || '',
    role: userData.role,
  };

  return <AdminLayoutClient user={userInfo}>{children}</AdminLayoutClient>;
}
