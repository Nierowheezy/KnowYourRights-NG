# Feature: Offline freshness indicators

**From build-plan:** feature 14
**Status:** not started

## Goal

Tell the truth about offline copies. When the connection drops, say so and name the
release the reader is looking at. When a newer release is ready, ask before
swapping legal content instead of updating silently. On each guide, distinguish the
source-check date from the copy's build date. Explain all of it in About, and stop
claiming that guides are "cached" before the service worker has saved anything.

## In scope

- A build-time release stamp (`__RELEASE_DATE__`) and a small display helper, so
  every screen can name the release it is running.
- An online/offline hook and a global offline bar that appears on every route with
  the release date and a link to the About explainer.
- A "saved copy" row and caveat in the scenario review trail, shown only offline,
  that separates the source-check date from the copy's release date.
- Switch the PWA from silent auto-update to prompt updates: a "new release ready"
  toast with Refresh and Dismiss, plus a one-time "saved for offline" confirmation
  when the first install completes.
- An `#offline` section in About (and TOC entry) covering what is saved, when it
  updates, what the dates mean, and why the browser's offline signal can be wrong.
- Truthful copy fixes on Home and Encounter where the current UI claims content is
  already cached or offers a fake "Save for offline" badge.
- Hash-aware scrolling so `/about#offline` and the existing footer anchors land on
  the right section.

## Out of scope

- Per-scenario cache metadata, Cache API inspection, background sync, or storing a
  "last seen online" timestamp. The release stamp is the only new persisted-by-build
  value.
- Install / add-to-home-screen prompts (`beforeinstallprompt`); this feature only
  reports update and offline state.
- Content freshness monitoring against legislation (feature 22), content history
  and rollback (feature 17), or a content-version API.
- Broader accessibility work (feature 15) beyond basic `role="status"` and
  `aria-live` on the new notices.
- Changing the Workbox caching strategy or precache globs beyond the registration
  mode.

## Build loop

Build one step at a time, never the whole feature at once.

1. Plan mode lays out the step before any code.
2. The AI implements just that step.
3. It shows the diff (not full files); you read it and understand it.
4. You approve, then choose whether to commit a checkpoint or roll straight on.
   Checkpoints are optional; `/complete` makes the real feature-level commit at the end.

Never accept a step you haven't read. If a diff is too big to review, the step was too big, so split it.

## Build steps

- [ ] **Step 1 - Release stamp, online hook, offline bar** - add
  `define: { __RELEASE_DATE__: JSON.stringify(new Date().toISOString()) }` to
  `vite.config.ts`, declare the global in `src/lib/env.d.ts`, and add
  `src/lib/release.ts` exporting `RELEASE_DATE` and `RELEASE_LABEL` (e.g.
  "29 Oct 2026"). Add `src/hooks/useOnlineStatus.ts` using `useSyncExternalStore`
  over the `online`/`offline` events with a `true` server snapshot. Add
  `src/components/OfflineBar.tsx` and mount it in `Layout` directly under the
  announce bar. Bar copy must not claim a copy exists: "Offline. You are reading
  the release built 29 Oct 2026. Content may have changed since it was last
  checked." Link it to `/about#offline`. Add styles to `theme.css` using existing
  warning tokens.
  *Done when:* `npm run build` and `npm run lint` pass; the built JS contains the
  injected ISO date (for example `grep -o "20[0-9][0-9]-[0-9][0-9]-[0-9][0-9]T[0-9:.]*Z" dist/assets/*.js | head -1`);
  DevTools offline shows the bar on `/`, `/browse`, and `/help`, toggling online
  hides it, and the bar wraps cleanly at 360px.

- [ ] **Step 2 - Show the saved copy on a scenario** - in `Scenario.tsx` read
  `useOnlineStatus()` and add an "Offline copy" row to the review trail showing
  `RELEASE_LABEL`, plus one quiet line: the source-check date is when the law was
  verified, not when this copy was built. Keep the existing source check, next
  check, and change history visible offline.
  *Done when:* offline, `/scenario/police-stop-search-car` shows the saved-copy row
  and caveat with both dates, and the existing review rows still render; online,
  neither the row nor the caveat appears.

- [ ] **Step 3 - Prompt for new releases, confirm offline saving** - set
  `registerType: 'prompt'` in `vite.config.ts` and add `vite-plugin-pwa/client` to
  the `types` array in `tsconfig.app.json`. Add `src/components/PwaStatus.tsx`
  using `useRegisterSW` from `virtual:pwa-register/react`: a "new release ready"
  toast with Refresh (`updateServiceWorker(true)`) and Dismiss, and a "saved for
  offline" toast that auto-dismisses after a few seconds. Mount it in `Layout`
  only when `import.meta.env.PROD` and `'serviceWorker' in navigator`. Style with
  the existing surface, border, and button classes.
  *Done when:* `npm run build && npm run preview` loads with no error; a first load
  shows the saved-for-offline toast and it disappears on its own; after a rebuild,
  reloading in a second tab shows the new-release toast, Refresh loads the new
  release, and Dismiss hides it without reloading; `npm run dev` shows neither
  toast and logs no service-worker error.

- [ ] **Step 4 - About explainer, truthful copy, hash scrolling** - add an
  `#offline` section to `About` (with TOC entry) covering: the whole app and every
  published guide ship as one release; updates arrive when online and the reader
  is asked to refresh; "source check" is when a person compared the guide with the
  official text, while the release date is when this copy was built; neither
  guarantees the law or a phone number has not changed since; the browser's
  online flag can be wrong on captive portals or flaky networks. Show
  `RELEASE_LABEL` there. Add hash scrolling to `Layout` so a route change with a
  hash scrolls to that element after render, without breaking the existing
  scroll-to-top on plain route changes. Fix the Home offline card (no "N scenarios
  cached / Ready" before the first visit; link it to `/about#offline`) and the
  Encounter hero and "Save for offline" badge (saving is automatic after first
  visit, not a button).
  *Done when:* the offline bar link and the About TOC both land on `#offline`; no
  copy in Home, Encounter, or About claims guides are cached before the first
  visit or offers a non-working save action; `npm run build` and `npm run lint`
  pass.

## Files / areas

- `vite.config.ts` - release define and `registerType: 'prompt'`
- `tsconfig.app.json` - PWA virtual-module types
- `src/lib/env.d.ts` - global declaration for `__RELEASE_DATE__`
- `src/lib/release.ts` - release date and display label
- `src/hooks/useOnlineStatus.ts`
- `src/components/OfflineBar.tsx`, `src/components/PwaStatus.tsx`
- `src/components/Layout.tsx` - mount the bar and toast, hash scrolling
- `src/pages/Scenario.tsx` - offline copy row and caveat
- `src/pages/About.tsx` - `#offline` section and TOC
- `src/pages/Home.tsx`, `src/pages/Encounter.tsx` - copy corrections
- `src/theme.css` - bar and toast styles

## Data / contracts

No content schema changes. These are the new contracts:

| Name | Shape | Notes |
| --- | --- | --- |
| `__RELEASE_DATE__` | `string` (ISO 8601, build time) | Replaced by Vite `define` on every build; declared once in `src/lib/env.d.ts`. Load-bearing for any later freshness UI. |
| `RELEASE_DATE`, `RELEASE_LABEL` | `string` | `src/lib/release.ts`. `RELEASE_LABEL` is the human date, e.g. "29 Oct 2026". |
| `useOnlineStatus()` | `() => boolean` | `useSyncExternalStore` over `online`/`offline`; server snapshot `true` so nothing flashes offline during hydration. |
| PWA registration mode | `registerType: "prompt"` | Replaces silent `autoUpdate`. `PwaStatus` owns the refresh decision. |

The release stamp is a build value, not content data. Do not derive it from
scenario review dates, and do not persist it.

## Testing

No unit runner and no browser harness are configured.

- `npm run build` (content validation + `tsc -b` + Vite) and `npm run lint` after
  every step.
- Manual, in `npm run preview` (production build) and in `npm run dev` where the
  step says so:
  - DevTools, Network, Offline: the bar appears on three routes, hides again, and
    the scenario page shows the saved-copy row with both dates.
  - Narrow width (360px): the bar and toast do not overlap the header or hide
    content.
  - Second-tab update flow: rebuild, reload the open second tab, confirm the toast,
    then confirm Refresh loads the stamped release.
  - Dev server: no toast, no service-worker console error.
- `/check` and browser tests are not configured; UI claims ride on the preview
  steps above. If a runner is added later, the date formatter in
  `src/lib/release.ts` is the first candidate for a unit test.

## Notes for the AI

- Copy only real states. Never say a guide is saved until the service worker has
  installed; the offline bar must read correctly even if saving failed.
- Use the release date for "when this copy was built" and the scenario's
  `lastReviewed` only for "when the law was checked". Never blur the two.
- Do not add analytics, timestamps, or storage. No server, key, or runtime
  dependency; the app stays static and free.
- Reuse existing theme tokens and button classes. Use `role="status"` /
  `aria-live="polite"` for the new notices, and keep them dismissible where the
  reader can act.
- Match the surrounding code style: functional components, typed props, no `any`,
  no em dashes in new user-facing copy.
- Keep the dev experience clean: the PWA toast is production-only, and `registerType`
  changes must not break `npm run dev`.
