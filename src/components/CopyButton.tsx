import { useState } from 'react';
import styles from './CopyButton.module.css';

interface CopyButtonProps {
  value: string;
  label?: string;
  copiedLabel?: string;
}

export function CopyButton({
  value,
  label = '[copy]',
  copiedLabel = '[copied]',
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard API may fail on non-secure origins — silent no-op */
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${styles.button} ${copied ? styles.copied : ''}`}
      aria-live="polite"
    >
      {copied ? copiedLabel : label}
    </button>
  );
}
