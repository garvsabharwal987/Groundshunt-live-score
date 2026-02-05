'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Calendar, 
  Radio, 
  Users, 
  Trophy,
  Medal,
  Newspaper,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ADMIN_PATH } from '@/lib/constants';
import { getSupabaseClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

const navItems = [
  { href: '', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/fixtures', label: 'Fixtures', icon: Calendar },
  { href: '/live-scoring', label: 'Live Scoring', icon: Radio },
  { href: '/teams', label: 'Teams', icon: Users },
  { href: '/sports', label: 'Sports', icon: Trophy },
  { href: '/standings', label: 'Standings', icon: Medal },
  { href: '/news', label: 'News', icon: Newspaper },
  { href: '/audit-logs', label: 'Audit Logs', icon: FileText },
  { href: '/settings', label: 'Settings', icon: Settings },
];

interface AdminSidebarProps {
  user?: { email: string; role: string };
}

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const basePath = `/${ADMIN_PATH}`;

  const handleLogout = async () => {
    const supabase = getSupabaseClient();
    await supabase.auth.signOut();
    router.push(`/${ADMIN_PATH}/login`);
  };

  return (
    <aside className={cn(
      'fixed left-0 top-0 h-full bg-gray-900 text-white transition-all duration-300 z-50',
      collapsed ? 'w-16' : 'w-64'
    )}>
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
        {!collapsed && (
          <Link href={basePath} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <Trophy className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-sm">SPORTIKON</span>
              <span className="text-xs text-gray-400 block">Admin Panel</span>
            </div>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          {collapsed ? <Menu className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1">
        {navItems.map((item) => {
          const href = `${basePath}${item.href}`;
          const isActive = pathname === href || 
            (item.href !== '' && pathname.startsWith(href));
          
          return (
            <Link
              key={item.href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                isActive
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span className="text-sm">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
        {user && !collapsed && (
          <div className="mb-3">
            <p className="text-sm font-medium text-white truncate">{user.email}</p>
            <p className="text-xs text-gray-400 capitalize">{user.role}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg w-full',
            'text-gray-400 hover:bg-gray-800 hover:text-white transition-colors'
          )}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span className="text-sm">Logout</span>}
        </button>
      </div>
    </aside>
  );
}

export function AdminHeader({ user }: { user?: { email: string; role: string } }) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div>
        <Link href="/" target="_blank" className="text-sm text-gray-500 hover:text-gray-700">
          View Public Site →
        </Link>
      </div>
      
      <div className="flex items-center gap-4">
        {user && (
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">{user.email}</p>
            <p className="text-xs text-gray-500 capitalize">{user.role}</p>
          </div>
        )}
      </div>
    </header>
  );
}

export function MobileAdminNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const basePath = `/${ADMIN_PATH}`;

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-gray-900 text-white flex items-center justify-between px-4 z-50">
        <Link href={basePath} className="flex items-center gap-2">
          <Trophy className="h-6 w-6 text-primary-400" />
          <span className="font-bold">Admin</span>
        </Link>
        <button onClick={() => setOpen(!open)} className="p-2">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </header>

      {/* Mobile Menu */}
      {open && (
        <div className="lg:hidden fixed inset-0 top-16 bg-gray-900 z-40 overflow-y-auto">
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const href = `${basePath}${item.href}`;
              const isActive = pathname === href;
              
              return (
                <Link
                  key={item.href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                    isActive
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </>
  );
}
