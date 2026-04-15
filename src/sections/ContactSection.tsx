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
    <section id="contact" aria-labelledby="contact-heading" className={styles.contact}>
      <h2 id="contact-heading">Contact</h2>
      <dl className={styles.list}>
        <div className={styles.row}>
          <dt className={styles.label}>Email</dt>
          <dd className={styles.value}>
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          </dd>
          <dd className={styles.action}>
            <CopyButton value={EMAIL} />
          </dd>
        </div>

        <div className={styles.row}>
          <dt className={styles.label}>Telegram</dt>
          <dd className={styles.value}>
            <a href={TELEGRAM_URL} target="_blank" rel="noreferrer noopener">
              {TELEGRAM_HANDLE}
            </a>
          </dd>
        </div>

        <div className={styles.row}>
          <dt className={styles.label}>GitHub</dt>
          <dd className={styles.value}>
            <a href={GITHUB_URL} target="_blank" rel="noreferrer noopener">
              {GITHUB_HANDLE}
            </a>
          </dd>
        </div>
      </dl>
    </section>
  );
}
