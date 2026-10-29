# Feature: Close the source gaps in the initial library

**From build-plan:** feature 4
**Status:** verified

## Goal

Finish the initial scenario library at its current size by removing the last
source gaps. Two guides rest on instruments that are not in the register
(`officer-demanded-money` cites bribery law that has never been downloaded), and
one register entry (`nscdc-act`) points at an amendment rather than the principal
Act. Every published claim should trace to a verified official text, and the
register should contain nothing the team cannot stand behind.

## In scope

- Obtain and extract the official text of the Corrupt Practices and Other Related
  Offences Act 2000, the Criminal Code Act, and the NSCDC Act 2003.
- Verify the exact sections the bribery scenario relies on, from that text.
- Add the two missing instruments to `src/content/sources.json` and correct the
  NSCDC entry.
- Update `officer-demanded-money` so its bribery claims point at verified
  sections, and close the gap note in `reviewNotes`.
- Record the current library release bar in `buildflow/context/content-review.md`
  so "initial library done" has a definition.

## Out of scope

- Adding guides for agencies with no coverage (NSCDC, NDLEA, Immigration,
  KAROTA, LNSC). That is coverage expansion, deferred to a later feature.
- Verifying support-directory contacts (feature 10).
- Any new UI, route, or schema field.
- Changing legal conclusions that the verified text does not contradict.

## Build loop

Build one step at a time, never the whole feature at once.

1. Plan mode lays out the step before any code.
2. The AI implements just that step.
3. It shows the diff (not full files); you read it and understand it.
4. You approve, then choose whether to commit a checkpoint or roll straight on.
   Checkpoints are optional; `/complete` makes the real feature-level commit at the end.

Never accept a step you haven't read. If a diff is too big to review, the step was too big, so split it.

## Build steps

- [x] **Step 1 - Obtain the three texts** - download each instrument from its
  issuing agency or an official government channel, save it to
  `legal-sources/pdfs/`, and extract text to `legal-sources/txt/`. Record the
  source URL, access date, and retrieval route.
  *Done when:* each `.txt` file exists, is clearly more than a cover page, and
  contains readable section text the next step can quote.

- [x] **Step 2 - Verify the bribery provisions** - read the extracted CPO Act and
  Criminal Code text and identify which sections actually create the offences the
  scenario describes (requesting, receiving, and giving a bribe by or to a public
  officer). Write the mapping in the spec's own notes, not in the app.
  *Done when:* every claim in `officer-demanded-money`'s `legalExplanation`,
  `shortAnswer`, and `whatToAvoid` maps to a section that exists in the text, or
  is flagged for rewording.

- [x] **Step 3 - Update the source register** - add `cpo-act-2000` and
  `criminal-code-act` with official URLs, issuing body, dates, verified sections,
  and verification notes. Correct `nscdc-act` to the principal 2003 Act with the
  2007 amendment noted separately.
  *Done when:* `npm run validate:content` passes, the register lists the new
  instruments, and no entry claims verification for text that was not obtained.

- [x] **Step 4 - Fix the bribery scenario** - add the verified CPO Act and
  Criminal Code references to `officer-demanded-money`, adjust wording only where
  the text requires it, replace the open gap in `reviewNotes`, and add a dated
  `changeHistory` entry.
  *Done when:* every citation resolves to a verified source, `reviewNotes` no
  longer describes the bribery law as missing, and the guide's claims still match
  its text.

- [x] **Step 5 - Define the release bar and verify** - add a short "Initial
  library release bar" to `buildflow/context/content-review.md`, then run content
  validation, the review queue, and the build.
  *Done when:* `npm run review:queue` reports 0 unverified sources, or documents a
  single unavoidable gap with its reason; `npm run build` passes.

## Source-check mapping (2026-10-29)

Read from `legal-sources/txt/cpo-act-2000.txt` and
`legal-sources/txt/criminal-code-act.txt`, not from memory.

| Claim in `officer-demanded-money` | Section that supports it |
| --- | --- |
| Bribe-taking is an offence | CPO Act 2000 s8(1) (public officer corruptly asks for, receives or obtains property or benefit); s10 (accepting on account of a public officer's act); Criminal Code s98(1) (public official inviting bribes) |
| Bribe-giving is an offence | CPO Act 2000 s9(1) (corruptly gives, promises or offers property or benefit to a public officer); Criminal Code s98A(1) (person giving bribes) |
| Paying is itself an offence | Same as bribe-giving: CPO Act 2000 s9; Criminal Code s98A |
| Report the demand afterwards | CPO Act 2000 s23(1)-(2) (public officer and the person solicited must report to the Commission or a police officer); s23(3) makes failure an offence |

No claim in the scenario needs rewording. CPO Act s18, s19, and Criminal Code
s98B were read but are not cited: they cover meetings, abuse of office, and
third-party invitations, none of which the guide describes.

Delivery routes: the CPO Act PDF came from the ICPC portal and the Criminal Code
PDF from the PLAC compendium. The NSCDC principal Act is published there as HTML
only, so its page snapshot is in `legal-sources/html/nscdc-act-2003.html` and
its text in `legal-sources/txt/nscdc-act-2003.txt`. No PDF is claimed for it.

## Files / areas

- `legal-sources/pdfs/` and `legal-sources/txt/` (new documents and extracted text)
- `src/content/sources.json`
- `src/content/scenarios/officer-demanded-money.json`
- `buildflow/context/content-review.md`
- `scripts/` only if an extraction helper needs a fix; no new dependency planned

## Data / contracts

Use the existing `SourceSchema`; no field changes.

| New or changed entry | Purpose |
| --- | --- |
| `cpo-act-2000` | Corrupt Practices and Other Related Offences Act 2000, ICPC's enabling Act |
| `criminal-code-act` | Criminal Code Act (official corruption provisions) |
| `nscdc-act` | Nigeria Security and Civil Defence Corps Act 2003, with the 2007 amendment noted |

Source ids are referenced from scenario JSON, so keep `nscdc-act` stable and add
the two new ids without renaming anything.

Release bar, locked here so step 5 is not a judgement call:

1. A published guide is `approved`, has `reviewer` and `lastReviewed`, and every
   cited source is verified.
2. No published guide carries an open gap in `reviewNotes`.
3. The register has no unverified entry, or the one remaining gap is documented
   with the reason it cannot be closed.

The library is complete for this feature when all 11 published guides meet 1 and
2, and 3 holds.

## Testing

No unit runner and no browser harness are configured, and this feature does not
change UI behaviour.

- `npm run validate:content` is the structural check.
- `npm run review:queue` is the source-coverage check: it must show 0 unverified
  sources.
- `npm run build` must pass.
- Manual check: open `/scenario/officer-demanded-money` and confirm the sources
  card lists the CPO Act and Criminal Code with sections and dates.

## Notes for the AI

- Quote only from text actually extracted to `legal-sources/txt/`. Never infer a
  section number from memory or a secondary summary.
- Prefer the issuing agency's own portal. If a portal does not publish the text,
  use an official government channel and say which one in `verificationNotes`.
- Record amendment status when the text or its portal states it; do not guess.
- If a document genuinely cannot be obtained, do not mark it verified. For the
  unused `nscdc-act` entry, remove it from the register and record why in
  `content-review.md` rather than carrying an unverifiable source.
- Do not widen the scenario's claims to match newly found provisions; keep the
  guidance as written unless the text contradicts it.
- Do not touch review status semantics beyond what the source fix requires.
