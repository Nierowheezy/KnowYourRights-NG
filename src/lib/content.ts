import sourcesJson from "../content/sources.json";
import agenciesJson from "../content/agencies.json";
import supportJson from "../content/support.json";
import { SourceSchema, AgencySchema, SupportChannelSchema, ScenarioSchema } from "./schema";
import type { Source, Agency, SupportChannel, Scenario } from "./schema";

const scenarioModules = import.meta.glob("../content/scenarios/*.json", { eager: true }) as Record<string, { default: unknown }>;

export const CATEGORY_LABEL: Record<Scenario["category"], string> = {
  "stop-search": "Stop & search",
  payments: "Payments",
  documents: "Documents",
  arrest: "Arrest",
  impoundment: "Impoundment",
  complaints: "Complaints",
  other: "Other",
};

export const sources: Source[] = (sourcesJson as unknown[]).map((s) => SourceSchema.parse(s));
export const agencies: Agency[] = (agenciesJson as unknown[]).map((a) => AgencySchema.parse(a));
export const supportChannels: SupportChannel[] = (supportJson as unknown[]).map((c) => SupportChannelSchema.parse(c));

/** Scenarios that are approved for public listing. */
export const scenarios: Scenario[] = Object.values(scenarioModules)
  .map((m) => m.default)
  .map((s) => ScenarioSchema.parse(s))
  .filter((s) => s.status === "approved")
  .sort((a, b) => a.title.localeCompare(b.title));

/** Approved or explicitly under-review scenarios. Drafts and retired entries stay hidden. */
export const listedScenarios: Scenario[] = Object.values(scenarioModules)
  .map((m) => m.default)
  .map((s) => ScenarioSchema.parse(s))
  .filter((s) => s.status === "approved" || s.status === "under-review")
  .sort((a, b) => a.title.localeCompare(b.title));

export const allScenarios: Scenario[] = Object.values(scenarioModules)
  .map((m) => m.default)
  .map((s) => ScenarioSchema.parse(s));

/**
 * A scenario is source-verified when it is published *and* a verification owner
 * and check date are recorded. The check is against the official text on the
 * issuing agency's portal, not a legal sign-off.
 */
export function isSourceVerified(s: Scenario): boolean {
  if (s.status !== "approved") return false;
  return Boolean(s.reviewer?.trim() && s.lastReviewed);
}

export const sourceVerifiedCount = listedScenarios.filter(isSourceVerified).length;

export function getScenarioById(id: string) {
  return allScenarios.find((s) => s.id === id);
}

export function getSourcesForScenario(s: Scenario) {
  return s.sources.flatMap((ref) => {
    const src = sources.find((x) => x.id === ref.sourceId);
    return src ? [{ ref, src }] : [];
  });
}

export function getAgencyById(id: string) {
  return agencies.find((a) => a.id === id);
}

export function getAgencyName(id: string): string {
  return getAgencyById(id)?.name ?? id;
}

/** Short label for tickers and compact badges, e.g. "NPF" from "Nigeria Police Force (NPF)". */
export function getAgencyShortName(agency: Agency): string {
  if (agency.abbr) return agency.abbr;
  const parenthetical = agency.name.match(/\(([^)]+)\)\s*$/);
  if (parenthetical) return parenthetical[1];
  return agency.name.replace(/\s*\(.*?\)\s*/g, "").trim();
}

/** Human agency label for a scenario, collapsing multi-agency entries. */
export function getScenarioAgencyLabel(s: Scenario): string {
  if (s.agency.length === 0) return "Multiple agencies";
  if (s.agency.length === 1) return getAgencyName(s.agency[0]);
  return "Multiple agencies";
}

export function getScenariosForAgency(agency: Agency): Scenario[] {
  return listedScenarios.filter((s) => s.agency.includes(agency.id));
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Parses a plain YYYY-MM-DD date without timezone drift. */
function parseDate(value?: string): Date | null {
  if (!value) return null;
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) {
    const fallback = new Date(value);
    return Number.isNaN(fallback.getTime()) ? null : fallback;
  }
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

export function formatReviewDate(value?: string): string {
  const d = parseDate(value);
  if (!d) return "";
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export function reviewYear(value?: string): string {
  const d = parseDate(value);
  return d ? String(d.getFullYear()) : "—";
}

export type ReviewTone = "ok" | "warn" | "muted";

export interface ReviewBadge {
  label: string;
  tone: ReviewTone;
}

/** Single source of truth for how a scenario's review state is presented. */
export function getReviewBadge(s: Scenario): ReviewBadge {
  if (isSourceVerified(s)) return { label: "✓ Source-verified", tone: "ok" };
  if (s.status === "under-review") return { label: "In review", tone: "warn" };
  if (s.status === "approved") return { label: "Source check pending", tone: "warn" };
  if (s.status === "needs-revision") return { label: "Needs revision", tone: "warn" };
  return { label: "Draft", tone: "muted" };
}

/** Support entries whose contact details still need checking are never shown as verified. */
export function isSupportVerified(channel: SupportChannel): boolean {
  if (!channel.lastVerified) return false;
  return !/pending|re-verif|not.*verif/i.test(channel.limitations ?? "");
}
