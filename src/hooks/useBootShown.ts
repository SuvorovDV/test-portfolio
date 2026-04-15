import { useCallback, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';

const STORAGE_KEY = 'portfolio:boot-shown';

function readFlag(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return true;
  }
}

function writeFlag(): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, '1');
  } catch {
    /* no-op */
  }
}

export function useBootShown(): { shown: boolean; markShown: () => void } {
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(() => reduced || readFlag());

  const markShown = useCallback(() => {
    writeFlag();
    setShown(true);
  }, []);

  return { shown, markShown };
}
