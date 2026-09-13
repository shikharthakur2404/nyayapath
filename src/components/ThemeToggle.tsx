'use client';

import { useSyncExternalStore } from 'react';
import { Sun, Moon } from 'lucide-react';
import { haptic } from '@/lib/haptics';

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  const observer = new MutationObserver(() => callback());
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  return () => {
    window.removeEventListener('storage', callback);
    observer.disconnect();
  };
}

function getSnapshot() {
  return document.documentElement.classList.contains('dark');
}

function getServerSnapshot() {
  return false;
}

export default function ThemeToggle() {
  const isDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleTheme = () => {
    haptic.selection();
    const nextDark = !isDark;
    if (nextDark) {
      document.documentElement.classList.add('dark');
      try {
        localStorage.setItem('nyayapath-theme', 'dark');
      } catch {
        // Safe ignore
      }
    } else {
      document.documentElement.classList.remove('dark');
      try {
        localStorage.setItem('nyayapath-theme', 'light');
      } catch {
        // Safe ignore
      }
    }
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-blue-950/80 dark:hover:bg-blue-900 border border-slate-300 dark:border-blue-800/70 text-slate-700 dark:text-slate-200 transition-all cursor-pointer shadow-xs text-xs font-semibold select-none shrink-0"
      title={isDark ? 'Switch to Light Mode (दिन का दृश्य)' : 'Switch to Dark Mode (रात का दृश्य)'}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {isDark ? (
        <>
          <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="font-indic text-[11px] sm:text-xs">दिन • Light</span>
        </>
      ) : (
        <>
          <Moon className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span className="font-indic text-[11px] sm:text-xs text-slate-800">रात • Dark</span>
        </>
      )}
    </button>
  );
}
