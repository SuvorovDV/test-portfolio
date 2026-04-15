import type { ReactNode } from 'react';
import styles from './CRTShell.module.css';

interface CRTShellProps {
  children: ReactNode;
}

export function CRTShell({ children }: CRTShellProps) {
  return (
    <div className={styles.shell}>
      <div className={styles.scanlines} aria-hidden="true" />
      <div className={styles.vignette} aria-hidden="true" />
      {children}
    </div>
  );
}
