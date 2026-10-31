import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/search.css";
import { AdSlot, AdAnchor, Reveal, Pagination, SearchBox } from "../components/ui";
import { IconSearch } from "../components/icons";
import { usePagination } from "../hooks/usePagination";
import { searchScenarios, tokenizeQuery } from "../lib/search";
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

/** Wraps every case-insensitive occurrence of any query token in a <mark>. */
function highlight(text: string, terms: string[]) {
  const needles = [...new Set(terms.filter((term) => term.length > 1))];
  if (needles.length === 0) return text;
  const pattern = needles
    .sort((a, b) => b.length - a.length)
    .map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|");
  const parts = text.split(new RegExp(`(${pattern})`, "gi"));
  return parts.map((part, i) =>
    needles.includes(part.toLowerCase()) ? <mark key={i}>{part}</mark> : part
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

function Result({ scenario, terms }: { scenario: Scenario; terms: string[] }) {
  const snippet = scenario.shortAnswer.length > 190 ? `${scenario.shortAnswer.slice(0, 190).trimEnd()}…` : scenario.shortAnswer;
  const reviewed = scenario.lastReviewed ? new Date(scenario.lastReviewed) : null;
  const reviewedLabel = reviewed ? reviewed.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "";
  const year = reviewed ? reviewed.getFullYear() : "";
  const badge = getReviewBadge(scenario);
  return (
    <Reveal as="article" className="result">
      <div className="result__crumb">{CATEGORY_LABEL[scenario.category]} · {getScenarioAgencyLabel(scenario)}</div>
      <h3 className="result__title"><Link to={`/scenario/${scenario.id}`}>{highlight(scenario.title, terms)}</Link></h3>
      <p className="result__snippet">{highlight(snippet, terms)}</p>
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

  const trimmedQuery = query.trim();

  /** The tokens actually searched for, reused for highlighting. */
  const terms = useMemo(() => tokenizeQuery(trimmedQuery), [trimmedQuery]);

  /** Unfiltered, relevance-ranked matches; filters and sort apply on top. */
  const matched = useMemo(
    () => (trimmedQuery ? searchScenarios(trimmedQuery) : listedScenarios),
    [trimmedQuery]
  );

  const results = useMemo(() => {
    const filter = FILTERS[activeFilter].match;
    const filtered = filter ? matched.filter(filter) : matched;
    return sortResults(filtered, sort);
  }, [matched, activeFilter, sort]);

  const suggestions = useMemo(() => matched.slice(0, 3), [matched]);

  const showSuggestions = focused && trimmedQuery.length > 0;

  const resetKey = `${trimmedQuery}-${activeFilter}-${sort}`;
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
            <SearchBox
              value={query}
              onChange={(v) => {
                setQuery(v);
                setFocused(true);
              }}
              placeholder="Ask in plain language — e.g. can police search my phone"
              variant="large"
              showCount={results.length}
              ariaLabel="Search the guide"
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  jumpToResults();
                }
                if (e.key === "Escape") setFocused(false);
              }}
              ariaExpanded={showSuggestions}
              ariaControls="search-suggestions"
            />

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
                      <Link to={`/scenario/${s.id}`}>{highlight(s.title, terms)}</Link>
                    </span>
                    <span className="suggestion__meta">{CATEGORY_LABEL[s.category]}{i === 0 ? " · top match" : ""}</span>
                  </div>
                ))}
                {suggestions.length === 0 && (
                  <div className="suggestion" role="option" aria-selected={false}>
                    <IconSearch width={15} height={15} style={{ color: "var(--text-faint)", flexShrink: 0 }} />
                    <span className="suggestion__q">No guide mentions "{trimmedQuery}" yet — try fewer or different words</span>
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
              {trimmedQuery
                ? <>{results.length} matches for "<strong style={{ color: "var(--text)" }}>{trimmedQuery}</strong>"</>
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
              <Result key={scenario.id} scenario={scenario} terms={terms} />
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
          {trimmedQuery && results.length === 0 && (
            <section style={{ padding: "48px 0 12px" }}>
              <div className="recovery reveal">
                <h3 className="display display--compact" style={{ fontSize: "1.3rem" }}>Looking for something else?</h3>
                <p className="lede" style={{ fontSize: "0.92rem", margin: "10px auto 20px", maxWidth: 420 }}>
                  No exact match for "<strong>{trimmedQuery}</strong>" — but these related situations might cover it.
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
