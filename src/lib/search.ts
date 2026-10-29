import { listedScenarios, getAgencyName } from "./content";
import type { Scenario } from "./schema";

export function searchScenarios(query: string): Scenario[] {
  const q = query.trim().toLowerCase();
  if (!q) return listedScenarios;

  return listedScenarios.filter((s) => {
    const haystack = [
      s.title,
      s.shortTitle,
      s.question,
      s.shortAnswer,
      s.legalExplanation,
      ...s.keywords,
      ...s.agency.map(getAgencyName),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return haystack.includes(q);
  });
}
