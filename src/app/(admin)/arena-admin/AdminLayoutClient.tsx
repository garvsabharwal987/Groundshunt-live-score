'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AdminSidebar, AdminHeader, MobileAdminNav } from '@/components/admin';
import { ADMIN_PATH } from '@/lib/constants';

interface AdminLayoutClientProps {
  user?: { email: string; role: string };
  children: React.ReactNode;
}

export function AdminLayoutClient({ user, children }: AdminLayoutClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [authUser, setAuthUser] = useState(user);
  const [loading, setLoading] = useState(!user);

  useEffect(() => {
    // Skip auth check for login page
    if (pathname?.includes('/login')) {
      setLoading(false);
      return;
    }

    // If no user from server, check localStorage for hardcoded auth
    if (!user) {
      const storedAuth = localStorage.getItem('adminAuth');
      if (storedAuth) {
        try {
          const parsed = JSON.parse(storedAuth);
          if (parsed.loggedIn) {
            setAuthUser({ email: parsed.email, role: parsed.role });
            setLoading(false);
            return;
          }
        } catch (e) {
          // Invalid stored auth
        }
      }
      // No valid auth, redirect to login
      router.push(`/${ADMIN_PATH}/login`);
    } else {
      setLoading(false);
    }
  }, [user, pathname, router]);

  // For login page, just render children
  if (pathname?.includes('/login')) {
    return <>{children}</>;
  }

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Not authenticated
  if (!authUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <AdminSidebar user={authUser} />
      </div>

      {/* Mobile Navigation */}
      <MobileAdminNav />

      {/* Main Content */}
      <div className="lg:pl-64">
        <AdminHeader user={authUser} />
        <main className="p-6 pt-20 lg:pt-6">
          {children}
        </main>
      </div>
    </div>
  );
}
