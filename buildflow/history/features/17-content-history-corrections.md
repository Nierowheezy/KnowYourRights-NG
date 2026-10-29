# Feature: Content history and corrections

**From build-plan:** feature 17
**Status:** not started

## Goal

Make material changes to legal guidance transparent and auditable. Users can see a dated change history per scenario and understand why the guidance changed.

## In scope

- Ensure `changeHistory` entries are displayed in a readable timeline on Scenario pages.
- Add a summary of latest material change to the review trail.
- Allow scenario authors to add correction notes via content files, with validation in `scripts/validate-content.cjs`.
- No new UI for editing; content changes remain file-based.

## Out of scope

- In-app editing or moderation workflow.
- Automated diffing.

## Build steps

- [ ] **Step 1** - Validate changeHistory schema and render timeline.
- [ ] **Step 2** - Add latest change summary to review trail.

## Files / areas

- `src/pages/Scenario.tsx` - ChangeHistory component
- `scripts/validate-content.cjs` - schema check

## Data / contracts

`Scenario.changeHistory` array of `{date, reviewer?, note}`.

## Testing

`npm run build`, `npm run validate:content`.
