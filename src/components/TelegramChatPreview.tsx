import type { ChatMessage } from '../types/project';
import styles from './TelegramChatPreview.module.css';

interface TelegramChatPreviewProps {
  title: string;
  botUsername: string;
  chatScript: ChatMessage[];
}

export function TelegramChatPreview({
  title,
  botUsername,
  chatScript,
}: TelegramChatPreviewProps) {
  const initial = title.charAt(0).toUpperCase();

  return (
    <div className={styles.wrapper} role="img" aria-label={`Dialog preview for ${title} bot`}>
      <header className={styles.header}>
        <span className={styles.avatar} aria-hidden="true">
          {initial}
        </span>
        <span className={styles.botName}>
          <span>{title}</span>
          <span className={styles.username}>{botUsername}</span>
        </span>
      </header>

      <div className={styles.messages}>
        {chatScript.map((msg, idx) => (
          <div
            key={idx}
            className={`${styles.messageRow} ${
              msg.from === 'bot' ? styles.messageRowBot : styles.messageRowUser
            }`}
          >
            <div
              className={`${styles.bubble} ${
                msg.from === 'bot' ? styles.bubbleBot : styles.bubbleUser
              }`}
            >
              {msg.text}
            </div>
            {msg.timestamp && <span className={styles.timestamp}>{msg.timestamp}</span>}

            {msg.from === 'bot' && msg.buttons && msg.buttons.length > 0 && (
              <div className={styles.keyboard} aria-hidden="true">
                {msg.buttons.map((row, rowIdx) => (
                  <div key={rowIdx} className={styles.keyboardRow}>
                    {row.map((btn, btnIdx) => (
                      <span key={btnIdx} className={styles.keyboardButton}>
                        {btn}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <footer className={styles.footer}>preview — not a live bot</footer>
    </div>
  );
}
