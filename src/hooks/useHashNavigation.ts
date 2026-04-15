import { useEffect } from 'react';
import { SECTION_IDS, type SectionId } from '../types/sections';
import { useReducedMotion } from './useReducedMotion';

function isSectionId(value: string): value is SectionId {
  return (SECTION_IDS as readonly string[]).includes(value);
}

export function useHashNavigation(): void {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const behavior: ScrollBehavior = reducedMotion ? 'auto' : 'smooth';

    const scrollToHash = (hash: string) => {
      const id = hash.replace(/^#/, '');
      if (!isSectionId(id)) return;
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior, block: 'start' });
    };

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest('a');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      const id = href.slice(1);
      if (!isSectionId(id)) return;
      e.preventDefault();
      history.pushState(null, '', href);
      scrollToHash(href);
    };

    const onPopState = () => {
      if (window.location.hash) scrollToHash(window.location.hash);
    };

    if (window.location.hash) {
      queueMicrotask(() => scrollToHash(window.location.hash));
    }

    document.addEventListener('click', onClick);
    window.addEventListener('popstate', onPopState);

    return () => {
      document.removeEventListener('click', onClick);
      window.removeEventListener('popstate', onPopState);
    };
  }, [reducedMotion]);
}
