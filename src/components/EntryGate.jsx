import { motion, useReducedMotion } from "framer-motion";
import whiteLogo from "../assets/brand/white-logo.svg";
import { cinematicEase } from "../styles/animations.js";

export default function EntryGate({ onEnter }) {
  const shouldReduceMotion = useReducedMotion();

  function handleEnter() {
    window.dispatchEvent(new CustomEvent("hidden-thoughts:start-audio"));
    onEnter();
  }

  return (
    <motion.div
      className="entry-gate"
      role="dialog"
      aria-modal="true"
      aria-labelledby="entry-gate-title"
      aria-describedby="entry-gate-copy"
      initial={shouldReduceMotion ? false : { opacity: 1 }}
      exit={shouldReduceMotion ? undefined : { opacity: 0 }}
      transition={{ duration: 0.7, ease: cinematicEase }}
    >
      <div className="entry-gate__inner">
        <img className="entry-gate__logo" src={whiteLogo} alt="" aria-hidden="true" />
        <p id="entry-gate-title" className="entry-gate__title">
          Hidden Thoughts
        </p>
        <p id="entry-gate-copy" className="entry-gate__copy">
          Sound on. Enter the world when you are ready.
        </p>
        <button type="button" className="entry-gate__button" onClick={handleEnter} autoFocus>
          Enter
        </button>
      </div>
    </motion.div>
  );
}
