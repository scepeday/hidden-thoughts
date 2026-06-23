import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import whiteLogo from "../assets/brand/white-logo.svg";
import WorldCanvas from "../components/world/WorldCanvas.jsx";
import { worldImages } from "../data/worldImages.js";
import { siteContent } from "../data/siteContent.js";
import { useWorldNavigation } from "../hooks/useWorldNavigation.js";
import { sectionFade, softReveal, viewportOnce } from "../styles/animations.js";

export default function InteractiveWorldSection({ isBlurred = false }) {
  const sectionRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const isInView = useInView(sectionRef, { amount: 0.08 });
  const { cameraLimits, frameRef, isDragging, navigationRef, pointerHandlers } = useWorldNavigation(
    {
      disabled: isBlurred,
      shouldReduceMotion,
    },
  );

  return (
    <motion.section
      ref={sectionRef}
      id="world"
      className={`site-section site-section--world world-section${
        isBlurred ? " world-section--blurred" : ""
      }`}
      tabIndex={-1}
      aria-label="Hidden Thoughts interactive world"
      aria-hidden={isBlurred}
      variants={sectionFade}
      initial={shouldReduceMotion ? false : "hidden"}
      whileInView="show"
      viewport={viewportOnce}
    >
      <div
        ref={frameRef}
        className={`world-canvas-frame${isDragging ? " is-dragging" : ""}`}
        aria-hidden="true"
        {...pointerHandlers}
      >
        <WorldCanvas
          cameraLimits={cameraLimits}
          isActive={isInView && !isBlurred}
          navigationRef={navigationRef}
          shouldReduceMotion={shouldReduceMotion}
          worldImages={worldImages}
        />
      </div>

      <div className="world-archive-labels" aria-hidden="true">
        <span>archive 01 / drag to move</span>
      </div>

      <motion.div
        className="section-content world-content"
        variants={softReveal}
        initial={shouldReduceMotion ? false : "hidden"}
        whileInView="show"
        viewport={viewportOnce}
      >
        <img className="world-logo" src={whiteLogo} alt={siteContent.brandName} />
        <p className="world-statement">{siteContent.headline}</p>
        <p className="section-copy world-copy">{siteContent.worldIntro}</p>
        <p className="world-instruction">drag to move / scroll to zoom</p>
      </motion.div>
    </motion.section>
  );
}
