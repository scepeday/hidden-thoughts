import { motion } from "framer-motion";
import introImage from "../../assets/intro/intro-image.jpg";
import { siteContent } from "../data/siteContent.js";

export default function IntroSection() {
  return (
    <motion.section
      id="intro"
      className="site-section site-section--intro"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="intro-image-frame"
        aria-hidden="true"
        initial={{ opacity: 0, y: 18, scale: 1.04 }}
        animate={{ opacity: 0.52, y: 0, scale: 1 }}
        transition={{ duration: 2.4, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <img src={introImage} alt="" />
      </motion.div>

      <motion.div
        className="section-content intro-content"
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.4, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="intro-brand">{siteContent.brandName}</p>
        <h1>{siteContent.headline}</h1>
        <p className="section-copy intro-copy">{siteContent.shortIntro}</p>
        <p className="intro-instruction">Scroll / drag / listen</p>
      </motion.div>
    </motion.section>
  );
}
