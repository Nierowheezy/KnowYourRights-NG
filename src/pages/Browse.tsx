import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "../styles/browse.css";
import { AdSlot, AdAnchor } from "../components/ui";
import { IconSearch } from "../components/icons";
import {
  CATEGORY_LABEL,
  getAgencyById,
  getAgencyName,
  getReviewBadge,
  listedScenarios,
  reviewYear,
} from "../lib/content";
import type { Scenario } from "../lib/schema";

const FILTERS: Array<{ label: string; category: Scenario["category"] | null }> = [
  { label: "All situations", category: null },
  { label: "Stop & search", category: "stop-search" },
  { label: "Documents", category: "documents" },
  { label: "Payments & fines", category: "payments" },
  { label: "Impoundment", category: "impoundment" },
  { label: "Arrest", category: "arrest" },
  { label: "Complaints", category: "complaints" },
  { label: "Other", category: "other" },
];

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

export default function Browse() {
  const [activeFilter, setActiveFilter] = useState(0);
  const [query, setQuery] = useState("");
  const [params] = useSearchParams();
  const agencyId = params.get("agency");
  const agency = agencyId ? getAgencyById(agencyId) : undefined;

  const cards = useMemo(
    () =>
      listedScenarios
        .filter((s) => !agencyId || s.agency.includes(agencyId))
        .map(toCard),
    [agencyId]
  );

  const visible = cards.filter((card) => {
    const filter = FILTERS[activeFilter].category;
    const filterOk = filter === null || card.categoryKey === filter;
    const q = query.trim().toLowerCase();
    const queryOk =
      !q || `${card.title} ${card.desc} ${card.agency} ${card.category}`.toLowerCase().includes(q);
    return filterOk && queryOk;
  });

  return (
    <>
      {/* Page hero */}
      <section className="page-hero">
        <div className="container">
          <h1 className="display display--section anim">Browse by situation</h1>
          <p className="lede anim" style={{ maxWidth: 560, marginTop: 14, animationDelay: ".08s" }}>
            Pick the scenario that matches what you're facing. Every guide links to the
            primary law behind it. Entries marked <strong>In review</strong> or{" "}
            <strong>Awaiting lawyer review</strong> have not yet been signed off by a Nigerian lawyer.
          </p>

          <form className="search-sm anim" style={{ animationDelay: ".16s" }} onSubmit={(e) => e.preventDefault()}>
            <IconSearch width={16} height={16} style={{ color: "var(--text-faint)", flexShrink: 0 }} />
            <input
              className="search-sm__input"
              type="search"
              placeholder="Search in your own words — e.g. 'officer seized my key'"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </form>

          <div className="chip-row chip-row--start filters anim" style={{ animationDelay: ".24s" }}>
            {FILTERS.map((filter, i) => (
              <a
                key={filter.label}
                href="#"
                className={`chip${i === activeFilter ? " chip--active" : ""}`}
                onClick={(e) => { e.preventDefault(); setActiveFilter(i); }}
              >
                {filter.label}
              </a>
            ))}
          </div>

          {agency && (
            <div className="callout callout--tint anim" style={{ marginTop: 18, animationDelay: ".3s" }}>
              <span>Showing guidance for <strong>{agency.name}</strong>.</span>
              <Link to="/browse" className="link-green">Clear agency filter →</Link>
            </div>
          )}
        </div>
      </section>

      {/* Scenario grid */}
      <section className="section--tight">
        <div className="container">
          <p className="muted" style={{ fontSize: "0.85rem", marginBottom: 18 }}>
            {visible.length} of {cards.length} guide{cards.length === 1 ? "" : "s"}
          </p>

          <div className="card-grid card-grid--3">
            {visible.map((card, i) => (
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
                  <Link to={agency ? "/browse" : "/search"} className="link-green">
                    {agency ? "Browse every situation →" : "Search the guide →"}
                  </Link>
                </div>
              </div>
            )}

            {/* In-grid ad (336 × 280) */}
            <AdSlot variant="rect-lg" size="336 × 280 / in-grid" reveal style={{ minHeight: 0 }} />
          </div>
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
