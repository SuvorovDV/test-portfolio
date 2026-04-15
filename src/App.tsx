import { AboutSection } from './sections/AboutSection';
import { ProjectsSection } from './sections/ProjectsSection';
import { ContactSection } from './sections/ContactSection';
import { CRTShell } from './components/CRTShell';
import { TerminalPrompt } from './components/TerminalPrompt';
import { BootSequence } from './components/BootSequence';
import { useBootShown } from './hooks/useBootShown';
import { useHashNavigation } from './hooks/useHashNavigation';

export function App() {
  const { shown, markShown } = useBootShown();
  useHashNavigation();

  if (!shown) {
    return <BootSequence onFinish={markShown} />;
  }

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
