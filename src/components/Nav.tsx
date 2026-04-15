import styles from './Nav.module.css';
import { SECTION_IDS, SECTION_LABELS } from '../types/sections';
import { useActiveSection } from '../hooks/useActiveSection';

export function Nav() {
  const active = useActiveSection();

  return (
    <nav aria-label="Primary" className={styles.nav}>
      <span className={styles.brand}>SUVOROV DENIS</span>
      <ul className={styles.links}>
        {SECTION_IDS.map((id) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className={styles.link}
              aria-current={active === id ? 'location' : undefined}
            >
              {SECTION_LABELS[id].toUpperCase()}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
