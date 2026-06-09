import { lazy, Suspense, useEffect, useState } from "react";
import AudioControl from "./components/AudioControl.jsx";
import MenuButton from "./components/MenuButton.jsx";
import ProductsOverlay from "./components/ProductsOverlay.jsx";

const InteractiveWorldSection = lazy(() => import("./sections/InteractiveWorldSection.jsx"));

export default function App() {
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

  function handleFocusSound() {
    document.getElementById("audio-toggle")?.focus();
  }

  return (
    <div className={`app-shell${isProductsOpen ? " app-shell--overlay-open" : ""}`}>
      <MenuButton
        onReturnToWorld={handleReturnToWorld}
        onOpenProducts={() => setIsProductsOpen(true)}
        onFocusSound={handleFocusSound}
      />
      <AudioControl />
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
      <ProductsOverlay isOpen={isProductsOpen} onClose={handleReturnToWorld} />
    </div>
  );
}
