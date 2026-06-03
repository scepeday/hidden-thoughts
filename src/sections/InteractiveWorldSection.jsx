import { siteContent } from "../data/siteContent.js";

export default function InteractiveWorldSection() {
  return (
    <section id="world" className="site-section site-section--world">
      <div className="texture-overlay texture-overlay--noise" aria-hidden="true" />
      <div className="section-content">
        <p className="section-kicker">Interactive world</p>
        <h2>{siteContent.brandName}</h2>
        <ul className="fragment-list" aria-label="Poetic fragments">
          {siteContent.manifesto.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
