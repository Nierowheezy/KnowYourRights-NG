import { useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "../styles/browse.css";
import { AdSlot, AdAnchor, Pagination } from "../components/ui";
import { IconSearch } from "../components/icons";
import { usePagination } from "../hooks/usePagination";
import { scrollToElement } from "../lib/scroll";
import {
  CATEGORY_LABEL,
  agencies,
  getAgencyById,
  getAgencyName,
  getAgencyShortName,
  getReviewBadge,
  listedScenarios,
  reviewYear,
} from "../lib/content";
import type { Scenario } from "../lib/schema";

const CATEGORY_FILTERS: Array<{ label: string; category: Scenario["category"] | null }> = [
  { label: "All situations", category: null },
  { label: "Stop & search", category: "stop-search" },
  { label: "Documents", category: "documents" },
  { label: "Payments & fines", category: "payments" },
  { label: "Impoundment", category: "impoundment" },
  { label: "Arrest", category: "arrest" },
  { label: "Complaints", category: "complaints" },
  { label: "Other", category: "other" },
];

type SortKey = "newest" | "title" | "agency" | "category";

const SORTS: Array<{ value: SortKey; label: string }> = [
  { value: "newest", label: "Recently reviewed" },
  { value: "title", label: "Title A–Z" },
  { value: "agency", label: "Agency" },
  { value: "category", label: "Situation type" },
];

const CATEGORY_VALUES = new Set(CATEGORY_FILTERS.map((f) => f.category).filter(Boolean) as string[]);

interface BrowseCard {
  scenario: Scenario;
  emoji: string;
  agency: string;
  jurisdiction: "Federal" | "State";
  title: string;
  desc: string;
  category: string;
  categoryKey: Scenario["category"];
  to: string;
}

function agencyLabel(s: Scenario): string {
  if (s.agency.length === 0) return "Multiple agencies";
  if (s.agency.length > 1) return "Multiple agencies";
  return getAgencyName(s.agency[0]).replace(/\s*\([^)]*\)\s*$/, "");
}

function toCard(s: Scenario): BrowseCard {
  return {
    scenario: s,
    emoji: s.icon ?? "📄",
    agency: agencyLabel(s),
    jurisdiction: s.jurisdiction === "state" ? "State" : "Federal",
    title: s.title,
    desc: s.shortAnswer,
    category: CATEGORY_LABEL[s.category],
    categoryKey: s.category,
    to: `/scenario/${s.id}`,
  };
}

function sortCards(cards: BrowseCard[], sort: SortKey): BrowseCard[] {
  const copy = [...cards];
  switch (sort) {
    case "title":
      return copy.sort((a, b) => a.title.localeCompare(b.title));
    case "agency":
      return copy.sort((a, b) => a.agency.localeCompare(b.agency) || a.title.localeCompare(b.title));
    case "category":
      return copy.sort((a, b) => a.category.localeCompare(b.category) || a.title.localeCompare(b.title));
    case "newest":
    default:
      return copy.sort(
        (a, b) =>
          (b.scenario.lastReviewed ?? "").localeCompare(a.scenario.lastReviewed ?? "") ||
          a.title.localeCompare(b.title)
      );
  }
}

const WARN_BADGE = {
  background: "var(--warning-tint)",
  borderColor: "var(--warn-line)",
  color: "var(--warning)",
};

function ScenarioCard({ card, delay }: { card: BrowseCard; delay?: number }) {
  const badge = getReviewBadge(card.scenario);
  return (
    <Link to={card.to} className="card card--hover reveal" style={delay ? { transitionDelay: `${delay}s` } : undefined}>
      <div className="badge-row" style={{ marginBottom: 14 }}>
        <span className="badge-outline">{card.emoji} {card.agency}</span>
        <span className={`badge-outline ${card.jurisdiction === "State" ? "badge-state" : "badge-federal"}`}>{card.jurisdiction}</span>
      </div>
      <h3 className="card__title">{card.title}</h3>
      <p className="card__desc">{card.desc}</p>
      <div className="card__foot">
        {badge.tone === "ok" ? (
          <span className="badge-lime">{badge.label} · {reviewYear(card.scenario.lastReviewed)}</span>
        ) : (
          <span className="badge-gray badge-warning" style={WARN_BADGE}>{badge.label}</span>
        )}
        <span className="card__meta">{card.category}</span>
      </div>
    </Link>
  );
}

const PAGE_SIZE = 12;

export default function Browse() {
  const [query, setQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [params, setParams] = useSearchParams();
  const gridRef = useRef<HTMLDivElement>(null);

  const agencyId = params.get("agency");
  const rawCategory = params.get("category");
  const category = rawCategory && CATEGORY_VALUES.has(rawCategory)
    ? (rawCategory as Scenario["category"])
    : null;
  const rawSort = params.get("sort");
  const sort: SortKey = SORTS.some((s) => s.value === rawSort) ? (rawSort as SortKey) : "newest";

  const agency = agencyId ? getAgencyById(agencyId) : undefined;

  const cards = useMemo(
    () =>
      listedScenarios
        .filter((s) => !agencyId || s.agency.includes(agencyId))
        .filter((s) => !category || s.category === category)
        .map(toCard),
    [agencyId, category]
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? cards.filter((card) =>
          `${card.title} ${card.desc} ${card.agency} ${card.category} ${card.scenario.keywords.join(" ")}`
            .toLowerCase()
            .includes(q)
        )
      : cards;
    return sortCards(filtered, sort);
  }, [cards, query, sort]);

  const resetKey = `${agencyId ?? "all"}-${category ?? "all"}-${query}-${sort}`;
  const { page, totalPages, startIndex, endIndex, setPage } = usePagination({
    totalItems: visible.length,
    pageSize: PAGE_SIZE,
    resetKey,
  });

  const paged = visible.slice(startIndex, endIndex);

  const activeCount = (agencyId ? 1 : 0) + (category ? 1 : 0);
  const showFilters = filtersOpen || activeCount > 0;

  function updateParams(patch: Record<string, string | null>) {
    const next = new URLSearchParams(params);
    for (const [key, value] of Object.entries(patch)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    setParams(next, { replace: true });
  }

  function clearFilters() {
    setQuery("");
    updateParams({ agency: null, category: null });
  }

  function goToPage(next: number) {
    setPage(next);
    scrollToElement(gridRef.current);
  }

  return (
    <>
      {/* Page hero */}
      <section className="page-hero">
        <div className="container">
          <h1 className="display display--section anim">Browse by situation</h1>
          <p className="lede anim" style={{ maxWidth: 560, marginTop: 14, animationDelay: ".08s" }}>
            Pick the scenario that matches what you're facing. Every guide links to the
            primary law behind it. Entries marked <strong>In review</strong> or{" "}
            <strong>Source check pending</strong> have not yet been checked against the
            official text on the issuing agency's portal.
          </p>

          <form className="search-sm anim" style={{ animationDelay: ".16s" }} onSubmit={(e) => e.preventDefault()} role="search">
            <IconSearch width={16} height={16} style={{ color: "var(--text-faint)", flexShrink: 0 }} />
            <input
              className="search-sm__input"
              type="search"
              placeholder="Search in your own words — e.g. 'officer seized my key'"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setFiltersOpen(true);
              }}
              aria-label="Search guides"
            />
          </form>

          <div className="browse-toolbar anim" style={{ animationDelay: ".22s" }}>
            <button
              type="button"
              className={`btn btn--soft btn--sm filter-toggle${showFilters ? " is-open" : ""}`}
              onClick={() => setFiltersOpen((open) => !open)}
              aria-expanded={showFilters}
              aria-controls="browse-filters"
            >
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M2 3.5h12M4.5 8h7M6.5 12.5h3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              Filters
              {activeCount > 0 && <span className="filter-toggle__count">{activeCount}</span>}
            </button>

            <label className="sort-field">
              <span>Sort</span>
              <select
                value={sort}
                onChange={(e) => updateParams({ sort: e.target.value === "newest" ? null : e.target.value })}
                aria-label="Sort guides"
              >
                {SORTS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>

            {(activeCount > 0 || query) && (
              <button type="button" className="link-green toolbar-clear" onClick={clearFilters}>
                Clear all
              </button>
            )}
          </div>

          {showFilters && (
            <div className="filter-panel is-in" id="browse-filters">
              <div className="filter-group">
                <span className="filter-group__label">Agency</span>
                <div className="chip-row chip-row--start">
                  <button
                    type="button"
                    className={`chip${!agencyId ? " chip--active" : ""}`}
                    onClick={() => updateParams({ agency: null })}
                    aria-pressed={!agencyId}
                  >
                    All agencies
                  </button>
                  {agencies.map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      className={`chip${agencyId === a.id ? " chip--active" : ""}`}
                      onClick={() => updateParams({ agency: a.id })}
                      aria-pressed={agencyId === a.id}
                      title={a.name}
                    >
                      {getAgencyShortName(a)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-group">
                <span className="filter-group__label">Situation</span>
                <div className="chip-row chip-row--start">
                  {CATEGORY_FILTERS.map((filter) => (
                    <button
                      key={filter.label}
                      type="button"
                      className={`chip${category === filter.category ? " chip--active" : ""}`}
                      onClick={() => updateParams({ category: filter.category })}
                      aria-pressed={category === filter.category}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {agency && (
            <div className="callout callout--tint anim" style={{ marginTop: 18, animationDelay: ".3s" }}>
              <span>Showing guidance for <strong>{agency.name}</strong>.</span>
              <button type="button" className="link-green" onClick={() => updateParams({ agency: null })}>
                Clear agency filter →
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Scenario grid */}
      <section className="section--tight">
        <div className="container" ref={gridRef}>
          <p className="muted" style={{ fontSize: "0.85rem", marginBottom: 18 }} aria-live="polite">
            {visible.length} of {cards.length} guide{cards.length === 1 ? "" : "s"}
            {query.trim() && <> for “{query.trim()}”</>}
          </p>

          <div className="card-grid card-grid--3">
            {paged.map((card, i) => (
              <ScenarioCard key={card.scenario.id} card={card} delay={(i % 3) * 0.05} />
            ))}

            {visible.length === 0 && (
              <div className="card reveal" style={{ gridColumn: "1 / -1" }}>
                <h3 className="card__title">No scenario matches yet</h3>
                <p className="card__desc">
                  {agency
                    ? `We don't have a published guide for ${agency.name} yet. Try another agency or browse every situation.`
                    : "Try another word, clear the filters, or search the guide in your own words."}
                </p>
                <div className="card__foot">
                  <button type="button" className="link-green" onClick={clearFilters}>
                    Clear all filters →
                  </button>
                </div>
              </div>
            )}

            {/* In-grid ad (336 × 280) */}
            <AdSlot variant="rect-lg" size="336 × 280 / in-grid" reveal style={{ minHeight: 0 }} />
          </div>

          {totalPages > 1 && (
            <Pagination
              page={page}
              totalPages={totalPages}
              onChange={goToPage}
              totalItems={visible.length}
              startIndex={startIndex}
              endIndex={endIndex}
              itemLabel="guides"
              ariaLabel="Browse guides pagination"
            />
          )}
        </div>
      </section>

      <section className="section--tight">
        <div className="container">
          <AdSlot variant="leaderboard" size="970 × 90 / responsive" reveal />
        </div>
      </section>

      {/* Recovery CTA */}
      <section className="section--tight">
        <div className="container">
          <div className="callout callout--tint reveal" style={{ justifyContent: "space-between", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <strong style={{ fontSize: "1rem" }}>Can't find your exact situation?</strong>
              <span>Try your own words — the search understands plain language.</span>
            </div>
            <Link to="/search" className="btn btn--primary btn--sm">Search the guide →</Link>
          </div>
        </div>
      </section>

      {/* Dismissible mobile anchor ad (320 × 100) */}
      <AdAnchor>
        <AdSlot variant="large-mobile" label="Ad" hint="320 × 100 — large mobile banner" />
      </AdAnchor>
    </>
  );
}
