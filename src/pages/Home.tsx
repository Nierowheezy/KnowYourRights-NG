import { Link, useNavigate } from "react-router-dom";
import "../styles/home.css";
import { Reveal, AdSlot, SectionHead, CtaSplit } from "../components/ui";
import {
  IconSearch, IconShield, IconCloudOff, IconDocument, IconBuilding, IconPin,
  IconLock, IconArrowRight,
} from "../components/icons";
import {
  CATEGORY_LABEL,
  agencies,
  getAgencyShortName,
  getReviewBadge,
  getScenarioAgencyLabel,
  getScenarioById,
  getSourcesForScenario,
  listedScenarios,
  reviewYear,
  sourceVerifiedCount,
  sources,
} from "../lib/content";

const TICKER_AGENCIES = agencies.map((agency) => ({
  id: agency.id,
  label: getAgencyShortName(agency),
}));

const TYPE_CYCLE = listedScenarios.slice(0, 3).map((s) => s.title);

const TABLE_ROWS = [...listedScenarios]
  .sort((a, b) => (b.lastReviewed ?? "").localeCompare(a.lastReviewed ?? "") || a.title.localeCompare(b.title))
  .slice(0, 5)
  .map((s) => {
    const badge = getReviewBadge(s);
    return {
      id: s.id,
      main: s.title,
      sub: CATEGORY_LABEL[s.category],
      agency: getScenarioAgencyLabel(s),
      year: reviewYear(s.lastReviewed),
      status: badge.label,
      warn: badge.tone !== "ok",
    };
  });

const MINI_AGENCIES = ["npf", "frsc", "lastma"].flatMap((id) => {
  const agency = agencies.find((a) => a.id === id);
  return agency ? [agency] : [];
});

const VERIFIED_SOURCES = sources.filter((s) => s.currentStatusVerified).length;
const AWAITING_CHECK = listedScenarios.length - sourceVerifiedCount;

const featured = getScenarioById("police-stop-search-car");
const featuredSource = featured ? getSourcesForScenario(featured)[0] : undefined;
const featuredYear = featuredSource?.src.publicationDate
  ? new Date(featuredSource.src.publicationDate).getFullYear()
  : "";

const TRUST_CARDS = [
  {
    label: "Primary sources",
    title: `${VERIFIED_SOURCES} of ${sources.length} source texts verified`,
    body: "Citations are checked against downloaded official statute text, not secondary summaries. Section numbers are corrected when the text disagrees.",
  },
  {
    label: "Honest status",
    title: "No unverified “reviewed” badges",
    body: `A guide is labelled source-verified only when its citations have been checked against the official text on the issuing agency's portal. ${AWAITING_CHECK} of ${listedScenarios.length} still await that check and say so.`,
  },
  {
    label: "Open corrections",
    title: "Every change is dated",
    body: "Material corrections are logged in each scenario's change history. In-app feedback collection is not connected yet.",
  },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      {/* Hero: simple, centered, grid + glow */}
      <section className="hero bg-grid bg-glow">
        <div className="container text-center">
          <span className="hero__badge anim">
            <span className="pulse-dot pulse-dot--forest"></span>
            <span className="tag-new">Live</span> {listedScenarios.length} guides across {agencies.length} agencies
          </span>

          <h1 className="display display--hero hero__title anim" style={{ animationDelay: ".08s" }}>
            Know your rights.<br />
            <span className="mark-lime">Own every stop.</span>
          </h1>

          <p className="lede hero__lede anim" style={{ animationDelay: ".16s" }}>
            Plain-language guidance for roadside encounters in Nigeria —
            with the exact law behind every answer. Free, anonymous, offline-ready.
          </p>

          <form
            className="search-lg anim"
            style={{ animationDelay: ".24s" }}
            onSubmit={(e) => { e.preventDefault(); navigate("/search"); }}
          >
            <IconSearch className="search-lg__icon" />
            <div className="type-cycle" aria-hidden="true">
              {TYPE_CYCLE.map((title) => <span key={title}>{title}</span>)}
            </div>
            <button className="search-lg__submit" type="submit" aria-label="Search">
              <IconArrowRight />
            </button>
          </form>

          <div className="hero__ctas anim" style={{ animationDelay: ".3s" }}>
            <Link to="/encounter" className="btn btn--primary btn--lg">Open encounter mode →</Link>
            <Link to="/browse" className="btn btn--soft btn--lg">Browse scenarios</Link>
          </div>

          <div className="hero__trust anim" style={{ animationDelay: ".36s" }}>
            <span><span className="ok">✓</span> Free forever</span>
            <span><span className="ok">✓</span> No account needed</span>
            <span><span className="ok">✓</span> Statute-linked</span>
            <span><span className="ok">✓</span> Works offline</span>
          </div>
        </div>
      </section>

      {/* Agency ticker */}
      <div className="ticker" aria-hidden="true">
        <div className="ticker__track">
          {[0, 1].map((copy) => (
            <span className="ticker__item" key={copy}>
              {TICKER_AGENCIES.map((agency, i) => (
                <span key={agency.id}>
                  {agency.label}
                  {i < TICKER_AGENCIES.length - 1 && <span className="tick-sep">✦</span>}
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* Leaderboard ad slot */}
      <section className="section--tight" style={{ paddingBottom: 0 }}>
        <div className="container">
          <AdSlot variant="leaderboard" size="970 × 90 / responsive" reveal />
        </div>
      </section>

      {/* Bento: what's inside */}
      <section className="section">
        <div className="container">
          <Reveal className="text-center" style={{ marginBottom: 44 }}>
            <span className="eyebrow-tag">The guide</span>
            <h2 className="display display--section" style={{ marginTop: 14 }}>Everything for the moment<br />you're stopped</h2>
            <p className="lede" style={{ margin: "16px auto 0", maxWidth: 480, fontSize: "0.98rem" }}>Built for stressful seconds, not courtrooms.</p>
          </Reveal>

          <div className="bento">
            {/* Encounter mode preview (wide) */}
            <Link to="/encounter" className="bento-card span2 reveal">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <span className="bento-card__icon" style={{ marginBottom: 0 }}>
                  <IconShield />
                </span>
                <span className="badge-lime">Step 2 of 6</span>
              </div>
              <h3 className="bento-card__title" style={{ marginTop: 16 }}>Encounter mode</h3>
              <p className="bento-card__desc">A calm, step-by-step screen for the exact moment you're stopped. Short lines, big text, zero noise.</p>
              <div className="mini-steps">
                <div className="mini-step"><span className="mini-step__n">1</span><span className="mini-step__t">Pull over safely — indicate, stop fully off the lane</span></div>
                <div className="mini-step mini-step--active"><span className="mini-step__n">2</span><span style={{ flex: 1 }}><span className="mini-step__t" style={{ display: "block" }}>Stay calm, hands visible</span><span className="mini-bar"></span></span></div>
                <div className="mini-step"><span className="mini-step__n">3</span><span className="mini-step__t">Greet, then ask one calm question</span></div>
              </div>
              <span className="bento-card__cta">Open encounter mode →</span>
            </Link>

            {/* Offline */}
            <Link to="/about" className="bento-card reveal" style={{ transitionDelay: ".06s" }}>
              <span className="bento-card__icon">
                <IconCloudOff />
              </span>
              <h3 className="bento-card__title">Offline first</h3>
              <p className="bento-card__desc">Save key scenarios before you travel. Zero bars at a checkpoint? The guidance still opens.</p>
              <div className="mini-statute"><span style={{ fontWeight: 600 }}>{listedScenarios.length} scenarios cached</span><span className="badge-lime">✓ Ready</span></div>
              <span className="bento-card__cta" style={{ marginTop: 14 }}>How offline works →</span>
            </Link>

            {/* Source-linked */}
            <Link to={featured ? `/scenario/${featured.id}` : "/browse"} className="bento-card reveal">
              <span className="bento-card__icon">
                <IconDocument />
              </span>
              <h3 className="bento-card__title">Source-linked answers</h3>
              <p className="bento-card__desc">Every "yes" and "no" links the section of law behind it — checked against the primary text.</p>
              <div className="mini-statute">
                <span style={{ fontWeight: 600 }}>{featuredSource?.src.title ?? "Primary legislation"}</span>
                {featuredSource?.ref.sections[0] && <span className="mono">s. {featuredSource.ref.sections[0]}</span>}
                {featuredYear && <span className="badge-lime">{featuredYear}</span>}
              </div>
              <span className="bento-card__cta" style={{ marginTop: 14 }}>See a scenario →</span>
            </Link>

            {/* Agencies */}
            <Link to="/agencies" className="bento-card reveal" style={{ transitionDelay: ".06s" }}>
              <span className="bento-card__icon">
                <IconBuilding />
              </span>
              <h3 className="bento-card__title">Agency-aware guidance</h3>
              <p className="bento-card__desc">Different agencies, different powers. Federal and state rules separated and labelled.</p>
              <div className="mini-agencies">
                {MINI_AGENCIES.map((agency) => (
                  <span
                    key={agency.id}
                    className={`badge-outline ${agency.jurisdiction === "state" ? "badge-state" : "badge-federal"}`}
                  >
                    {getAgencyShortName(agency)}
                  </span>
                ))}
                {agencies.length > MINI_AGENCIES.length && (
                  <span className="badge-outline badge-federal">+{agencies.length - MINI_AGENCIES.length}</span>
                )}
              </div>
              <span className="bento-card__cta" style={{ marginTop: 14 }}>Browse by agency →</span>
            </Link>

            {/* Help directory */}
            <Link to="/help" className="bento-card reveal" style={{ transitionDelay: ".12s" }}>
              <span className="bento-card__icon">
                <IconPin />
              </span>
              <h3 className="bento-card__title">Verified help</h3>
              <p className="bento-card__desc">Complaint channels and free legal aid, each showing the date it was last checked.</p>
              <div className="mini-emergency">
                <span className="mini-tile">112<small>Emergency</small></span>
                <span className="mini-tile">122<small>FRSC</small></span>
              </div>
              <span className="bento-card__cta" style={{ marginTop: 14 }}>Open the directory →</span>
            </Link>

            {/* Privacy (dark, wide) */}
            <div className="bento-card bento-card--dark span2 reveal">
              <span className="bento-card__icon">
                <IconLock />
              </span>
              <h3 className="bento-card__title">Private by default</h3>
              <p className="bento-card__desc">No accounts. No tracking. No selling what you search. Feedback is anonymous by design — sensitive questions stay sensitive.</p>
              <span className="bento-card__cta">Read our privacy approach →</span>
            </div>

            {/* Sponsored bento slot */}
            <Reveal className="bento-card" delay={0.06} style={{ padding: 14 }}>
              <div className="sponsored-fill">
                <span className="ad-slot__label" style={{ position: "static" }}>Sponsored</span>
                <span className="ad-slot__hint">Native ad space</span>
                <span className="ad-slot__size">1 × bento card</span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Reviewed scenarios table */}
      <section className="section--tight" style={{ borderTop: "1px solid var(--line)", paddingTop: 56 }}>
        <div className="container">
          <SectionHead
            title="Fresh, statute-linked guidance"
            meta={`${sourceVerifiedCount} of ${listedScenarios.length} guides source-verified · check dates shown on every entry`}
            aside={<Link to="/browse" className="link-green">View all →</Link>}
          />

          <Reveal className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Scenario</th>
                  <th>Agency</th>
                  <th>Reviewed</th>
                  <th>Guidance status</th>
                </tr>
              </thead>
              <tbody>
                {TABLE_ROWS.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <Link to={`/scenario/${row.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                        <span className="cell-main">{row.main}</span><span className="cell-sub">{row.sub}</span>
                      </Link>
                    </td>
                    <td>{row.agency}</td>
                    <td><span className="badge-lime">{row.year}</span></td>
                    <td>
                      <span
                        className="badge-gray"
                        style={row.warn ? { background: "var(--warning-tint)", borderColor: "var(--warn-line)", color: "var(--warning)" } : undefined}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>

          <Reveal className="text-center" style={{ marginTop: 32 }}>
            <Link to="/browse" className="btn btn--primary btn--lg">View all scenarios →</Link>
          </Reveal>
        </div>
      </section>

      {/* In-feed ad */}
      <section className="section--tight" style={{ paddingBottom: 0 }}>
        <div className="container">
          <AdSlot variant="inline" size="728 × 90 / in-feed" reveal />
        </div>
      </section>

      {/* How accuracy works */}
      <section className="section" style={{ borderTop: "1px solid var(--line)" }}>
        <div className="container">
          <SectionHead
            title="How this guide earns trust"
            meta="No anonymous claims — every status is derived from the content itself."
          />

          <div className="card-grid card-grid--3">
            {TRUST_CARDS.map((card, i) => (
              <Reveal key={card.label} as="article" className="quote-card" delay={i * 0.08}>
                <span className="eyebrow-tag">{card.label}</span>
                <h3 className="card__title" style={{ marginTop: 14 }}>{card.title}</h3>
                <p className="quote-card__body">{card.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="section" style={{ borderTop: "1px solid var(--line)" }}>
        <div className="container">
          <CtaSplit
            copy={
              <>
                <h2 className="display display--section">Stay calm.<br /><span className="mark-lime" style={{ borderRadius: 10 }}>You have rights.</span></h2>
                <p className="lede">Seconds matter at a stop. Keep the guide one tap away — free, anonymous, and linked to the exact law behind every answer.</p>
                <ul className="cta-checks">
                  <li><span className="tick">✓</span> Free forever</li>
                  <li><span className="tick">✓</span> No account needed</li>
                  <li><span className="tick">✓</span> Works offline</li>
                </ul>
              </>
            }
            actions={
              <>
                <Link to="/encounter" className="action-card action-card--dark reveal" style={{ transitionDelay: ".06s" }}>
                  <span className="action-card__icon">
                    <IconShield width={20} height={20} />
                  </span>
                  <div>
                    <h3>Encounter mode</h3>
                    <p>Six calm steps for the exact moment you're stopped.</p>
                  </div>
                  <span className="action-card__arrow">→</span>
                </Link>
                <Link to="/search" className="action-card reveal" style={{ transitionDelay: ".12s" }}>
                  <span className="action-card__icon">
                    <IconSearch width={19} height={19} />
                  </span>
                  <div>
                    <h3>Search the guide</h3>
                    <p>{listedScenarios.length} scenarios — every answer linked to the law behind it.</p>
                  </div>
                  <span className="action-card__arrow">→</span>
                </Link>
              </>
            }
          />
        </div>
      </section>
    </>
  );
}
