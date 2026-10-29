import { Link } from "react-router-dom";
import "../styles/about.css";
import { PageHero, Breadcrumb, Reveal } from "../components/ui";
import { listedScenarios, sourceVerifiedCount } from "../lib/content";
import { RELEASE_LABEL } from "../lib/release";

const AWAITING_CHECK = listedScenarios.length - sourceVerifiedCount;
const LATEST_REVIEW = listedScenarios
  .map((s) => s.lastReviewed)
  .filter((date): date is string => Boolean(date))
  .sort()
  .pop();
const LATEST_REVIEW_LABEL = LATEST_REVIEW
  ? new Date(`${LATEST_REVIEW}T00:00:00`).toLocaleDateString("en-GB", { month: "short", year: "numeric" })
  : "—";

const TOC = [
  { id: "scope", label: "Scope & honesty" },
  { id: "review", label: "How we review" },
  { id: "offline", label: "Offline & updates" },
  { id: "privacy", label: "Privacy" },
  { id: "corrections", label: "Corrections" },
  { id: "disclaimer", label: "Legal disclaimer" },
];

const PROCESS_STEPS = [
  { n: 1, title: "Drafted from sources", desc: "Researchers read the Act, regulation or official guidance and draft the scenario in plain language." },
  { n: 2, title: "Checked against the official text", desc: "Every citation is compared with the document published on the issuing agency's portal, and section numbers are corrected when the text disagrees." },
  { n: 3, title: "Dated & labelled", desc: "Each guide shows when it was checked and who checked it. A guide is marked source-verified only after that check happens." },
  { n: 4, title: "Corrected openly", desc: "Material changes are checked against the sources and recorded in a dated change history." },
];

export default function About() {
  return (
    <>
      {/* Page hero */}
      <PageHero
        breadcrumb={
          <Breadcrumb trail={[{ label: "Home", href: "/" }, { label: "About" }]} />
        }
        title="About this guide"
        lede="What this is, what it isn't, how every answer gets reviewed, and why we collect almost nothing about you."
        ledeStyle={{ maxWidth: 600, marginTop: 14, animationDelay: ".12s" }}
      />

      <div className="container">
        <div className="about-grid">

          {/* Main column */}
          <div>

            {/* Scope */}
            <section className="about-section" id="scope">
              <Reveal as="h2">Scope &amp; honesty</Reveal>
              <Reveal as="p" className="sub">A guide you can trust starts with being clear about what it can and cannot do.</Reveal>

              <div className="split-cards">
                <div className="split-card reveal">
                  <h3 style={{ color: "var(--link)" }}>
                    <svg width="19" height="19" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.4"/><path d="m5.8 9.2 2.2 2.2 4.2-4.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    What this is
                  </h3>
                  <ul className="split-list">
                    <li><span className="ico ico--ok">✓</span><span><strong>Plain-language summaries</strong> of Nigerian law on roadside encounters, in one place.</span></li>
                    <li><span className="ico ico--ok">✓</span><span><strong>Source-backed:</strong> every answer links the actual Act, regulation or official guidance.</span></li>
                    <li><span className="ico ico--ok">✓</span><span><strong>Safety-first:</strong> practical steps ordered by what protects you in the moment.</span></li>
                    <li><span className="ico ico--ok">✓</span><span><strong>Free and anonymous</strong> — no account, no data trail, works offline.</span></li>
                  </ul>
                </div>

                <div className="split-card split-card--no reveal" style={{ transitionDelay: ".08s" }}>
                  <h3 style={{ color: "var(--danger)" }}>
                    <svg width="19" height="19" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.4"/><path d="m6.2 6.2 5.6 5.6M11.8 6.2l-5.6 5.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
                    What this is not
                  </h3>
                  <ul className="split-list">
                    <li><span className="ico ico--no">✗</span><span><strong>Not legal advice.</strong> It's source-checked information about the law, not advice on your specific case.</span></li>
                    <li><span className="ico ico--no">✗</span><span><strong>Not a lawyer.</strong> For your situation, the help directory connects you to real counsel.</span></li>
                    <li><span className="ico ico--no">✗</span><span><strong>Not a guarantee of outcomes.</strong> Enforcement practice varies; the law is one part of the encounter.</span></li>
                    <li><span className="ico ico--no">✗</span><span><strong>Not complete.</strong> Coverage grows as legal review finishes — gaps are labelled, not hidden.</span></li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Review process */}
            <section className="about-section" id="review">
              <Reveal as="h2">How every scenario gets reviewed</Reveal>
              <Reveal as="p" className="sub">Every guide is checked against the official text published by the issuing agency. Its check date and the remaining source gaps are shown on the page.</Reveal>

              <div className="process">
                {PROCESS_STEPS.map((step) => (
                  <Reveal
                    key={step.n}
                    as="div"
                    className="process-step"
                    delay={(step.n - 1) * 0.07}
                    data-step={step.n}
                  >
                    <h4>{step.title}</h4>
                    <p>{step.desc}</p>
                  </Reveal>
                ))}
              </div>
            </section>

            {/* Offline */}
            <section className="about-section" id="offline">
              <Reveal as="h2">Offline &amp; updates</Reveal>
              <Reveal as="p" className="sub">
                The app ships as a single release. When you first visit, the service worker saves a copy for offline reading. The release is built {RELEASE_LABEL}.
              </Reveal>

              <div className="split-cards">
                <div className="split-card reveal">
                  <h3>What is saved</h3>
                  <ul className="split-list">
                    <li><span className="ico ico--ok">✓</span><span>The app shell and all published guides for the current release.</span></li>
                    <li><span className="ico ico--ok">✓</span><span>No accounts or personal data are stored.</span></li>
                    <li><span className="ico ico--ok">✓</span><span>Reading works without a network, but source links open only when online.</span></li>
                  </ul>
                </div>
                <div className="split-card split-card--no reveal" style={{ transitionDelay: ".08s" }}>
                  <h3>What updates mean</h3>
                  <ul className="split-list">
                    <li><span className="ico ico--no">✗</span><span>Updates are not silent. You are asked before a new release replaces legal content.</span></li>
                    <li><span className="ico ico--no">✗</span><span>“Source check” is when a person compared a guide with the official text. The release date is when this copy was built. They are different.</span></li>
                    <li><span className="ico ico--no">✗</span><span>The browser’s online/offline signal can be wrong on captive portals or flaky networks.</span></li>
                  </ul>
                </div>
              </div>

              <div className="callout callout--tint reveal" style={{ marginTop: 16 }}>
                <strong>Neither date guarantees today’s law.</strong> Laws and phone numbers can change after a source check, and after a release is built. Use the release date to know which copy you are reading, and the source check date to know when the guidance was last compared with the official text.
              </div>
            </section>

            {/* Privacy */}
            <section className="about-section" id="privacy">
              <Reveal as="h2">Privacy</Reveal>
              <Reveal as="p" className="sub">People search this guide for sensitive reasons. The design reflects that.</Reveal>

              <div className="privacy-card reveal">
                <div>
                  <h3>Your search history is<br />nobody's business.</h3>
                  <p>No accounts, no tracking pixels on content, and no selling of data — ever. Not in v1, not with ads, not "anonymised".</p>
                  <p style={{ marginBottom: 0 }}>In-app feedback is not connected yet, so the app does not collect or store what you read or flag.</p>
                </div>
                <div className="privacy-points">
                  <div className="privacy-point"><span className="tick">✓</span> No accounts, no sign-up, no email required</div>
                  <div className="privacy-point"><span className="tick">✓</span> No third-party analytics on scenario pages</div>
                  <div className="privacy-point"><span className="tick">✓</span> Offline mode keeps reading fully on your device</div>
                  <div className="privacy-point"><span className="tick">✓</span> Ads never receive your searches — slots are contextual, not behavioural</div>
                </div>
              </div>
            </section>

            {/* Corrections */}
            <section className="about-section" id="corrections">
              <Reveal as="h2">Corrections &amp; change history</Reveal>
              <Reveal as="p" className="sub">Material corrections are recorded in each scenario's change history. In-app feedback collection is not connected yet.</Reveal>

              <div className="callout callout--tint reveal" style={{ flexDirection: "column", alignItems: "flex-start", gap: 12 }}>
                <span style={{ maxWidth: 640 }}>When a source check or review changes a legal conclusion, the scenario gets a dated change entry and its review status is updated. The review queue is maintained by the project owner; the app does not store or send feedback yet.</span>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 6 }}>
                  <Link to="/scenario/police-stop-search-car#change-history" className="btn btn--primary btn--sm">See a change history →</Link>
                  <Link to="/help" className="btn btn--soft btn--sm">Open the help directory</Link>
                </div>
              </div>
            </section>

            {/* Disclaimer */}
            <section className="about-section" id="disclaimer">
              <Reveal as="h2">Legal disclaimer</Reveal>
              <div className="fine-print reveal">
                <strong>KnowYourRights NG is an information resource, not a law firm.</strong>
                {" "}Content is checked against the official texts published by the issuing agencies and labelled with its source-check
                status and date. A guide is never described as lawyer-reviewed. It does not constitute legal advice and no lawyer–client
                relationship is created by using it. Laws change and enforcement practice varies by state
                and agency; scenarios carry their last review date and should be read with it. For advice
                on a specific matter, consult a qualified legal practitioner — the <Link to="/help" style={{ color: "var(--link)", fontWeight: 600 }}>help directory</Link> lists free and official options.
                Encounters with enforcement agencies carry real risks; the safety-first ordering of
                guidance reflects this, and following it cannot guarantee any particular outcome.
              </div>
            </section>

          </div>

          {/* TOC sidebar */}
          <aside className="toc-sidebar">
            <div className="toc-card">
              <h4>On this page</h4>
              <ul className="toc-list">
                {TOC.map((item) => (
                  <li key={item.id}><a href={`#${item.id}`}>{item.label}</a></li>
                ))}
              </ul>
            </div>
            <div className="toc-card" style={{ marginTop: 16, background: "var(--bg-ground)" }}>
              <h4>Content status</h4>
              <div className="review-row" style={{ display: "flex", justifyContent: "space-between", fontSize: "0.84rem", padding: "7px 0" }}>
                <span style={{ color: "var(--text-muted)" }}>Scenarios</span><strong>{listedScenarios.length}</strong>
              </div>
              <div className="review-row" style={{ display: "flex", justifyContent: "space-between", fontSize: "0.84rem", padding: "7px 0" }}>
                <span style={{ color: "var(--text-muted)" }}>Source-verified</span><strong>{sourceVerifiedCount}</strong>
              </div>
              <div className="review-row" style={{ display: "flex", justifyContent: "space-between", fontSize: "0.84rem", padding: "7px 0" }}>
                <span style={{ color: "var(--text-muted)" }}>Awaiting source check</span><strong>{AWAITING_CHECK}</strong>
              </div>
              <div className="review-row" style={{ display: "flex", justifyContent: "space-between", fontSize: "0.84rem", padding: "7px 0" }}>
                <span style={{ color: "var(--text-muted)" }}>Last updated</span><strong>{LATEST_REVIEW_LABEL}</strong>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </>
  );
}
