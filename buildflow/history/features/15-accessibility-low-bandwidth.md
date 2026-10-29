# Feature: Accessibility and low-bandwidth support

**From build-plan:** feature 15
**Status:** not started

## Goal

Make the guide usable on modest phones and in stressful situations. Ensure readable typography, sufficient contrast, keyboard-only operation, and a small payload so it loads quickly on slow networks. No new dependencies.

## In scope

- Audit and fix colour contrast for text, links, buttons, and badges against WCAG AA.
- Ensure all interactive elements are keyboard reachable with visible focus rings, logical tab order, and skip links where appropriate.
- Increase minimum touch target size to 44px and remove small hit areas.
- Reduce initial payload: remove unused CSS, lazy-load non-critical images, and avoid render-blocking scripts beyond Vite's default.
- Add `prefers-reduced-motion` support and respect system reduced motion.
- Add `lang="en"` on `<html>`, proper heading hierarchy, and `aria-label` where icon-only controls exist.
- Provide a low-bandwidth mode toggle that disables decorative images and heavy CSS animations, persisted in `localStorage`.
- Add a simple Lighthouse / axe sanity check to the build documentation.

## Out of scope

- Full WCAG AAA compliance or automated accessibility test runner integration – manual checks sufficient for v1.
- Screen-reader specific ARIA roles beyond semantic HTML and labels.
- Internationalization or Pidgin versions – feature 21.
- Performance budget enforcement with budgets.json – defer to later.

## Build loop

Build one step at a time, never the whole feature at once.

## Build steps

- [ ] **Step 1 - Contrast and focus audit** - run a manual contrast check on primary text, links, badges, and the offline bar. Update `src/theme.css` tokens where contrast fails AA. Add `:focus-visible` styles using existing ring token. *Done when:* `npm run build && npm run lint` pass and a manual check shows focus ring visible on all interactive elements.
- [ ] **Step 2 - Keyboard navigation and semantics** - add a skip-to-content link, ensure nav, buttons, and links are reachable in logical order, add `aria-label` to icon-only theme toggle and nav toggle. Verify heading hierarchy on Home, Scenario, and About. *Done when:* Tabbing through Home and Scenario visits all controls in order, screen reader reads page title and landmarks correctly.
- [ ] **Step 3 - Touch targets and motion** - increase minimum tap sizes to 44px for nav links and buttons, add `@media (prefers-reduced-motion: reduce)` to disable animations and transitions. *Done when:* DevTools shows no tap targets <44px and motion is disabled when OS prefers reduced motion.
- [ ] **Step 4 - Low-bandwidth mode** - add a small toggle in the header to enable low-bandwidth mode, persisted in `localStorage`. When active, hide decorative images and disable non-essential animations, reduce font loads if possible. Add a note in About. *Done when:* Toggling the mode hides decorative images, persists across reload, and `npm run build` size does not increase.

## Files / areas

- `src/theme.css` – contrast tokens, focus styles, reduced-motion media query
- `src/components/Layout.tsx` – skip link, low-bandwidth toggle state
- `src/components/ui/` – ensure semantic headings and aria labels
- `index.html` – `lang` attribute
- `src/pages/Home.tsx`, `src/pages/Scenario.tsx`, `src/pages/About.tsx` – heading hierarchy fixes
- `src/lib/theme.ts` – optional low-bandwidth preference persistence

## Data / contracts

No schema changes. Low-bandwidth preference stored client-side as `kyr-lowbw` in `localStorage`, boolean.

## Testing

No unit runner configured. Verify per step with `npm run build`, `npm run lint`, manual keyboard tabbing, and DevTools Lighthouse Performance and Accessibility scores. Observe payload size reduction via `dist/assets` gzip sizes.

## Notes for the AI

- Keep existing visual language; only adjust tokens for contrast.
- No new dependencies. Use CSS only.
- Avoid em dashes in user-facing copy.
- Keep changes small and reviewable per step.
