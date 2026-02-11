'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Radio, Calendar, Trophy, Newspaper } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/live', label: 'Live', icon: Radio },
  { href: '/fixtures', label: 'Fixtures', icon: Calendar },
  { href: '/standings', label: 'Standings', icon: Trophy },
  { href: '/news', label: 'News', icon: Newspaper },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-black dark:bg-slate-800 border-t border-orange-500">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 flex-1 py-2',
                isActive ? 'text-orange-500' : 'text-gray-400 dark:text-slate-400 hover:text-orange-400'
              )}
            >
              <div className="relative">
                <item.icon className="h-5 w-5" />
                {item.label === 'Live' && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                )}
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
