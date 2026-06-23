import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { navigationItems } from "../data/navigation.js";
import { menuPanel } from "../styles/animations.js";

export default function MenuButton({ onReturnToWorld = () => {}, onOpenProducts = () => {} }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    function handleDocumentClick(event) {
      if (!menuRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleDocumentClick);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  function handleToggle() {
    setIsOpen((currentValue) => !currentValue);
  }

  function handleAction(action) {
    if (action === "world") {
      onReturnToWorld();
    }

    if (action === "products") {
      onOpenProducts();
    }

    setIsOpen(false);
  }

  return (
    <div className="menu-control" ref={menuRef}>
      <button
        type="button"
        className="menu-button"
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close microsite menu" : "Open microsite menu"}
        aria-controls="microsite-menu"
        onClick={handleToggle}
      >
        Menu
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.nav
            id="microsite-menu"
            className="menu-panel texture-surface texture-surface--paper"
            aria-label="Microsite navigation"
            variants={menuPanel}
            initial={shouldReduceMotion ? false : "hidden"}
            animate="show"
            exit={shouldReduceMotion ? undefined : "exit"}
          >
            <ul>
              {navigationItems.map((item) => (
                <li key={item.href ?? item.action}>
                  {item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <button type="button" onClick={() => handleAction(item.action)}>
                      {item.label}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
}
