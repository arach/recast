'use client';

import { useEffect } from 'react';
import { useUIStore } from '@/lib/stores/uiStore';

export function DarkModeProvider({ children }: { children: React.ReactNode }) {
  const { darkMode } = useUIStore();

  useEffect(() => {
    // Update the dark class on the HTML element
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return <>{children}</>;
}