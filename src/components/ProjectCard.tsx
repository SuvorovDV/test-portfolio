import type { Project } from '../types/project';
import { WebAppPreview } from './WebAppPreview';
import { TelegramChatPreview } from './TelegramChatPreview';
import styles from './ProjectCard.module.css';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className={styles.card} aria-labelledby={`project-${project.id}-title`}>
      <header className={styles.header}>
        <h3 id={`project-${project.id}-title`} className={styles.title}>
          {project.title}
        </h3>
        <span className={styles.year}>{project.year}</span>
      </header>

      {project.type === 'web' && (
        <WebAppPreview
          posterSrc={project.posterSrc}
          videoSrc={project.videoSrc}
          title={project.title}
        />
      )}
      {project.type === 'telegram' && (
        <TelegramChatPreview
          title={project.title}
          botUsername={project.botUsername}
          chatScript={project.chatScript}
        />
      )}

      <p className={styles.description}>{project.description}</p>

      <ul className={styles.stack} aria-label="Stack">
        {project.stack.map((tech) => (
          <li key={tech} className={styles.stackItem}>
            {tech}
          </li>
        ))}
      </ul>

      <div className={styles.actions}>
        {project.type === 'web' && (
          <a
            className={styles.actionLink}
            href={project.liveUrl}
            target="_blank"
            rel="noreferrer noopener"
          >
            [live]
          </a>
        )}
        {project.type === 'telegram' && (
          <a
            className={styles.actionLink}
            href={project.botUrl}
            target="_blank"
            rel="noreferrer noopener"
          >
            [open in telegram]
          </a>
        )}
        {project.repoUrl && (
          <a
            className={styles.actionLink}
            href={project.repoUrl}
            target="_blank"
            rel="noreferrer noopener"
          >
            [repo]
          </a>
        )}
      </div>
    </article>
  );
}
