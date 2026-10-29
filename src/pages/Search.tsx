import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/search.css";
import { AdSlot, AdAnchor, Reveal } from "../components/ui";
import { IconSearch } from "../components/icons";
import { searchScenarios } from "../lib/search";
import {
  CATEGORY_LABEL,
  getReviewBadge,
  getScenarioAgencyLabel,
  isLawyerReviewed,
  listedScenarios,
} from "../lib/content";
import type { Scenario } from "../lib/schema";

const FILTERS: Array<{ label: string; match?: (s: Scenario) => boolean }> = [
  { label: "All agencies" },
  { label: "Nigeria Police", match: (s) => s.agency.includes("npf") },
  { label: "FRSC", match: (s) => s.agency.includes("frsc") },
  { label: "Lagos VIS / DVS", match: (s) => s.agency.includes("vio") },
  { label: "Customs", match: (s) => s.agency.includes("ncs") },
  { label: "✓ Lawyer reviewed", match: isLawyerReviewed },
  { label: "Federal only", match: (s) => s.jurisdiction === "federal" },
];

/** Wraps every case-insensitive occurrence of `term` in a <mark>. */
function highlight(text: string, term: string) {
  if (!term) return text;
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "gi"));
  return parts.map((part, i) =>
    part.toLowerCase() === term.toLowerCase() ? <mark key={i}>{part}</mark> : part
  );
}

function Result({ scenario, term }: { scenario: Scenario; term: string }) {
  const snippet = scenario.shortAnswer.length > 190 ? `${scenario.shortAnswer.slice(0, 190).trimEnd()}…` : scenario.shortAnswer;
  const reviewed = scenario.lastReviewed ? new Date(scenario.lastReviewed) : null;
  const reviewedLabel = reviewed ? reviewed.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "";
  const year = reviewed ? reviewed.getFullYear() : "";
  const badge = getReviewBadge(scenario);
  return (
    <Reveal as="article" className="result">
      <div className="result__crumb">{CATEGORY_LABEL[scenario.category]} · {getScenarioAgencyLabel(scenario)}</div>
      <h3 className="result__title"><Link to={`/scenario/${scenario.id}`}>{highlight(scenario.title, term)}</Link></h3>
      <p className="result__snippet">{highlight(snippet, term)}</p>
      <div className="badge-row">
        <span className={`badge-outline ${scenario.jurisdiction === "federal" ? "badge-federal" : "badge-state"}`}>
          {scenario.jurisdiction === "federal" ? "Federal" : "State"}
        </span>
        {year && <span className="badge-lime">{year}</span>}
        {badge.tone === "ok" ? (
          <span className="badge-gray">{badge.label}</span>
        ) : (
          <span className="badge-gray badge-warning" style={{ background: "var(--warning-tint)", borderColor: "var(--warn-line)", color: "var(--warning)" }}>{badge.label}</span>
        )}
        {reviewedLabel && <span className="card__meta">Last reviewed {reviewedLabel}</span>}
      </div>
    </Reveal>
  );
}

export default function Search() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState(0);

  const term = useMemo(() => {
    const tokens = query.trim().split(/\s+/);
    return tokens.length ? tokens[tokens.length - 1] : "";
  }, [query]);

  const results = useMemo(() => {
    const base = query.trim() ? searchScenarios(query) : listedScenarios;
    const filter = FILTERS[activeFilter].match;
    return filter ? base.filter(filter) : base;
  }, [query, activeFilter]);

  const suggestions = useMemo(() => {
    if (!term) return [];
    return listedScenarios
      .filter((s) => s.title.toLowerCase().includes(term.toLowerCase()))
      .slice(0, 3);
  }, [term]);

  return (
    <>
      {/* Search stage with live suggestions */}
      <section className="search-stage">
        <div className="container">
          <div className="search-box anim">
            <div className="search-box__field">
              <IconSearch style={{ color: "var(--forest)", flexShrink: 0 }} />
              <input
                className="search-box__query"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask in plain language — e.g. can police search my phone"
                aria-label="Search the guide"
              />
              <span className="caret"></span>
              <span className="badge-lime">{results.length} matches</span>
            </div>

            <Reveal className="suggestions" delay={0.12}>
              {suggestions.map((s, i) => (
                <div key={s.id} className={`suggestion${i === 0 ? " suggestion--active" : ""}`}>
                  {i === 0 ? (
                    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" style={{ color: "var(--forest)", flexShrink: 0 }}><path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" transform="rotate(-90 8 8)"/></svg>
                  ) : (
                    <IconSearch width={15} height={15} style={{ color: "var(--text-faint)", flexShrink: 0 }} />
                  )}
                  <span className="suggestion__q">
                    <Link to={`/scenario/${s.id}`}>{highlight(s.title, term)}</Link>
                  </span>
                  <span className="suggestion__meta">{CATEGORY_LABEL[s.category]}{i === 0 ? " · top match" : ""}</span>
                </div>
              ))}
              <div className="suggestion">
                <IconSearch width={15} height={15} style={{ color: "var(--text-faint)", flexShrink: 0 }} />
                <span className="suggestion__q">See all {results.length} results for "<mark>{term || "…"}</mark>"</span>
                <span className="suggestion__meta">Enter ↵</span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="section--tight" style={{ paddingTop: 56 }}>
        <div className="container">
          <Reveal className="chip-row chip-row--start" style={{ justifyContent: "flex-start" }}>
            {FILTERS.map((filter, i) => (
              <a
                key={filter.label}
                href="#"
                className={`chip${i === activeFilter ? " chip--active" : ""}${filter.label.includes("reviewed") ? " chip--tint" : ""}`}
                onClick={(e) => { e.preventDefault(); setActiveFilter(i); }}
              >
                {filter.label}
              </a>
            ))}
          </Reveal>

          <Reveal className="results-head">
            <span className="muted" style={{ fontSize: "0.85rem" }}>
              {query.trim()
                ? <>{results.length} matches for "<strong style={{ color: "var(--text)" }}>{term}</strong>" · sorted by relevance</>
                : <>{results.length} scenarios · sorted by title</>}
            </span>
            <a href="#" className="link-green">Sort: Relevance ▾</a>
          </Reveal>

          {/* Results */}
          <div>
            {results.map((scenario) => (
              <Result key={scenario.id} scenario={scenario} term={term} />
            ))}
          </div>

          <AdSlot variant="inline" size="728 × 90 / in-feed" reveal />

          {/* No-result recovery */}
          {query.trim() && results.length === 0 && (
            <section style={{ padding: "48px 0 12px" }}>
              <div className="recovery reveal">
                <h3 className="display display--compact" style={{ fontSize: "1.3rem" }}>Looking for something else?</h3>
                <p className="lede" style={{ fontSize: "0.92rem", margin: "10px auto 20px", maxWidth: 420 }}>
                  No exact match for "<strong>{query}</strong>" — but these related situations might cover it.
                </p>
                <div className="chip-row" style={{ justifyContent: "center" }}>
                  <Link to="/browse" className="chip">Browse all situations</Link>
                  <Link to="/scenario/police-stop-search-car" className="chip">Stop &amp; search</Link>
                  <Link to="/scenario/officer-demanded-money" className="chip">Complaints</Link>
                </div>
                <p className="muted" style={{ fontSize: "0.8rem", marginTop: 18 }}>
                  Nothing close? <Link to="/scenario/police-stop-search-car#feedback" className="link-green">Flag it for review</Link> — anonymous, takes 10 seconds.
                </p>
              </div>
            </section>
          )}
        </div>
      </section>

      {/* Billboard ad (970 × 250) */}
      <section className="section--tight">
        <div className="container">
          <AdSlot variant="billboard" size="970 × 250 / billboard" reveal />
        </div>
      </section>

      {/* Dismissible mobile anchor ad (320 × 100) */}
      <AdAnchor>
        <AdSlot variant="large-mobile" label="Ad" hint="320 × 100 — large mobile banner" />
      </AdAnchor>
    </>
  );
}
