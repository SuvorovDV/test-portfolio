import { AboutSection } from './sections/AboutSection';
import { ProjectsSection } from './sections/ProjectsSection';
import { ContactSection } from './sections/ContactSection';
import { CRTShell } from './components/CRTShell';
import { TerminalPrompt } from './components/TerminalPrompt';
import { useHashNavigation } from './hooks/useHashNavigation';

export function App() {
  useHashNavigation();

  return (
    <CRTShell>
      <TerminalPrompt />
      <main>
        <AboutSection />
        <ProjectsSection />
        <ContactSection />
      </main>
    </CRTShell>
  );
}
