/**
 * The release a reader is running. `RELEASE_DATE` is stamped at build time by
 * Vite, so it identifies the exact bundle being served, including from an
 * offline cache. It is not a content review date.
 */

export const RELEASE_DATE = __RELEASE_DATE__;

const parsed = new Date(RELEASE_DATE);

/** Human label for the build date, e.g. "29 Oct 2026". */
export const RELEASE_LABEL = Number.isNaN(parsed.getTime())
  ? RELEASE_DATE
  : parsed.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
