import { motion } from "framer-motion";
import collage01 from "../../assets/web/collage/collage-01.jpg";
import collage03 from "../../assets/web/collage/collage-03.jpg";
import collage06 from "../../assets/web/collage/collage-06.jpg";
import collage08 from "../../assets/web/collage/collage-08.jpg";
import { siteContent } from "../data/siteContent.js";

const collageItems = [
  {
    src: collage01,
    className: "world-image world-image--one",
  },
  {
    src: collage03,
    className: "world-image world-image--two",
  },
  {
    src: collage06,
    className: "world-image world-image--three",
  },
  {
    src: collage08,
    className: "world-image world-image--four",
  },
];

export default function InteractiveWorldSection() {
  return (
    <motion.section
      id="world"
      className="site-section site-section--world"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="texture-overlay texture-overlay--noise" aria-hidden="true" />

      <div className="world-collage" aria-hidden="true">
        {collageItems.map((item, index) => (
          <motion.figure
            className={item.className}
            key={item.src}
            initial={{ opacity: 0, y: 30, rotate: index % 2 === 0 ? -4 : 4 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{
              duration: 1.4,
              delay: 0.16 + index * 0.12,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <img src={item.src} alt="" />
          </motion.figure>
        ))}

        <span className="world-line world-line--one" />
        <span className="world-line world-line--two" />
        <span className="world-orbit" />
      </div>

      <motion.div
        className="section-content world-content"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1.1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="section-kicker">Atmospheric collage space</p>
        <h2>Fragments that do not settle.</h2>
        <ul className="world-fragments" aria-label="Poetic fragments">
          {siteContent.manifesto.map((line, index) => (
            <motion.li
              key={line}
              initial={{ opacity: 0, x: index % 2 === 0 ? -16 : 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.45 }}
              transition={{
                duration: 0.9,
                delay: 0.52 + index * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {line}
            </motion.li>
          ))}
        </ul>
        <p className="world-instruction">drag to explore</p>
      </motion.div>
    </motion.section>
  );
}
