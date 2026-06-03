import { siteContent } from "../data/siteContent.js";

export default function IntroSection() {
  return (
    <section id="intro" className="site-section site-section--intro">
      <div className="section-content">
        <p className="section-kicker">{siteContent.shortIntro}</p>
        <h1>{siteContent.headline}</h1>
        <p className="section-copy">{siteContent.introText}</p>
      </div>
    </section>
  );
}
