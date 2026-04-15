import { useEffect, useRef } from 'react';
import { Cursor } from './Cursor';
import styles from './BootSequence.module.css';

const LINES: readonly string[] = [
  'Detecting hardware...',
  '  [ OK ] Display',
  '  [ OK ] Phosphor CRT @ 33FF33',
  '  [ OK ] Scanlines emulation',
  '',
  'Loading modules...',
  '  about.mod       [ OK ]',
  '  projects.mod    [ OK ]',
  '  contact.mod     [ OK ]',
];

const STEP_MS = 180;
const FINAL_PAUSE_MS = 500;

interface BootSequenceProps {
  onFinish: () => void;
}

export function BootSequence({ onFinish }: BootSequenceProps) {
  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;

  useEffect(() => {
    const totalMs = LINES.length * STEP_MS + FINAL_PAUSE_MS;
    const autoFinish = window.setTimeout(() => onFinishRef.current(), totalMs);

    const handleKey = (e: KeyboardEvent) => {
      e.preventDefault();
      onFinishRef.current();
    };
    const handleClick = () => onFinishRef.current();

    window.addEventListener('keydown', handleKey);
    window.addEventListener('click', handleClick);

    return () => {
      window.clearTimeout(autoFinish);
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div className={styles.boot} role="status" aria-live="polite" aria-atomic="false">
      <button
        type="button"
        className={styles.skip}
        onClick={(e) => {
          e.stopPropagation();
          onFinishRef.current();
        }}
        aria-label="Skip boot sequence"
      >
        [ skip ]
      </button>

      <header className={styles.header}>
        <span className={styles.line} style={{ animationDelay: '0ms' }}>
          TEST-PORTFOLIO BIOS v1.0
        </span>
        <span className={styles.line} style={{ animationDelay: '100ms' }}>
          Copyright (c) 2026 Suvorov Denis
        </span>
      </header>

      {LINES.map((text, i) => (
        <span
          key={i}
          className={`${styles.line} ${text.includes('[ OK ]') ? styles.ok : ''}`}
          style={{ animationDelay: `${(i + 2) * STEP_MS}ms` }}
        >
          {text || '\u00A0'}
        </span>
      ))}

      <span
        className={`${styles.line} ${styles.final}`}
        style={{ animationDelay: `${(LINES.length + 2) * STEP_MS}ms` }}
      >
        Boot successful. Press any key to continue
        <Cursor />
      </span>
    </div>
  );
}
