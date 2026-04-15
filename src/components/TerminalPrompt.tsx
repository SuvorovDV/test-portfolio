import { Fragment } from 'react';
import styles from './TerminalPrompt.module.css';
import { SECTION_IDS, SECTION_LABELS } from '../types/sections';
import { useActiveSection } from '../hooks/useActiveSection';
import { Cursor } from './Cursor';

const USER_HOST = 'guest@portfolio';

export function TerminalPrompt() {
  const active = useActiveSection();

  return (
    <nav aria-label="Primary" className={styles.prompt}>
      <span className={styles.userHost} aria-hidden="true">
        {USER_HOST}
      </span>
      <ul className={styles.commands}>
        {SECTION_IDS.map((id, i) => (
          <Fragment key={id}>
            {i > 0 && (
              <li aria-hidden="true" className={styles.separator}>
                |
              </li>
            )}
            <li>
              <a
                href={`#${id}`}
                className={styles.command}
                aria-current={active === id ? 'location' : undefined}
              >
                cd {SECTION_LABELS[id]}
              </a>
              {active === id && (
                <span className={styles.activeCursor}>
                  <Cursor />
                </span>
              )}
            </li>
          </Fragment>
        ))}
      </ul>
    </nav>
  );
}
