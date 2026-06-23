import { lazy, Suspense, useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import AudioControl from "./components/AudioControl.jsx";
import EntryGate from "./components/EntryGate.jsx";
import MenuButton from "./components/MenuButton.jsx";
import ProductsOverlay from "./components/ProductsOverlay.jsx";

const InteractiveWorldSection = lazy(() => import("./sections/InteractiveWorldSection.jsx"));

export default function App() {
  const [hasEntered, setHasEntered] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);

  useEffect(() => {
    if (!isProductsOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isProductsOpen]);

  function handleReturnToWorld() {
    setIsProductsOpen(false);

    window.requestAnimationFrame(() => {
      document.getElementById("world")?.focus({ preventScroll: true });
    });
  }

  return (
    <div
      className={`app-shell${isProductsOpen ? " app-shell--overlay-open" : ""}${
        hasEntered ? " app-shell--entered" : " app-shell--entry-gated"
      }`}
    >
      {hasEntered && (
        <MenuButton
          onReturnToWorld={handleReturnToWorld}
          onOpenProducts={() => setIsProductsOpen(true)}
        />
      )}
      <AudioControl isVisible={hasEntered} />
      <main className="app-main">
        <Suspense
          fallback={
            <section id="world" className="site-section site-section--world world-section">
              <div className="section-content world-content">
                <p className="section-kicker">Hidden Thoughts</p>
                <h1>Fragments loading quietly.</h1>
              </div>
            </section>
          }
        >
          <InteractiveWorldSection isBlurred={isProductsOpen} />
        </Suspense>
      </main>
      <ProductsOverlay isOpen={hasEntered && isProductsOpen} onClose={handleReturnToWorld} />
      <AnimatePresence>
        {!hasEntered && <EntryGate onEnter={() => setHasEntered(true)} />}
      </AnimatePresence>
    </div>
  );
}
