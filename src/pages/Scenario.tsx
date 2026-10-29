import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "../styles/scenario.css";
import { AdSlot } from "../components/ui";
import { agencies as agencyList, CATEGORY_LABEL, getReviewBadge, getScenarioById, getSourcesForScenario, isLawyerReviewed } from "../lib/content";
import type { Scenario } from "../lib/schema";
import NotFound from "./NotFound";

const AGENCY_EMOJI: Array<[needle: string, emoji: string]> = [
  ["Police", "🚓"], ["FRSC", "🛣️"], ["VIS", "🚧"], ["VIO", "🚧"], ["LASTMA", "🚦"],
  ["Customs", "📦"], ["Immigration", "🛂"], ["NDLEA", "🛡️"], ["NSCDC", "🛡️"], ["KAROTA", "🚦"],
];

function agencyName(id: string): string {
  return agencyList.find((a) => a.id === id)?.name ?? id;
}

function agencyEmoji(names: string[], fallback?: string): string {
  if (fallback) return fallback;
  const joined = names.join(" ");
  for (const [needle, emoji] of AGENCY_EMOJI) {
    if (joined.includes(needle)) return emoji;
  }
  return "📄";
}

function formatDate(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

/** Formats section references exactly like the prototype: "s. 44" / "ss. 44, 52". */
function formatSections(sections: string[]): string {
  if (sections.length === 0) return "";
  const numeric = sections.every((s) => /^\d+[a-z]?(-\d+)?$/i.test(s.replace(/^s+\.\s*/i, "")));
  if (!numeric) return sections.join(", ");
  const refs = sections.map((s) => s.replace(/^s+\.\s*/i, "")).join(", ");
  return sections.length > 1 ? `ss. ${refs}` : `s. ${refs}`;
}

/** Renders inline **bold** spans from content text. */
function renderInline(text: string) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : part));
}

type Block = { type: "p" | "ul" | "ol"; items: string[] };

/** Parses "1. …" / "- …" / plain paragraphs into renderable blocks. */
function parseBlocks(text: string): Block[] {
  const blocks: Block[] = [];
  for (const line of text.split("\n").map((l) => l.trim()).filter(Boolean)) {
    const ulMatch = line.match(/^[-•]\s+(.*)/);
    const olMatch = line.match(/^(\d+)[.)]\s+(.*)/);
    const last = blocks[blocks.length - 1];
    if (ulMatch) {
      if (last?.type === "ul") last.items.push(ulMatch[1]);
      else blocks.push({ type: "ul", items: [ulMatch[1]] });
    } else if (olMatch) {
      if (last?.type === "ol") last.items.push(olMatch[2]);
      else blocks.push({ type: "ol", items: [olMatch[2]] });
    } else {
      blocks.push({ type: "p", items: [line] });
    }
  }
  return blocks;
}

function ProseBlocks({ text }: { text: string }) {
  return (
    <>
      {parseBlocks(text).map((block, i) =>
        block.type === "p" ? (
          <p key={i} className="reveal">{renderInline(block.items[0])}</p>
        ) : block.type === "ul" ? (
          <ul key={i} className="reveal">
            {block.items.map((item, j) => <li key={j}>{renderInline(item)}</li>)}
          </ul>
        ) : (
          <ol key={i} className="reveal">
            {block.items.map((item, j) => <li key={j}>{renderInline(item)}</li>)}
          </ol>
        )
      )}
    </>
  );
}

export default function Scenario() {
  const { id } = useParams<{ id: string }>();
  const scenario = id ? getScenarioById(id) : undefined;
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (scenario) document.title = `${scenario.title} — KnowYourRights NG`;
    return () => { document.title = "KnowYourRights NG — Know your rights. Own every stop."; };
  }, [scenario]);

  if (!scenario) return <NotFound />;

  const resolvedSources = getSourcesForScenario(scenario);
  const agencyNames = scenario.agency.map(agencyName);
  const related = scenario.relatedScenarios
    .map((rid) => getScenarioById(rid))
    .filter((s): s is Scenario => Boolean(s));
  const reviewed = isLawyerReviewed(scenario);
  const reviewBadge = getReviewBadge(scenario);
  const crumbLabel = CATEGORY_LABEL[scenario.category];

  return (
    <div className="page-wrap">
      <div className="container">

        {/* Breadcrumb */}
        <nav className="anim" style={{ fontSize: "0.83rem", color: "var(--text-faint)" }} aria-label="Breadcrumb">
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>Home</Link>
          &nbsp;/&nbsp;<Link to="/browse" style={{ textDecoration: "none", color: "inherit" }}>{crumbLabel}</Link>
          &nbsp;/&nbsp;<span style={{ color: "var(--text)", fontWeight: 600 }}>{scenario.shortTitle ?? scenario.title}</span>
        </nav>

        <div className="detail-grid">

          {/* Main column */}
          <article>
            <div className="badge-row anim" style={{ flexWrap: "wrap" }}>
              <span className="badge-outline">{agencyEmoji(agencyNames, scenario.icon)} {agencyNames.join(", ") || "Multiple agencies"}</span>
              <span className={`badge-outline ${scenario.jurisdiction === "federal" ? "badge-federal" : "badge-state"}`}>
                {scenario.jurisdiction === "federal" ? "Federal" : "State"}
              </span>
              <span className="badge-outline">{crumbLabel}</span>
              {reviewed ? (
                <span className="badge-lime">{reviewBadge.label} · {formatDate(scenario.lastReviewed).split(" ").pop()}</span>
              ) : (
                <span className="badge-gray" style={{ background: "var(--warning-tint)", borderColor: "var(--warn-line)", color: "var(--warning)" }}>{reviewBadge.label}</span>
              )}
              <span className="badge-outline" style={{ borderColor: "#c9ecd4", background: "var(--success-tint)", color: "var(--success)" }}>⤓ Saved offline</span>
            </div>

            <h1 className="display display--compact anim" style={{ fontSize: "clamp(1.7rem,3.6vw,2.4rem)", marginTop: 18, animationDelay: ".06s" }}>
              {scenario.title}
            </h1>
            <p className="lede anim" style={{ margin: "12px 0 0", animationDelay: ".12s", fontStyle: "italic" }}>
              "{scenario.question}"
            </p>

            <div className="short-answer anim" style={{ animationDelay: ".18s" }}>
              <span className="label">Short answer</span>
              <p>{scenario.shortAnswer}</p>
            </div>

            <div className="prose">
              <h3 className="reveal" id="law">The law in plain terms</h3>
              <ProseBlocks text={scenario.legalExplanation} />

              {scenario.exceptions && (
                <>
                  <h3 className="reveal" id="exceptions">Exceptions that change the answer</h3>
                  <ProseBlocks text={scenario.exceptions} />
                </>
              )}

              <h3 className="reveal" id="options">Your practical options</h3>
              <ProseBlocks text={scenario.practicalOptions} />

              {scenario.whatToAvoid && (
                <>
                  <h3 className="reveal" id="avoid">What to avoid</h3>
                  <div className="avoid-box reveal">
                    <ul>
                      {parseBlocks(scenario.whatToAvoid).flatMap((b) => b.items).map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </>
              )}

              {scenario.whatToDoAfter && (
                <>
                  <h3 className="reveal" id="after">After the encounter: document it</h3>
                  <ProseBlocks text={scenario.whatToDoAfter} />
                </>
              )}
            </div>

            {/* Feedback */}
            <div className="feedback-card reveal" id="feedback">
              <strong style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}>Was this guidance useful?</strong>
              <div className="badge-row">
                {["👍 Helpful", "Confusing", "Outdated"].map((label) => (
                  <a
                    key={label}
                    href="#feedback"
                    className={`chip${label.includes("Helpful") ? " chip--tint" : ""}`}
                    onClick={(e) => { e.preventDefault(); setFeedback(label); }}
                  >
                    {label}
                  </a>
                ))}
              </div>
              <span className="muted" style={{ fontSize: "0.8rem", marginLeft: "auto" }}>
                {feedback ? `Noted — "${feedback}" saved anonymously.` : "Anonymous · no account needed · nothing about you is stored"}
              </span>
            </div>

            {/* Related */}
            {related.length > 0 && (
              <section style={{ padding: "44px 0 12px" }}>
                <h3 className="display display--compact reveal" style={{ fontSize: "1.3rem", marginBottom: 20 }}>Related scenarios</h3>
                <div className="card-grid card-grid--3">
                  {related.map((rel, i) => (
                    <Link
                      key={rel.id}
                      to={`/scenario/${rel.id}`}
                      className="card card--hover reveal"
                      style={i ? { transitionDelay: `${i * 0.06}s` } : undefined}
                    >
                      <h3 className="card__title">{rel.title}</h3>
                      <p className="card__desc">{rel.shortAnswer.slice(0, 80)}…</p>
                      <div className="card__foot">
                        {isLawyerReviewed(rel) ? (
                          <span className="badge-lime">{formatDate(rel.lastReviewed).split(" ").pop()}</span>
                        ) : (
                          <span className="badge-gray">In review</span>
                        )}
                        <span className="card__arrow">→</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* In-content ad (728 × 90) */}
            <AdSlot variant="inline" size="728 × 90 / in-content" reveal style={{ marginTop: 4 }} />

          </article>

          {/* Sidebar */}
          <aside className="sidebar">
            <div className="side-card reveal">
              <h4>
                <svg width="15" height="15" viewBox="0 0 18 18" fill="none" style={{ color: "var(--forest)" }}><path d="M4 3.5h7l3 3v8H4v-11Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><path d="M7 8.5h4M7 11h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
                Sources behind this answer
              </h4>
              {resolvedSources.map(({ ref, src }) => (
                <div key={src.id} className="source-row">
                  <div className="source-row__title">{src.title}</div>
                  <div className="source-row__meta">
                    <span className="badge-lime">{src.publicationDate ? new Date(src.publicationDate).getFullYear() : "—"}</span>
                    <span>{formatSections(ref.sections)}</span>
                  </div>
                  {src.url ? (
                    <a href={src.url} className="link-green" style={{ fontSize: "0.8rem" }} target="_blank" rel="noreferrer">Read source ↗</a>
                  ) : (
                    <a href="#" className="link-green" style={{ fontSize: "0.8rem" }}>Read source ↗</a>
                  )}
                </div>
              ))}
              {scenario.lastReviewed && (
                <p className="muted" style={{ fontSize: "0.75rem", margin: "12px 0 0" }}>
                  Links verified {formatDate(scenario.lastReviewed)} · primary legislation where available
                </p>
              )}
            </div>

            <div className="side-card reveal" style={{ transitionDelay: ".06s" }}>
              <h4>
                <svg width="15" height="15" viewBox="0 0 18 18" fill="none" style={{ color: "var(--forest)" }}><circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.3"/><path d="M9 5.5V9l2.5 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
                Review trail
              </h4>
              <div className="review-row"><span className="k">Status</span><span className="v" style={reviewed ? { color: "var(--success)" } : { color: "var(--warning)" }}>{reviewed ? "✓ Lawyer reviewed" : reviewBadge.label}</span></div>
              <div className="review-row"><span className="k">Reviewed by</span><span className="v">{scenario.reviewer ?? "—"}</span></div>
              <div className="review-row"><span className="k">Last reviewed</span><span className="v">{formatDate(scenario.lastReviewed) || "—"}</span></div>
              <div className="review-row"><span className="k">Next review</span><span className="v">{formatDate(scenario.nextReview) || "—"}</span></div>
              <div className="review-row"><span className="k">Material changes</span><span className="v">{scenario.changeHistory.length} logged</span></div>
              <a href="#" className="link-green" style={{ fontSize: "0.82rem", display: "inline-block", marginTop: 10 }}>See change history →</a>
            </div>

            <div className="side-card reveal" style={{ transitionDelay: ".12s", background: "var(--bg-ground)" }}>
              <h4>On this page</h4>
              <ul className="toc">
                <li><a href="#law">The law in plain terms</a></li>
                {scenario.exceptions && <li><a href="#exceptions">Exceptions</a></li>}
                <li><a href="#options">Your practical options</a></li>
                {scenario.whatToAvoid && <li><a href="#avoid">What to avoid</a></li>}
                {scenario.whatToDoAfter && <li><a href="#after">After the encounter</a></li>}
              </ul>
            </div>

            <AdSlot variant="square" size="300 × 250" reveal style={{ padding: "32px 20px" }} />
          </aside>

        </div>
      </div>
    </div>
  );
}
