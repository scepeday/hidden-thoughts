import MenuButton from "./components/MenuButton.jsx";
import CreditsSection from "./sections/CreditsSection.jsx";
import IndexSection from "./sections/IndexSection.jsx";
import InteractiveWorldSection from "./sections/InteractiveWorldSection.jsx";
import IntroSection from "./sections/IntroSection.jsx";
import NotesSection from "./sections/NotesSection.jsx";

export default function App() {
  return (
    <>
      <MenuButton />
      <main className="app-shell">
        <IntroSection />
        <IndexSection />
        <InteractiveWorldSection />
        <NotesSection />
        <CreditsSection />
      </main>
    </>
  );
}
