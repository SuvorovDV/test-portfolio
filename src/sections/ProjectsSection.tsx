import { ProjectCard } from '../components/ProjectCard';
import { PROJECTS } from '../data/projects';
import styles from './ProjectsSection.module.css';

export function ProjectsSection() {
  return (
    <section id="projects" aria-labelledby="projects-heading">
      <h2 id="projects-heading">projects</h2>
      <div className={styles.grid}>
        {PROJECTS.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
