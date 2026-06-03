import { useEffect, useRef, useState } from "react";
import { navigationItems } from "../data/navigation.js";

export default function MenuButton() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

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

  function handleInternalClick() {
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

      {isOpen && (
        <nav
          id="microsite-menu"
          className="menu-panel"
          aria-label="Microsite navigation"
        >
          <ul>
            {navigationItems.map((item) => (
              <li key={item.href}>
                {item.external ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.label}
                  </a>
                ) : (
                  <a href={item.href} onClick={handleInternalClick}>
                    {item.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
