'use client';

import React, { useEffect, ReactNode } from 'react';
import { useThemeStore } from '@/lib/theme-store';

export function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const initTheme = useThemeStore.getState().initTheme;
    initTheme();
  }, []);

  return <>{children}</>;
}
