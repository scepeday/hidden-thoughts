import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { productsPreview } from "../data/productsPreview.js";
import { fetchShopifyProductPreviews } from "../data/shopifyProducts.js";
import { noteReveal, softReveal } from "../styles/animations.js";

export default function ProductsOverlay({ isOpen, onClose }) {
  const closeButtonRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const [shopifyProducts, setShopifyProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [productsError, setProductsError] = useState("");

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

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    let isCancelled = false;

    async function loadProducts() {
      setIsLoadingProducts(true);
      setProductsError("");

      try {
        const products = await fetchShopifyProductPreviews(3);

        if (!isCancelled) {
          setShopifyProducts(products);
        }
      } catch {
        if (!isCancelled) {
          setProductsError("Live Shopify preview unavailable. Showing archived preview.");
        }
      } finally {
        if (!isCancelled) {
          setIsLoadingProducts(false);
        }
      }
    }

    loadProducts();

    return () => {
      isCancelled = true;
    };
  }, [isOpen]);

  function handleBackdropMouseDown(event) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  function handleImageError(event) {
    event.currentTarget.hidden = true;
  }

  function preventOverlayScroll(event) {
    event.preventDefault();
  }

  const previewProducts = (shopifyProducts.length ? shopifyProducts : productsPreview).slice(0, 3);

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
          onWheel={preventOverlayScroll}
          onTouchMove={preventOverlayScroll}
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

            {(isLoadingProducts || productsError) && (
              <p className="products-overlay__status" aria-live="polite">
                {isLoadingProducts ? "Loading Shopify preview." : productsError}
              </p>
            )}

            <div className="products-overlay__grid" aria-label="Product previews">
              {previewProducts.map((product, index) => (
                <motion.a
                  className="product-preview-card texture-surface texture-surface--paper"
                  href={product.shopUrl}
                  key={product.id || product.name}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${product.name} on Shopify`}
                  custom={index}
                  variants={noteReveal}
                  initial={shouldReduceMotion ? false : "hidden"}
                  animate="show"
                >
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.imageAlt || ""}
                      loading="lazy"
                      decoding="async"
                      onError={handleImageError}
                    />
                  )}
                  <div>
                    <p>{product.label || String(index + 1).padStart(2, "0")}</p>
                    <h3>{product.name}</h3>
                    <span>View on Shopify ↗</span>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
