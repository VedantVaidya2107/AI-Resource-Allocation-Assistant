'use client';

import { useEffect } from 'react';
import { useStore } from '@/lib/store';

export default function ThemeManager() {
  const { state } = useStore();

  useEffect(() => {
    if (state.theme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
  }, [state.theme]);

  return null;
}
