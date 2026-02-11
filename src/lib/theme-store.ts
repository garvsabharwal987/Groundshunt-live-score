import { create } from 'zustand';
import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeStore {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  initTheme: () => void;
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
  theme: 'system',
  resolvedTheme: 'dark',
  
  setTheme: (theme: Theme) => {
    set({ theme });
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme);
      applyTheme(theme);
    }
  },
  
  toggleTheme: () => {
    const current = get().theme;
    const newTheme: Theme = current === 'light' ? 'dark' : 'light';
    get().setTheme(newTheme);
  },
  
  initTheme: () => {
    if (typeof window === 'undefined') return;
    
    // Get saved theme from localStorage
    const saved = localStorage.getItem('theme') as Theme | null;
    const theme = saved || 'system';
    
    set({ theme });
    applyTheme(theme);
  },
}));

function applyTheme(theme: Theme) {
  const html = document.documentElement;
  let isDark = theme === 'dark';
  
  if (theme === 'system') {
    isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  
  if (isDark) {
    html.classList.add('dark');
  } else {
    html.classList.remove('dark');
  }
}

export function useTheme() {
  const [mounted, setMounted] = useState(false);
  const { theme, resolvedTheme, setTheme, toggleTheme, initTheme } = useThemeStore();
  
  useEffect(() => {
    setMounted(true);
    initTheme();
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (useThemeStore.getState().theme === 'system') {
        applyTheme('system');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [initTheme]);
  
  return { theme, resolvedTheme, setTheme, toggleTheme, mounted };
}
