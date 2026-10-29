/**
 * Per-route announce-bar content. Every value is derived from the content layer,
 * so the bar never claims a review, count, or update that the data doesn't support.
 */
import {
  agencies,
  formatReviewDate,
  getScenarioById,
  isLawyerReviewed,
  lawyerReviewedCount,
  listedScenarios,
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
const AWAITING_REVIEW = listedScenarios.length - lawyerReviewedCount;

export const ANNOUNCE: Record<string, AnnounceItem | null> = {
  "/": {
    label: "Live",
    title: `${listedScenarios.length} statute-linked guides`,
    meta: `· ${lawyerReviewedCount} lawyer-reviewed · ${AWAITING_REVIEW} awaiting sign-off`,
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
    title: "Every guide shows its lawyer-review state",
    meta: `· ${lawyerReviewedCount} of ${listedScenarios.length} signed off`,
    link: "How we review →",
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
    meta: `· ${lawyerReviewedCount} lawyer-reviewed · ${AWAITING_REVIEW} awaiting sign-off`,
    link: "See corrections →",
    href: "/about#corrections",
  },
};

function scenarioAnnounce(pathname: string): AnnounceItem | null {
  const id = pathname.replace(/^\/scenario\//, "").split("/")[0];
  const scenario = id ? getScenarioById(id) : undefined;
  if (!scenario) return null;

  if (isLawyerReviewed(scenario)) {
    return {
      label: "Lawyer reviewed",
      title: `Signed off ${formatReviewDate(scenario.lastReviewed)}`,
      meta: `· ${scenario.reviewer ?? "Named reviewer"}`,
      link: "How we review →",
      href: "/about#review",
    };
  }

  return {
    label: "In review",
    title: "Awaiting Nigerian lawyer sign-off",
    meta: `· Sources linked · last checked ${formatReviewDate(scenario.lastReviewed)}`,
    link: "How we review →",
    href: "/about#review",
  };
}

export function getAnnounce(pathname: string): AnnounceItem | null {
  if (pathname.startsWith("/scenario/")) return scenarioAnnounce(pathname);
  return ANNOUNCE[pathname] ?? null;
}
