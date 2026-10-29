/**
 * Per-route announce-bar content. Every value is derived from the content layer,
 * so the bar never claims a review, count, or update that the data doesn't support.
 */
import {
  agencies,
  formatReviewDate,
  getScenarioById,
  isSourceVerified,
  listedScenarios,
  sourceVerifiedCount,
  sources,
} from "../lib/content";

export interface AnnounceItem {
  label: string;
  title: string;
  meta?: string;
  link: string;
  href: string;
}

const VERIFIED_SOURCES = sources.filter((s) => s.currentStatusVerified).length;
const AWAITING_CHECK = listedScenarios.length - sourceVerifiedCount;

export const ANNOUNCE: Record<string, AnnounceItem | null> = {
  "/": {
    label: "Live",
    title: `${listedScenarios.length} statute-linked guides`,
    meta: `· ${sourceVerifiedCount} source-verified · ${AWAITING_CHECK} awaiting source check`,
    link: "Browse →",
    href: "/browse",
  },
  "/encounter": {
    label: "Encounter mode",
    title: "Short steps only — everything else can wait",
    link: "Full details →",
    href: "/scenario/police-stop-search-car",
  },
  "/browse": {
    label: "Review status",
    title: "Every guide shows its source-check state",
    meta: `· ${sourceVerifiedCount} of ${listedScenarios.length} checked against official text`,
    link: "How we verify →",
    href: "/about#review",
  },
  "/agencies": {
    label: "Coverage",
    title: `${agencies.length} agencies mapped`,
    meta: "· Agency cards link to the guides that exist today",
    link: "See state agencies →",
    href: "/agencies#state",
  },
  "/search": {
    label: "Tip",
    title: "Ask the way you'd ask a friend",
    meta: "· \u201cofficer collect my phone\u201d works too",
    link: "Browse instead →",
    href: "/browse",
  },
  "/help": {
    label: "Contact checks",
    title: "Dates shown on every channel",
    meta: "· Entries awaiting re-verification are labelled",
    link: "How we verify →",
    href: "/about",
  },
  "/about": {
    label: "Content status",
    title: `${listedScenarios.length} scenarios · ${VERIFIED_SOURCES}/${sources.length} source texts verified`,
    meta: `· ${sourceVerifiedCount} source-verified · ${AWAITING_CHECK} awaiting source check`,
    link: "See corrections →",
    href: "/about#corrections",
  },
};

function scenarioAnnounce(pathname: string): AnnounceItem | null {
  const id = pathname.replace(/^\/scenario\//, "").split("/")[0];
  const scenario = id ? getScenarioById(id) : undefined;
  if (!scenario) return null;

  if (isSourceVerified(scenario)) {
    return {
      label: "Source-verified",
      title: `Checked ${formatReviewDate(scenario.lastReviewed)}`,
      meta: `· ${scenario.reviewer ?? "Content team"}`,
      link: "How we verify →",
      href: "/about#review",
    };
  }

  return {
    label: "Source check pending",
    title: "Not yet checked against the official text",
    meta: `· Sources linked · last touched ${formatReviewDate(scenario.lastReviewed)}`,
    link: "How we verify →",
    href: "/about#review",
  };
}

export function getAnnounce(pathname: string): AnnounceItem | null {
  if (pathname.startsWith("/scenario/")) return scenarioAnnounce(pathname);
  return ANNOUNCE[pathname] ?? null;
}
