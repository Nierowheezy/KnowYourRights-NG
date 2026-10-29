# Feature: Scenario review workflow

**From build-plan:** feature 3
**Status:** verified

## Goal

Make the legal-content lifecycle explicit and enforceable: draft, submit for review, approve, publish, correct, and retire scenarios. The app must never imply a lawyer reviewed content without a named lawyer and date, and maintainers need one reliable queue for what still needs attention.

## Design reference

- Existing review trail card: `prototypes-five/scenario.html`.
- Existing scenario styles: `src/styles/scenario.css`.
- The new change-history UI should match the current side-card and prose patterns. No new visual direction is needed.

## In scope

- Define the content lifecycle and status transitions in one maintainer document.
- Enforce review metadata in the content validator.
- Add a CLI review queue report.
- Render scenario change history and review metadata on the scenario page.
- Remove dead links and false claims about feedback being stored or queued.
- Run content validation as part of the production build.
- Document the new commands in `AGENTS.md`.

## Out of scope

- Obtaining actual lawyer sign-off or changing legal conclusions.
- A CMS, admin dashboard, database, accounts, or server.
- Persistent user feedback collection (feature 16).
- External URL checking or link monitoring.
- Scheduled review reminders or email automation.
- Deployment setup (feature 19).

## Build loop

Build one step at a time, never the whole feature at once.

1. Plan mode lays out the step before any code.
2. The AI implements just that step.
3. It shows the diff (not full files); you read it and understand it.
4. You approve, then choose whether to commit a checkpoint or roll straight on.
   Checkpoints are optional; `/complete` makes the real feature-level commit at the end.

Never accept a step you haven't read. If a diff is too big to review, the step was too big, so split it.

## Build steps

- [x] **Step 1 - Define and enforce the lifecycle** - write `buildflow/context/content-review.md` with the status model and required metadata, then extend `scripts/validate-content.cjs` to check status values, reviewer, `lastReviewed`, `nextReview`, `reviewNotes`, `changeHistory`, related scenario ids, and source references. *Done when:* the validator exits `0` on current content with only the expected pre-review warnings; removing a required review field from a scratch copy produces a clear error.

- [x] **Step 2 - Add the review queue report** - create `scripts/review-queue.cjs` and a `review:queue` package script. It must group scenarios into lawyer-reviewed, awaiting sign-off, under review, needs revision, due for review, and missing metadata, plus report unverified sources. *Done when:* `npm run review:queue` prints a scannable report showing the current 11 scenarios, 1 lawyer-reviewed entry, 9 awaiting sign-off, and 1 under review.

- [x] **Step 3 - Show change history on scenario pages** - replace the dead "See change history" link with an in-page change-history section that renders each `changeHistory` entry (date, note, reviewer) and an honest empty state. Keep the existing review trail rows. *Done when:* every listed scenario shows its recorded changes, the link scrolls to the section, an empty history shows "No material changes recorded", and `npm run build` passes.

- [x] **Step 4 - Make correction copy truthful** - update `About.tsx` and the scenario feedback block so they do not claim feedback is saved, sent, or queued when it is not. Describe the correction process that actually exists: material changes are recorded in `changeHistory`, and in-app feedback collection is not yet connected. *Done when:* no UI copy claims feedback persistence or automatic review queueing, and the review process still explains how content changes are logged.

- [x] **Step 5 - Wire validation into the build and document commands** - add `validate:content` and `review:queue` scripts to `package.json`, run validation before `tsc -b` in `build`, and add the commands to `AGENTS.md`. *Done when:* `npm run build` runs content validation first, a structural content error stops the build, and the Commands section lists the new scripts.

## Files / areas

- `buildflow/context/content-review.md` (new maintainer document)
- `scripts/validate-content.cjs`
- `scripts/review-queue.cjs` (new)
- `package.json`
- `AGENTS.md`
- `src/pages/Scenario.tsx`
- `src/pages/About.tsx`
- `src/styles/scenario.css`
- `src/lib/schema.ts` only if a missing type is needed; no new persisted fields are planned.

## Data / contracts

Use the existing scenario fields as the lifecycle contract:

| Field | Purpose |
| --- | --- |
| `status` | `draft`, `under-review`, `approved`, `needs-revision`, or `retired` |
| `reviewer` | Named lawyer or internal pre-review owner |
| `lastReviewed` | Date of the latest review or source check |
| `nextReview` | Date the entry is due for another check |
| `reviewNotes` | What remains before legal sign-off |
| `changeHistory` | Dated material changes with optional reviewer |

Status flow:

1. `draft` -> `under-review` when a draft is submitted for legal review.
2. `under-review` -> `approved` when content is cleared for publication.
3. `under-review` -> `needs-revision` when the reviewer finds issues.
4. `needs-revision` -> `under-review` after fixes.
5. `approved` -> `needs-revision` when a correction is accepted.
6. Any status -> `retired` when the entry is superseded or withdrawn.

`approved` content is lawyer-reviewed only when `reviewer` names a lawyer and is not an internal pre-review label. Approved content with a pre-review reviewer stays visible but must keep its "awaiting sign-off" label. Draft and retired entries stay out of public lists.

The review queue is a local CLI report, not a stored API. Its output shape is not load-bearing and should not be imported by the app.

## Testing

No unit test runner is configured in `AGENTS.md`, so this feature uses script output, build output, and a browser check.

- `node scripts/validate-content.cjs` is the primary logic check for steps 1 and 5.
- `npm run review:queue` is the logic check for step 2.
- `npm run build` must pass after every step.
- Browser check: open a scenario page, use the change-history link, and confirm the history rows and empty state.
- Browser check: read the About correction section and the scenario feedback block, and confirm the copy does not promise storage or queueing.

## Notes for the AI

- Do not change legal text, citations, or scenario review dates in this feature.
- Do not invent a lawyer, a reviewer, a contact, or a feedback backend.
- Keep JSON content as the source of truth and reuse `listedScenarios`, `isLawyerReviewed`, and existing content helpers.
- Keep the existing pre-review warnings non-fatal; real content is not lawyer-reviewed yet.
- Do not add new dependencies for the review queue script.
- Follow the existing plain-CSS and React patterns in the repo.
