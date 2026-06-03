import { siteContent } from "../data/siteContent.js";

export default function CreditsSection() {
  return (
    <section id="credits" className="site-section site-section--credits">
      <div className="section-content">
        <p className="section-kicker">Credits</p>
        <h2>{siteContent.brandName}</h2>
        <p className="section-copy">{siteContent.credits}</p>
      </div>
    </section>
  );
}
