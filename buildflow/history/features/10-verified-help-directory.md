# Feature: Verified help directory

**From build-plan:** feature 10
**Status:** verified

## Goal

Make `/help` a directory the project can stand behind. Every published channel
is checked against the organisation's own page, shows a link to that page and the
date it was checked, and can be tapped to call or email. Entries that cannot be
checked against an official page are removed, not published with a "pending"
label, because the page currently mixes checked and unchecked data.

## In scope

- Replace the free-text `contact` field with structured, tappable contacts
  (phone / email / web) and an explicit `contactVerified` flag.
- Verify and correct the complaint channels: Police Service Commission, FRSC.
- Resolve the NPF entry (its site blocks automated checks), and add verified
  federal channels that cover the same need: Public Complaints Commission and
  National Human Rights Commission.
- Verify and correct the legal-aid and civil-society channels: Legal Aid Council
  (wrong domain in the seed data), CLEEN Foundation (wrong email in the seed
  data), and the NBA Pro Bono Centre.
- Fix the emergency band: it currently labels 199 as NEMA and carries a phone
  number that is not on NEMA's contact page.
- Show the verification source, its date, and working `tel:`/`mailto:` links on
  every card; remove the "Verification pending" branch and the
  `limitations`-regex heuristic that decides verification.
- Make the validator and review queue report the directory state, and document
  the directory rule in `buildflow/context/content-review.md`.

## Out of scope

- Adding legal-aid organisations or state-level channels beyond the entries
  above; that is feature 24.
- A directory admin UI, database, or remote updates.
- Feedback collection (feature 16), offline freshness UI (feature 14), and the
  broader accessibility pass (feature 15).
- Changing scenario content or legal sources.

## Build loop

Build one step at a time, never the whole feature at once.

1. Plan mode lays out the step before any code.
2. The AI implements just that step.
3. It shows the diff (not full files); you read it and understand it.
4. You approve, then choose whether to commit a checkpoint or roll straight on.
   Checkpoints are optional; `/complete` makes the real feature-level commit at the end.

Never accept a step you haven't read. If a diff is too big to review, the step was too big, so split it.

## Build steps

- [x] **Step 1 - Define the directory contract** - add `contactVerified`
  (default `false`) and a `contacts` array of `{ kind: "phone" | "email" | "web",
  value }` to `SupportChannelSchema`; migrate the six existing entries from the
  `contact` string to the new array **verbatim**, without changing any value or
  claiming verification; update `Help.tsx` just enough to render the new array so
  the page keeps working; rewrite `isSupportVerified` to read the flag; extend the
  validator with structural checks (id, name, type, at least one contact, phone
  values carrying at least three digits so short codes such as 112 and 122 are
  valid, email values containing `@`, date and
  URL formats, duplicate ids) and add a support line to `review:queue`.
  *Done when:* `npm run validate:content` and `npm run build` pass,
  `npm run review:queue` prints a support summary showing `0 verified`, and the
  page still renders the six existing entries with the same visible values.

- [x] **Step 2 - Verify the complaint channels** - check the Police Service
  Commission and FRSC against their own contact pages, replace the seeded values
  with what the pages actually show, and record `url`, `verificationSource`, and
  `lastVerified` for each.
  *Done when:* every published phone and email appears on the recorded official
  page, the wrong seeded FRSC email is gone, and the build passes.

- [x] **Step 3 - Resolve the police channel and add verified fallbacks** - the
  NPF site sits behind a bot checkpoint and its seeded contact (`0803 123 4567`)
  cannot be checked, so try one documented official alternative; if none is
  fetchable, remove the NPF entry. Add the Public Complaints Commission and the
  National Human Rights Commission, each checked against its own site.
  *Done when:* no unverifiable police entry is published, both new channels carry
  checked values and dates, and the reason for any removal is recorded in
  `buildflow/context/content-review.md`.

- [x] **Step 4 - Verify legal-aid and civil-society channels** - correct the Legal
  Aid Council domain to its live official site, correct CLEEN's email, and settle
  the NBA Pro Bono Centre: publish it only if an official page shows the contact,
  otherwise remove it and record why.
  *Done when:* the same "published value appears on the recorded page" rule holds
  for every remaining legal-aid and civil-society entry, and the build passes.

- [x] **Step 5 - Fix the emergency band** - move the three tiles into
  `support.json` as `type: "emergency"` entries and render the band from data, so
  the same verification rule covers them. Check each number against an official
  page: 122 against the FRSC page; 199 and the NEMA phone are not on NEMA's
  contact page, and 112 needs an official page. Keep only numbers backed by a
  page checked in this step, show the source and check date on the tile, and
  record removals in `content-review.md`.
  *Done when:* no uncited emergency number is shown, 122 still works, and any
  dropped number is explained in `content-review.md`. Losing 199 and possibly 112
  is an acceptable outcome; an uncited number is not.

- [x] **Step 6 - Make the cards tell the truth** - render "Checked Mon YYYY", a
  link to `verificationSource`, and tappable `tel:`/`mailto:` contacts; delete the
  "Verification pending" branch and the regex heuristic; render a section only
  when it has entries and show a short fallback when a category is empty. Update
  the hero lede and the closing callout so they describe a checked-only directory
  instead of "entries awaiting re-verification".
  *Done when:* every card shows a working contact link, a source link, and a
  check date; no card can render a pending badge; no copy mentions pending or
  awaiting re-verification; an empty category does not leave a blank heading.

- [x] **Step 7 - Enforce and document** - make the validator fail when a support
  entry is not verified or lacks `url`, `verificationSource`, `lastVerified`, or a
  contact; make `review:queue` report unverified entries; add the directory rule
  to `content-review.md` and close the "Support contacts" gap there.
  *Done when:* deleting `contactVerified` from a scratch copy fails
  `npm run validate:content` with a clear message, the queue reports
  `0 unverified`, and `/help` shows only verified entries.

## Files / areas

- `src/lib/schema.ts` - `SupportChannelSchema`, contact shape
- `src/lib/content.ts` - `isSupportVerified` and exports
- `src/content/support.json`
- `src/pages/Help.tsx` - card rendering, emergency band from data, copy
- `src/styles/help.css` - source line and contact links only
- `scripts/validate-content.cjs`
- `scripts/review-queue.cjs`
- `buildflow/context/content-review.md`

## Data / contracts

`SupportChannel` changes are load-bearing for feature 24 (expanded directory):

| Field | Change |
| --- | --- |
| `contacts` | **New.** `Array<{ kind: "phone" \| "email" \| "web"; value: string }>`, at least one. Replaces `contact`. |
| `contactVerified` | **New.** Boolean, default `false`. The only signal the UI and queue trust. |
| `url` | Required once an entry is published; the page the values were checked against. |
| `verificationSource` | Human-readable label for that page, e.g. "PSC contact page". |
| `lastVerified` | `YYYY-MM-DD` date of the check. |
| `limitations` | Kept for real caveats only (e.g. "toll-free line may not work on all networks"), never as a verification signal. |

Published-directory rule: every entry in `support.json` has `contactVerified:
true`, a `url`, a `verificationSource`, a `lastVerified` date, and at least one
contact. `validate-content.cjs` enforces it from step 7 onward.

## Research notes (provisional, re-check in the step)

Gathered during spec research on 2026-10-29. These are starting points, not
approval: each step must re-fetch the page and copy what it shows.

| Channel | Official page | What the page showed |
| --- | --- | --- |
| Police Service Commission | `https://psc.gov.ng/contact/` | `info@psc.gov.ng`; `+234 703 407 2676`, `+234 703 407 2677` |
| FRSC | `https://frsc.gov.ng/contact-us/` | `info@frsc.gov.ng`; `+234 913 960 0038`, `+234 913 960 0037`; toll free `122`, `0700 2255 3772` |
| Legal Aid Council | `https://legalaidcouncil.gov.ng/` | `info@legalaidcouncil.gov.ng`; `+234 703 191 5990`. The seeded `legalaid.gov.ng` does not resolve. |
| CLEEN Foundation | `https://cleen.org/contact/` | `cleen@cleen.org`; `0810 249 3148` |
| NHRC | `https://nhrc.gov.ng/contact-us/` | `info@nhrc.gov.ng`; toll-free short code `6472` |
| Public Complaints Commission | `https://pcc.gov.ng/` | `complaint@pcc.gov.ng`, `info@pcc.gov.ng`; `+234 807 010 0580`, `+234 209 700 0099` |
| Nigeria Police Force | `https://npf.gov.ng/` | Vercel bot checkpoint; no page content retrievable |
| NBA | `https://www.nigerianbar.org.ng/` | JavaScript shell; no contact details in the fetched HTML |
| NEMA | `https://nema.gov.ng/contact-us/` | `info@nema.gov.ng`; no phone number on the page |

Seed data that the pages contradict: FRSC `callcentre@frsc.gov.ng`, PSC
`09 461 5021`, CLEEN `info@cleen.org`, Legal Aid `legalaid.gov.ng` and
`090 2888 7333`, NPF `complaints@npf.gov.ng · 0803 123 4567`.

## Testing

No unit runner and no browser harness are configured.

- `npm run validate:content` is the structural check for steps 1 and 7.
- `npm run review:queue` is the directory-coverage check: it must show `0
  unverified` at the end.
- `npm run build` and `npm run lint` must pass after every step.
- Manual check at `/help`: count the cards, confirm each has a date, a source
  link, and a contact that opens the dialler or mail app; confirm no pending
  badge; confirm the emergency band matches the recorded sources.
- Check the page at a narrow width so the longer contact rows do not overflow.

## Notes for the AI

- Copy only what an official page shows. Never invent, "tidy", or normalise a
  phone number or email that the page does not contain.
- Record the exact page used in `url` and a short label in `verificationSource`;
  put the check date in `lastVerified` in `YYYY-MM-DD`.
- If a page cannot be loaded, say so in the step summary and remove the entry
  rather than publishing a guess. Log the removal in `content-review.md`.
- Do not describe any listing as an endorsement, referral, or partnership.
- Keep the app static and free; add no service, key, or runtime dependency.
- Keep the existing card and badge styles; reuse `badge-lime` for the checked
  state and the current muted style for caveats.
