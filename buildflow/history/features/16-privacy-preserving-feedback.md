# Feature: Privacy-preserving feedback

**From build-plan:** feature 16
**Status:** not started

## Goal

Let users flag missing, confusing, or outdated guidance without collecting personal data, accounts, or tracking. Feedback is local-first and optional export for the project owner.

## In scope

- Add a “Flag this guide” UI on scenario pages that opens a minimal modal with three options: Missing info, Confusing wording, Possibly outdated.
- Allow free-text note, capped at 500 chars, no name/email fields.
- Store submissions in localStorage as a queue, display a small counter in header.
- Provide an export button that generates a JSON file with timestamp, scenario id, category, and note – no IP, no user id.
- Add a note in About explaining the privacy model and that feedback is not sent automatically.

## Out of scope

- Server-side storage, analytics, or automatic email.
- Authentication or user accounts.
- Full bug tracker UI.

## Build steps

- [ ] **Step 1 - Flag UI and local queue** - add modal component, store submissions in localStorage, show counter.
- [ ] **Step 2 - Export** - generate downloadable JSON of queued feedback.
- [ ] **Step 3 - Copy and About note** - add privacy note, ensure no personal data fields.

## Files / areas

- `src/components/FeedbackModal.tsx`
- `src/components/Layout.tsx` - counter
- `src/pages/Scenario.tsx` - flag button
- `src/pages/About.tsx` - privacy note

## Data / contracts

No schema changes. LocalStorage key `kyr-feedback-queue` holds array of `{scenarioId, category, note, ts}`.

## Testing

`npm run build` and `npm run lint`. Manual test modal, localStorage persistence, export JSON.

## Notes for the AI

No network requests. Do not add analytics. Keep copy short and no em dashes.
