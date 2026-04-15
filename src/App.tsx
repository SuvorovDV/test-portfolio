import { AboutSection } from './sections/AboutSection';
import { ProjectsSection } from './sections/ProjectsSection';
import { ContactSection } from './sections/ContactSection';
import { Nav } from './components/Nav';
import { useHashNavigation } from './hooks/useHashNavigation';

export function App() {
  useHashNavigation();

  return (
    <>
      <Nav />
      <main>
        <AboutSection />
        <ProjectsSection />
        <ContactSection />
      </main>
    </>
  );
}
