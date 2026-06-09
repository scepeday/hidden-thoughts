import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { productsPreview } from "../data/productsPreview.js";
import { noteReveal, softReveal } from "../styles/animations.js";

export default function ProductsOverlay({ isOpen, onClose }) {
  const closeButtonRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  function handleBackdropMouseDown(event) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  function handleImageError(event) {
    event.currentTarget.hidden = true;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="products-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="products-overlay-title"
          aria-describedby="products-overlay-note"
          onMouseDown={handleBackdropMouseDown}
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={shouldReduceMotion ? undefined : { opacity: 0 }}
          transition={{ duration: 0.32 }}
        >
          <motion.div
            className="products-overlay__panel texture-surface texture-surface--paper"
            onMouseDown={(event) => event.stopPropagation()}
            variants={softReveal}
            initial={shouldReduceMotion ? false : "hidden"}
            animate="show"
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: 12 }}
          >
            <button
              ref={closeButtonRef}
              type="button"
              className="products-overlay__close"
              aria-label="Close products preview"
              onClick={onClose}
            >
              Back to World
            </button>

            <div className="products-overlay__heading">
              <p className="section-kicker">Preview only</p>
              <h2 id="products-overlay-title">Product Preview</h2>
              <p id="products-overlay-note">Full shopping experience opens in Shopify.</p>
            </div>

            <div className="products-overlay__grid" aria-label="Product previews">
              {productsPreview.map((product, index) => (
                <motion.article
                  className="product-preview-card texture-surface texture-surface--paper"
                  key={product.name}
                  custom={index}
                  variants={noteReveal}
                  initial={shouldReduceMotion ? false : "hidden"}
                  animate="show"
                >
                  <img
                    src={product.image}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    onError={handleImageError}
                  />
                  <div>
                    <p>{String(index + 1).padStart(2, "0")}</p>
                    <h3>{product.name}</h3>
                    <a
                      href={product.shopUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`View ${product.name} on Shopify`}
                    >
                      View on Shopify ↗
                    </a>
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
