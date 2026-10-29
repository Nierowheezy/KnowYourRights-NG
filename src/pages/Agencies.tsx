import { Link } from "react-router-dom";
import "../styles/agencies.css";
import { PageHero, AdSlot, AdAnchor, Reveal } from "../components/ui";
import { agencies, getAgencyShortName, getScenariosForAgency, isSourceVerified } from "../lib/content";
import type { Agency } from "../lib/schema";

interface AgencyCardData {
  agencyId: string;
  abbr: string;
  name: string;
  desc: string;
  badge: string;
  badgeClass: "badge-federal" | "badge-state";
  meta: string;
  state?: boolean;
  count: number;
}

function jurisdictionLabel(agency: Agency): string {
  if (agency.jurisdiction === "federal") return "Federal";
  if (/^Lagos/i.test(agency.name)) return "Lagos · State";
  if (/^Kano/i.test(agency.name)) return "Kano · State";
  return "State";
}

function toCard(agency: Agency): AgencyCardData {
  const scenarios = getScenariosForAgency(agency);
  const verified = scenarios.filter(isSourceVerified).length;
  const state = agency.jurisdiction === "state";
  return {
    agencyId: agency.id,
    abbr: getAgencyShortName(agency),
    name: agency.name.replace(/\s*\([^)]*\)\s*$/, ""),
    desc: agency.mandate ?? "Powers and limits will be documented as verified guides are published.",
    badge: jurisdictionLabel(agency),
    badgeClass: state ? "badge-state" : "badge-federal",
    meta:
      scenarios.length === 0
        ? "No guides yet"
        : `${scenarios.length} guide${scenarios.length === 1 ? "" : "s"}${verified ? ` · ${verified} source-verified` : ""}`,
    state,
    count: scenarios.length,
  };
}

function AgencyCard({ card, delay }: { card: AgencyCardData; delay?: number }) {
  if (card.count === 0) {
    return (
      <div className="card reveal" style={{ transitionDelay: `${delay}s`, borderStyle: "dashed", opacity: 0.75 }}>
        <span className="agency-abbr" style={{ background: "var(--chip-surface)", color: "var(--chip-ink)", border: "1px dashed var(--chip-line)" }}>{card.abbr}</span>
        <h3 className="card__title">{card.name}</h3>
        <p className="card__desc">{card.desc}</p>
        <div className="card__foot"><span className="badge-gray">No guide yet</span><span className="card__meta">{card.meta}</span></div>
      </div>
    );
  }
  return (
    <Link
      to={`/browse?agency=${card.agencyId}`}
      className="card card--hover reveal"
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      <span className={`agency-abbr${card.state ? " agency-abbr--state" : ""}`}>{card.abbr}</span>
      <h3 className="card__title">{card.name}</h3>
      <p className="card__desc">{card.desc}</p>
      <div className="card__foot">
        <span className={`badge-outline ${card.badgeClass}`}>{card.badge}</span>
        <span className="card__meta">{card.meta}</span>
      </div>
    </Link>
  );
}

export default function Agencies() {
  const federal = agencies.filter((a) => a.jurisdiction === "federal").map(toCard);
  const state = agencies.filter((a) => a.jurisdiction === "state").map(toCard);

  return (
    <>
      {/* Page hero */}
      <PageHero
        title="Who's stopping you?"
        lede="Different agencies have different powers. Start with who you're dealing with — we'll show only what applies to them."
        ledeStyle={{ maxWidth: 560, marginTop: 14, animationDelay: ".08s" }}
      />

      {/* Federal agencies */}
      <section className="section--tight">
        <div className="container">
          <Reveal as="h2" className="section-label">Federal agencies <span className="count">{federal.length} listed</span></Reveal>
          <div className="card-grid card-grid--3">
            {federal.map((card, i) => (
              <AgencyCard key={card.agencyId} card={card} delay={(i % 3) * 0.05} />
            ))}
          </div>
        </div>
      </section>

      {/* In-feed ad (728 × 90) */}
      <section className="section--tight">
        <div className="container">
          <AdSlot variant="inline" size="728 × 90 / responsive" reveal />
        </div>
      </section>

      {/* State agencies */}
      <section className="section--tight" id="state">
        <div className="container">
          <Reveal as="h2" className="section-label">State agencies <span className="count">{state.length} listed</span></Reveal>
          <div className="card-grid card-grid--3">
            {state.map((card, i) => (
              <AgencyCard key={card.agencyId} card={card} delay={(i % 3) * 0.05} />
            ))}
            <AgencyCard
              delay={0.15}
              card={{
                agencyId: "next-state",
                abbr: "+?",
                name: "Your state next",
                desc: "We add agencies as verified guides are published. Tell us which one to prioritise.",
                badge: "Not yet covered",
                badgeClass: "badge-federal",
                meta: "Post-MVP",
                count: 0,
              }}
            />
          </div>
        </div>
      </section>

      <section className="section--tight">
        <div className="container">
          <AdSlot variant="leaderboard" size="970 × 90 / responsive" reveal />
        </div>
      </section>

      {/* Note */}
      <section className="section--tight">
        <div className="container">
          <div className="callout callout--tint reveal">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}><circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.4"/><path d="M10 9v4M10 6.6v.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            <span><strong>State rules can differ from federal rules.</strong> Each guide shows a federal or state badge and its source-check status. Agency cards with no guides yet are still awaiting coverage.</span>
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
