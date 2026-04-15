import { CopyButton } from '../components/CopyButton';
import styles from './ContactSection.module.css';

const EMAIL_USER = 'erkobraxx';
const EMAIL_DOMAIN = 'gmail.com';
const EMAIL = `${EMAIL_USER}@${EMAIL_DOMAIN}`;

const TELEGRAM_HANDLE = '@Suvorovdv';
const TELEGRAM_URL = 'https://t.me/Suvorovdv';

const GITHUB_HANDLE = 'github.com/SuvorovDV';
const GITHUB_URL = 'https://github.com/SuvorovDV';

export function ContactSection() {
  return (
    <section id="contact" aria-labelledby="contact-heading">
      <h2 id="contact-heading">contact</h2>
      <dl className={styles.list}>
        <dt className={styles.label}>email</dt>
        <dd className={styles.value}>
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
        </dd>
        <dd className={styles.action}>
          <CopyButton value={EMAIL} />
        </dd>

        <dt className={styles.label}>telegram</dt>
        <dd className={styles.value}>
          <a href={TELEGRAM_URL} target="_blank" rel="noreferrer noopener">
            {TELEGRAM_HANDLE}
          </a>
        </dd>
        <dd className={styles.action}>
          <a href={TELEGRAM_URL} target="_blank" rel="noreferrer noopener">
            [open]
          </a>
        </dd>

        <dt className={styles.label}>github</dt>
        <dd className={styles.value}>
          <a href={GITHUB_URL} target="_blank" rel="noreferrer noopener">
            {GITHUB_HANDLE}
          </a>
        </dd>
        <dd className={styles.action}>
          <a href={GITHUB_URL} target="_blank" rel="noreferrer noopener">
            [open]
          </a>
        </dd>
      </dl>
    </section>
  );
}
