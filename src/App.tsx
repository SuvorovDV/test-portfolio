import { AboutSection } from './sections/AboutSection';
import { ProjectsSection } from './sections/ProjectsSection';
import { ContactSection } from './sections/ContactSection';
import { useActiveSection } from './hooks/useActiveSection';
import { useHashNavigation } from './hooks/useHashNavigation';
import { SECTION_IDS, SECTION_LABELS } from './types/sections';

export function App() {
  const active = useActiveSection();
  useHashNavigation();

  return (
    <>
      <nav aria-label="Primary">
        <ul>
          {SECTION_IDS.map((id) => (
            <li key={id}>
              <a href={`#${id}`} aria-current={active === id ? 'location' : undefined}>
                cd {SECTION_LABELS[id]}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <main>
        <AboutSection />
        <ProjectsSection />
        <ContactSection />
      </main>
    </>
  );
}
