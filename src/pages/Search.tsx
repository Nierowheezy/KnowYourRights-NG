import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/search.css";
import { AdSlot, AdAnchor, Reveal, Pagination } from "../components/ui";
import { IconSearch } from "../components/icons";
import { usePagination } from "../hooks/usePagination";
import { searchScenarios } from "../lib/search";
import { scrollToElement } from "../lib/scroll";
import {
  CATEGORY_LABEL,
  agencies,
  getAgencyShortName,
  getReviewBadge,
  getScenarioAgencyLabel,
  isSourceVerified,
  listedScenarios,
} from "../lib/content";
import type { Scenario } from "../lib/schema";

type SortKey = "relevance" | "newest" | "title" | "agency";

const SORTS: Array<{ value: SortKey; label: string }> = [
  { value: "relevance", label: "Best match" },
  { value: "newest", label: "Recently reviewed" },
  { value: "title", label: "Title A–Z" },
  { value: "agency", label: "Agency" },
];

/** Agency filters are generated from the same data as the agency directory. */
const AGENCY_FILTERS = agencies.map((agency) => ({
  id: agency.id,
  label: getAgencyShortName(agency),
  match: (s: Scenario) => s.agency.includes(agency.id),
}));

const FILTERS: Array<{ label: string; match?: (s: Scenario) => boolean }> = [
  { label: "All agencies" },
  ...AGENCY_FILTERS.map((f) => ({ label: f.label, match: f.match })),
  { label: "✓ Source-verified", match: isSourceVerified },
  { label: "Federal only", match: (s: Scenario) => s.jurisdiction === "federal" },
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

function byNewest(a: Scenario, b: Scenario) {
  return (b.lastReviewed ?? "").localeCompare(a.lastReviewed ?? "");
}

function sortResults(results: Scenario[], sort: SortKey): Scenario[] {
  const copy = [...results];
  switch (sort) {
    case "newest":
      return copy.sort(byNewest);
    case "title":
      return copy.sort((a, b) => a.title.localeCompare(b.title));
    case "agency":
      return copy.sort((a, b) =>
        getScenarioAgencyLabel(a).localeCompare(getScenarioAgencyLabel(b))
      );
    case "relevance":
    default:
      return copy;
  }
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
        {reviewedLabel && <span className="card__meta">Checked {reviewedLabel}</span>}
      </div>
    </Reveal>
  );
}

const PAGE_SIZE = 10;

export default function Search() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState(0);
  const [sort, setSort] = useState<SortKey>("relevance");
  const [focused, setFocused] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const term = useMemo(() => {
    const tokens = query.trim().split(/\s+/);
    return tokens.length ? tokens[tokens.length - 1] : "";
  }, [query]);

  const results = useMemo(() => {
    const base = query.trim() ? searchScenarios(query) : listedScenarios;
    const filter = FILTERS[activeFilter].match;
    const filtered = filter ? base.filter(filter) : base;
    return sortResults(filtered, sort);
  }, [query, activeFilter, sort]);

  const suggestions = useMemo(() => {
    if (!term) return [];
    return listedScenarios
      .filter((s) => s.title.toLowerCase().includes(term.toLowerCase()))
      .slice(0, 3);
  }, [term]);

  const showSuggestions = focused && term.length > 0;

  const resetKey = `${query}-${activeFilter}-${sort}`;
  const { page, totalPages, startIndex, endIndex, setPage } = usePagination({
    totalItems: results.length,
    pageSize: PAGE_SIZE,
    resetKey,
  });

  const paged = results.slice(startIndex, endIndex);

  function goToPage(next: number) {
    setPage(next);
    scrollToElement(resultsRef.current);
  }

  function jumpToResults() {
    setFocused(false);
    scrollToElement(resultsRef.current);
  }

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
                type="search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setFocused(true);
                }}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    jumpToResults();
                  }
                  if (e.key === "Escape") setFocused(false);
                }}
                placeholder="Ask in plain language — e.g. can police search my phone"
                aria-label="Search the guide"
                aria-expanded={showSuggestions}
                aria-controls="search-suggestions"
                autoComplete="off"
              />
              <span className="badge-lime" aria-live="polite">{results.length} matches</span>
            </div>

            {showSuggestions && (
              <div
                className="suggestions"
                id="search-suggestions"
                role="listbox"
                aria-label="Suggested guides"
                onMouseDown={(e) => e.preventDefault()}
              >
                {suggestions.map((s, i) => (
                  <div key={s.id} className={`suggestion${i === 0 ? " suggestion--active" : ""}`} role="option" aria-selected={i === 0}>
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
                {suggestions.length === 0 && (
                  <div className="suggestion" role="option" aria-selected={false}>
                    <IconSearch width={15} height={15} style={{ color: "var(--text-faint)", flexShrink: 0 }} />
                    <span className="suggestion__q">No title match — press Enter to see full-text results</span>
                  </div>
                )}
                <button type="button" className="suggestion suggestion--action" onClick={jumpToResults}>
                  <IconSearch width={15} height={15} style={{ color: "var(--text-faint)", flexShrink: 0 }} />
                  <span className="suggestion__q">View all {results.length} results</span>
                  <span className="suggestion__meta">Enter ↵</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="section--tight" style={{ paddingTop: 56 }}>
        <div className="container">
          <Reveal className="chip-row chip-row--start" style={{ justifyContent: "flex-start" }}>
            {FILTERS.map((filter, i) => (
              <button
                key={filter.label}
                type="button"
                className={`chip${i === activeFilter ? " chip--active" : ""}${filter.label.includes("reviewed") ? " chip--tint" : ""}`}
                onClick={() => setActiveFilter(i)}
                aria-pressed={i === activeFilter}
              >
                {filter.label}
              </button>
            ))}
          </Reveal>

          <Reveal className="results-head">
            <span className="muted" style={{ fontSize: "0.85rem" }} aria-live="polite">
              {query.trim()
                ? <>{results.length} matches for "<strong style={{ color: "var(--text)" }}>{term}</strong>"</>
                : <>{results.length} scenarios</>}
            </span>
            <label className="sort-field">
              <span>Sort</span>
              <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} aria-label="Sort search results">
                {SORTS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>
          </Reveal>

          {/* Results */}
          <div ref={resultsRef}>
            {paged.map((scenario) => (
              <Result key={scenario.id} scenario={scenario} term={term} />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              page={page}
              totalPages={totalPages}
              onChange={goToPage}
              totalItems={results.length}
              startIndex={startIndex}
              endIndex={endIndex}
              itemLabel="results"
              ariaLabel="Search results pagination"
            />
          )}

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
                  Nothing close? <Link to="/about#corrections" className="link-green">Read how corrections work</Link>.
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
