# Fix: Replace lawyer sign-off with source verification

**Type:** Fix
**Status:** verified

## The problem

The content lifecycle requires a named Nigerian lawyer before a scenario can be
labelled reviewed. The project will instead rely on the official documents
published on each agency's own portal, checked against the scenario citations.
The current model has three problems:

1. It blocks publication on a review step that is not going to happen, so every
   scenario carries "Awaiting lawyer sign-off" or an unverified lawyer name.
2. One scenario (`police-phone-search-checkpoint`) names a reviewer
   ("A. Bello, Esq. (NBA)") with no verified sign-off behind it, and its change
   history claims an "Initial lawyer review" in 2024.
3. The UI, validator, review queue, and docs all describe a lawyer gate that the
   project is dropping.

## The fix

Make source verification the review standard: a scenario is published when its
citations have been checked against the official text on the issuing agency's
portal, and the app says exactly that. No lawyer claim, no pending-sign-off
badge, no named reviewer credential.

- `status: "approved"` now means "source-verified and published".
- `reviewer` becomes the verification owner: `Content team (source check)`.
- `reviewNotes` records what was checked and what gap remains.
- `reviewNotes` must not claim legal sign-off or legal advice.
- `police-phone-unlock` moves from `under-review` to `approved`; its citations
  were checked on 2026-10-29 like the others.
- The fabricated lawyer attributions in `police-phone-search-checkpoint` are
  replaced with dated source-check entries.

Keep field names (`reviewer`, `lastReviewed`, `nextReview`, `reviewNotes`,
`changeHistory`) so the schema stays stable and no migration is needed.

Do not change legal text, citations, or section numbers. Do not add a source
that was not actually downloaded and checked. Known gaps stay recorded:
`officer-demanded-money` still lacks CPO Act 2000 and Criminal Code sources, and
`nscdc-act` is still unverified.

## Build steps

- [x] **Step 1 - Update scenario content** - rewrite `reviewer`, `reviewNotes`,
  and `changeHistory` in all 11 scenario files; approve `police-phone-unlock`;
  remove the lawyer name and the "Initial lawyer review" claim.
  *Done when:* no scenario file contains "lawyer review", "sign-off", "Esq.", or
  a pre-review label, and every approved scenario has a verification owner and
  date.

- [x] **Step 2 - Update derived labels and pages** - replace `isLawyerReviewed`
  and `lawyerReviewedCount` with `isSourceVerified` and `sourceVerifiedCount`,
  and update `getReviewBadge`, the announce bar, Home, Browse, Search, Agencies,
  About, and Scenario to say "Source-verified" with the checked date.
  *Done when:* no rendered copy claims lawyer review or pending lawyer sign-off.

- [x] **Step 3 - Update the validator and review queue** - drop the pre-review
  warning, treat approved + owner + date as source-verified, flag scenarios that
  cite an unverified source, and relabel the queue sections around source checks.
  *Done when:* `npm run validate:content` exits 0 with only source-gap warnings,
  and `npm run review:queue` reports 11 source-verified scenarios.

- [x] **Step 4 - Update the docs and plans** - rewrite
  `buildflow/context/content-review.md` for the source-verification model, and
  align the lawyer-review lines in `buildflow/project-plan.md`,
  `buildflow/context/project-overview.md`, and `buildflow/build-plan.md`.
  *Done when:* the docs describe one model, with no lawyer gate left in the
  active workflow files.

- [x] **Step 5 - Verify** - run `npm run validate:content`, `npm run
  review:queue`, and `npm run build`.
  *Done when:* all three pass and the built pages show source verification only.

## Verify

- `npm run review:queue` shows 11 source-verified scenarios and the `nscdc-act`
  source gap.
- `npm run build` passes.
- On `/scenario/police-phone-search-checkpoint`, the review trail reads
  "Source-verified", the reviewer reads "Content team (source check)", and the
  change history has no lawyer attribution.
- `/about#review` explains verification against official portal documents, not
  lawyer sign-off.
