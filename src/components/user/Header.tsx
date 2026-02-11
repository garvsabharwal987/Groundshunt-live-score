'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Radio, 
  Calendar, 
  Trophy, 
  Newspaper,
  Menu,
  X,
  Moon,
  Sun
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/lib/theme-store';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/live', label: 'Live', icon: Radio },
  { href: '/fixtures', label: 'Fixtures', icon: Calendar },
  { href: '/standings', label: 'Standings', icon: Trophy },
  { href: '/news', label: 'News', icon: Newspaper },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme, mounted } = useTheme();

  return (
    <header className="sticky top-0 z-40 bg-black dark:bg-slate-800 border-b border-orange-500 dark:border-orange-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image 
              src="/logo.svg" 
              alt="Groundshunt Arena" 
              width={40} 
              height={40} 
              className="h-10 w-auto"
            />
            <div className="hidden sm:block">
              <span className="font-bold text-white">Groundshunt</span>
              <span className="font-light text-orange-400 ml-1">Arena</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-orange-500 text-black'
                      : 'text-gray-300 dark:text-slate-200 hover:bg-gray-900 dark:hover:bg-slate-700 hover:text-orange-400'
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                  {item.label === 'Live' && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Theme Toggle & Mobile Menu Button */}
          <div className="flex items-center gap-2">
            {mounted && (
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-gray-300 dark:text-slate-300 hover:bg-gray-900 dark:hover:bg-slate-700 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'light' || (theme === 'system' && typeof window !== 'undefined' && !window.matchMedia('(prefers-color-scheme: dark)').matches) ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
              </button>
            )}
            
            <button
              className="md:hidden p-2 rounded-lg text-orange-400 hover:bg-gray-900 dark:hover:bg-slate-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-orange-500 bg-gray-900 dark:bg-slate-700">
          <nav className="px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-orange-500 text-black'
                      : 'text-gray-300 dark:text-slate-200 hover:bg-black dark:hover:bg-slate-600 hover:text-orange-400'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
