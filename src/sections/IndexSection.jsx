import { motion } from "framer-motion";
import { siteContent } from "../data/siteContent.js";

const chapterItems = [
  {
    href: "#intro",
    label: "Enter quietly",
  },
  {
    href: "#world",
    label: "Move through the fragments",
  },
  {
    href: "#notes",
    label: "Read what stayed private",
  },
  {
    href: "#credits",
    label: "Leave the room",
  },
];

export default function IndexSection() {
  return (
    <motion.section
      id="index"
      className="site-section site-section--index"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.45 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="section-content index-content"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.45 }}
        transition={{ duration: 1.1, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="index-header">
          <p className="section-kicker">{siteContent.shortIntro}</p>
          <h2>Index of quiet things</h2>
        </div>

        <nav className="index-chapters" aria-label="Microsite chapters">
          <ol className="index-list">
            {chapterItems.map((item, index) => (
              <motion.li
                key={item.href}
                initial={{ opacity: 0, x: -18 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{
                  duration: 0.9,
                  delay: 0.22 + index * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <a href={item.href}>
                  <span>{item.label}</span>
                  <small>{siteContent.manifesto[index]}</small>
                </a>
              </motion.li>
            ))}
          </ol>
        </nav>

        <p className="index-fragment" aria-hidden="true">
          {siteContent.manifesto[4]}
        </p>
      </motion.div>
    </motion.section>
  );
}
