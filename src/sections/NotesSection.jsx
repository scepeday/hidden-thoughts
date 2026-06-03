import { siteContent } from "../data/siteContent.js";

export default function NotesSection() {
  const { noteScreen } = siteContent;

  return (
    <section id="notes" className="site-section">
      <article className="section-content note-panel">
        <p className="section-kicker">{noteScreen.eyebrow}</p>
        <h2>{noteScreen.title}</h2>
        <p className="section-copy">{noteScreen.text}</p>
        <ul className="fragment-list" aria-label="Note fragments">
          {noteScreen.fragments.map((fragment) => (
            <li key={fragment}>{fragment}</li>
          ))}
        </ul>
      </article>
    </section>
  );
}
