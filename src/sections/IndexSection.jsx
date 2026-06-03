import { navigationItems } from "../data/navigation.js";
import { siteContent } from "../data/siteContent.js";

export default function IndexSection() {
  const internalItems = navigationItems.filter((item) => !item.external);

  return (
    <section id="index" className="site-section">
      <div className="section-content">
        <p className="section-kicker">{siteContent.brandName}</p>
        <h2>Index</h2>
        <nav aria-label="Microsite sections">
          <ol className="index-list">
            {internalItems.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </section>
  );
}
