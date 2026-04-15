import styles from './AboutSection.module.css';

const STACK = ['Python', 'TypeScript', 'React', 'aiogram', 'Node.js'];

export function AboutSection() {
  return (
    <section id="about" aria-labelledby="about-heading" className={styles.about}>
      <h2 id="about-heading">About</h2>
      <p className={styles.lead}>
        Full-stack developer building <span className={styles.leadAccent}>web apps</span> and{' '}
        <span className={styles.leadAccent}>Telegram bots</span>.
      </p>
      <p className={styles.body}>
        I design and ship end-to-end products — from database and bot-logic in Python to frontends
        in TypeScript. Based on comfort with both halves of the stack.
      </p>
      <p className={styles.stackLabel}>Stack</p>
      <ul className={styles.stack}>
        {STACK.map((s) => (
          <li key={s} className={styles.stackItem}>
            {s}
          </li>
        ))}
      </ul>
    </section>
  );
}
