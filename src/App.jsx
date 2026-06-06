import { lazy, Suspense } from "react";
import MenuButton from "./components/MenuButton.jsx";
import CreditsSection from "./sections/CreditsSection.jsx";
import IndexSection from "./sections/IndexSection.jsx";
import IntroSection from "./sections/IntroSection.jsx";
import NotesSection from "./sections/NotesSection.jsx";

const InteractiveWorldSection = lazy(() => import("./sections/InteractiveWorldSection.jsx"));

export default function App() {
  return (
    <>
      <MenuButton />
      <main className="app-shell">
        <IntroSection />
        <IndexSection />
        <Suspense
          fallback={
            <section id="world" className="site-section site-section--world">
              <div className="section-content world-content">
                <p className="section-kicker">Atmospheric collage space</p>
                <h2>Fragments loading quietly.</h2>
              </div>
            </section>
          }
        >
          <InteractiveWorldSection />
        </Suspense>
        <NotesSection />
        <CreditsSection />
      </main>
    </>
  );
}
