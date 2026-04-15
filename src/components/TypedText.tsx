import { useEffect, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import styles from './TypedText.module.css';

interface TypedTextProps {
  text: string;
  speed?: number;
}

export function TypedText({ text, speed = 40 }: TypedTextProps) {
  const reduced = useReducedMotion();
  const [displayed, setDisplayed] = useState(reduced ? text : '');

  useEffect(() => {
    if (reduced) {
      setDisplayed(text);
      return;
    }
    let i = 0;
    setDisplayed('');
    const timer = setInterval(() => {
      i += 1;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(timer);
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed, reduced]);

  return (
    <>
      <span aria-hidden="true">{displayed}</span>
      <span className={styles.sr}>{text}</span>
    </>
  );
}
