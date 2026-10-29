# Content Review Workflow

This is the maintainer process for legal scenario content. The JSON files in
`src/content/scenarios/` are the source of truth. The app reads them directly,
and `scripts/validate-content.cjs` enforces the structural rules described here.

## What "source-verified" means

A scenario is source-verified when its citations have been compared with the
official text of the law or guidance, as published on the issuing agency's own
portal or an official government channel. The check confirms:

- the cited section exists in that text;
- the section says what the scenario claims it says;
- the citation points at the right instrument and year.

Source verification is **not** legal advice and **not** a lawyer's sign-off. The
project does not describe any content as lawyer-reviewed, and no reviewer field
may imply legal review. If a claim cannot be supported by the checked text, the
gap goes in `reviewNotes` rather than being presented as settled.

## Status model

| Status | Publicly listed | Meaning |
| --- | --- | --- |
| `draft` | No | Work in progress. Not ready for readers. |
| `under-review` | Yes, with an in-review label | Written but not yet checked against the official text. |
| `approved` | Yes | Source-verified and published. |
| `needs-revision` | No | A source check found a problem that must be fixed before it can return to review. |
| `retired` | No | Withdrawn or superseded. Kept for history. |

`approved` is only shown as source-verified when `reviewer` and `lastReviewed`
are both set. An approved entry missing either field is shown as "Source check
pending" and is flagged by the validator and the review queue.

## Required metadata

| Field | Required when | Notes |
| --- | --- | --- |
| `status` | Always | One of the five statuses above. |
| `reviewer` | `under-review`, `approved`, `needs-revision` | The verification owner, currently `Content team (source check)`. Must not name a lawyer or claim legal sign-off. |
| `lastReviewed` | `under-review`, `approved`, `needs-revision` | ISO date (`YYYY-MM-DD`) of the latest source check. |
| `nextReview` | `approved` | ISO date for the next scheduled check. Must not be earlier than `lastReviewed`. |
| `reviewNotes` | `under-review`, `approved`, `needs-revision` | What was checked and which source gaps remain. |
| `changeHistory` | `approved`, `under-review`, `needs-revision`, `retired` | At least one dated entry. Each entry needs `date` and `note`; `reviewer` is optional. |
| `sources` | Always | At least one source reference, and every `sourceId` must exist in `sources.json`. |
| `relatedScenarios` | Optional | Every id must exist. |

## Transitions

1. `draft` -> `under-review` when the draft is ready for a source check.
2. `under-review` -> `approved` when every citation matches the official text.
3. `under-review` -> `needs-revision` when the check finds a mismatch or gap.
4. `needs-revision` -> `under-review` after the fixes are made.
5. `approved` -> `needs-revision` when a later source change or report shows a material error.
6. Any status -> `retired` when the entry is withdrawn or superseded.

A material correction is a change to a legal conclusion, citation, exception, or
practical safety step. Add a `changeHistory` entry for every material change.
Minor copy edits do not need a status change, but they still belong in
`changeHistory` when they affect meaning.

## Review queue

Run:

```bash
npm run review:queue
```

The report groups scenarios into source-verified, awaiting source check, under
review, needs revision, and due for re-check. It also lists unverified sources,
any scenario that cites one, and every help directory entry that is not checked. The report is a local maintenance aid; it is
not stored in the app.

## Correction process

1. Triage the report or the report of an error against the cited official text.
2. If the legal meaning changes, set `status` to `needs-revision`, update
   `reviewNotes`, and add a `changeHistory` entry.
3. After the fix, set `status` to `under-review` and update `lastReviewed` when
   the text is re-checked.
4. Move back to `approved` only when the citations match the official text again.
5. Run `npm run validate:content` and `npm run build` before publishing.

In-app feedback is not connected to a backend yet. Do not describe feedback as
saved, sent, or queued until that feature ships.

## Retirement process

1. Set `status` to `retired`.
2. Add a `changeHistory` entry explaining why.
3. Keep the file so old links, history, and citations remain traceable.
4. Run `npm run validate:content` and `npm run build`.

Retired and draft entries stay out of public lists.

## Initial library release bar

The initial library is complete when all three hold:

1. Every published guide is `approved`, has a `reviewer` and `lastReviewed`,
   and cites only verified sources.
2. No published guide carries an open gap in `reviewNotes`.
3. The register has no unverified entry, or the one remaining gap is documented
   under **Known source gaps** with the reason it cannot be closed.

## Known source gaps

Tracked here so they are not lost. No open gap remains in the initial library or
the help directory.

- **Closed 2026-10-29 - support contacts:** every entry in
  `src/content/support.json` was checked against an official agency page. See
  **Help directory verification** for the changes and the pages used.

## Help directory rule

An entry in `src/content/support.json` is published only when it has
`contactVerified: true`, at least one contact, `url` pointing at the
organisation's own page, `verificationSource`, and `lastVerified` with the date of
the check. An entry that cannot be checked is removed, never published as pending.
The emergency tiles follow the same rule because they are entries in the same
file. If a published number stops working, treat it as unverified until the next
review.

`npm run validate:content` fails on a directory entry that breaks this rule, and
`npm run review:queue` lists any entry that is not verified.

## Help directory verification

Dated record of directory changes and the pages they were checked against.

- **2026-10-29:** removed the Nigeria Police Force complaint-unit entry.
  `npf.gov.ng` answers automated requests with a bot checkpoint, so the seeded
  contact could not be checked against the Force's own page. Police complaints are
  now covered by the Police Service Commission, the Public Complaints Commission,
  and the National Human Rights Commission entries.
- **2026-10-29:** removed the NBA Pro Bono Centre entry. The Nigerian Bar
  Association site is a JavaScript app whose fetched HTML contains no contact
  details, so the seeded email could not be checked against it. Free legal support
  remains covered by the Legal Aid Council entry.
- **2026-10-29:** moved the emergency band out of hardcoded page copy and into
  `support.json`, so it follows the same check rule as the rest of the directory.
  Kept 112, checked against NEMA's page on the national emergency short code, and
  122, checked against the FRSC contact page. Removed the NEMA "199" tile: NEMA's
  contact page lists only `info@nema.gov.ng` and `nemapress@yahoo.com`, a site
  search for 199 returns unrelated results, and the hardcoded `0802 220 2158` does
  not appear on any NEMA page checked.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run validate:content` | Validate scenario structure, review metadata, source references, and related ids. |
| `npm run review:queue` | Print the current review queue and source verification gaps. |
| `npm run build` | Validate content, then type-check and build the production bundle. |
