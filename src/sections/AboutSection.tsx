import { TypedText } from '../components/TypedText';
import { Cursor } from '../components/Cursor';
import styles from './AboutSection.module.css';

export function AboutSection() {
  return (
    <section id="about" aria-labelledby="about-heading" className={styles.about}>
      <h2 id="about-heading">about</h2>
      <pre>
        <span className={`${styles.line} ${styles.nameLine}`}>
          <span className={styles.prompt}>&gt;</span>
          <TypedText text="Suvorov Denis" />
          <Cursor />
        </span>
        <span className={styles.line}>
          <span className={styles.prompt}>&gt;</span>
          full-stack developer
        </span>
        <span className={styles.line}>
          <span className={styles.prompt}>&gt;</span>
          python · javascript/typescript · aiogram
        </span>
        <span className={styles.line}>
          <span className={styles.prompt}>&gt;</span>
          building web apps and telegram bots
        </span>
      </pre>
    </section>
  );
}
