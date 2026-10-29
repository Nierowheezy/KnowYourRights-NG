# Content Review Workflow

This is the maintainer process for legal scenario content. The JSON files in `src/content/scenarios/` are the source of truth. The app reads them directly, and `scripts/validate-content.cjs` enforces the structural rules described here.

## Status model

| Status | Publicly listed | Meaning |
| --- | --- | --- |
| `draft` | No | Work in progress. Not ready for readers. |
| `under-review` | Yes, with an in-review label | Submitted for legal review but not signed off. |
| `approved` | Yes | Cleared for publication. Lawyer-reviewed only when the reviewer is a named lawyer. |
| `needs-revision` | No | A reviewer found issues that must be fixed before it can return to review. |
| `retired` | No | Withdrawn or superseded. Kept for history. |

`approved` content with an internal pre-review reviewer is published but must be labelled as awaiting sign-off. Only approved content with a named legal reviewer may be described as lawyer-reviewed.

## Required metadata

| Field | Required when | Notes |
| --- | --- | --- |
| `status` | Always | One of the five statuses above. |
| `reviewer` | `under-review`, `approved`, `needs-revision` | A named lawyer or the internal pre-review owner. |
| `lastReviewed` | `under-review`, `approved`, `needs-revision` | ISO date (`YYYY-MM-DD`) of the latest review or source check. |
| `nextReview` | `approved` | ISO date for the next scheduled check. Must not be earlier than `lastReviewed`. |
| `reviewNotes` | `under-review`, `approved`, `needs-revision` | What remains before legal sign-off, or what needs fixing. |
| `changeHistory` | `approved`, `under-review`, `needs-revision`, `retired` | At least one dated entry. Each entry needs `date` and `note`; `reviewer` is optional. |
| `sources` | Always | At least one source reference, and every `sourceId` must exist in `sources.json`. |
| `relatedScenarios` | Optional | Every id must exist. |

## Transitions

1. `draft` -> `under-review` when the draft is submitted for review.
2. `under-review` -> `approved` when the content is cleared for publication.
3. `under-review` -> `needs-revision` when the reviewer finds issues.
4. `needs-revision` -> `under-review` after the fixes are made.
5. `approved` -> `needs-revision` when a material correction is accepted.
6. Any status -> `retired` when the entry is withdrawn or superseded.

A material correction is a change to a legal conclusion, citation, exception, or practical safety step. Add a `changeHistory` entry for every material change. Minor copy edits do not need a status change, but they still belong in `changeHistory` when they affect meaning.

## Review queue

Run:

```bash
npm run review:queue
```

The report groups scenarios into lawyer-reviewed, awaiting sign-off, under review, needs revision, due for review, and missing metadata. It also lists unverified sources. The report is a local maintenance aid; it is not stored in the app.

## Correction process

1. Triage the report against the cited source text.
2. If the legal meaning changes, set `status` to `needs-revision`, update `reviewNotes`, and add a `changeHistory` entry.
3. After the fix, set `status` to `under-review` and update `lastReviewed`.
4. Only a named legal reviewer can move the entry back to `approved` and confirm lawyer-reviewed status.
5. Run `npm run validate:content` and `npm run build` before publishing.

In-app feedback is not connected to a backend yet. Do not describe feedback as saved, sent, or queued until that feature ships.

## Retirement process

1. Set `status` to `retired`.
2. Add a `changeHistory` entry explaining why.
3. Keep the file so old links, history, and citations remain traceable.
4. Run `npm run validate:content` and `npm run build`.

Retired and draft entries stay out of public lists.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run validate:content` | Validate scenario structure, review metadata, source references, and related ids. |
| `npm run review:queue` | Print the current review queue and source verification gaps. |
| `npm run build` | Validate content, then type-check and build the production bundle. |
