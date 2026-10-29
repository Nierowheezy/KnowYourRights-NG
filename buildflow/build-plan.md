# Build Plan

> One of the two planning docs you provide. Write it directly, develop it through any AI conversation, or optionally run `/discovery`. Keep the items high-level even when `project-plan.md` is detailed; later `/feature` specs hold the depth for each build item.

The features that make up this project, high level and in rough build order, one line each, no detail (that comes per feature). Rough is fine at first, but before `/overview` runs this file should be shaped into a checkbox list the build loop can track.

Keep it as a checklist. Run `/feature` with no number to spec the **next unchecked** item, or `/feature 3` / `/feature "scenario search"` to pick a specific one. Completed features get checked off here, so the build plan doubles as your progress tracker. A big item gets split into sub-items (4a, 4b, etc.) when you spec it.

## Continuing after the initial build

This is a living roadmap, not a plan that freezes when the first release is done. Keep completed items checked, then append new unchecked features as the project grows. Optional milestone headings such as `## MVP` and `## Post-MVP` keep a longer plan readable without changing how `/feature` finds the next unchecked item.

Do not renumber completed features because their archived specs refer back to those numbers. Continue with the next unused number. If a new feature materially changes the product direction, users, data, stack, monetization, UI/UX, or deployment, update the relevant part of `project-plan.md` too. Then re-run `/overview` before spec'ing the feature.

Scaffolding the app (create-next-app, etc.) and prototyping the look are pre-build steps, not features (see the README), so don't list them here. Start with your first real slice of functionality.

A common order that works well: build the core UI with placeholder data first, then wire up data, auth, and integrations. Add deployment readiness only when the app is worth shipping or a provider config change is part of the work. Adapt it to this project. The initial MVP must target zero-cost development and launch using free tools and a suitable free static-hosting tier. Do not add paid services to the MVP without explicit approval.

## Format

Use checkboxes. Each item should be a feature-sized outcome, not a loose task or a whole product area.

Good:

- [ ] 1. **Skill submission** - upload a skill package and save its metadata
- [ ] 2. **Validation result** - run checks and show pass/fail status for a skill
- [ ] 3. **Directory listing** - browse and filter published skills
- [ ] 4. **Deployment readiness** - configure a free hosting tier and verify the production build

Avoid:

- Upload stuff
- Database
- Make it look nice
- Auth, billing, dashboard, validation, and deploy

If your first pass is just rough bullets, that is okay. Run `/overview` after filling both planning docs; it will flag plan-shape problems and can propose a cleaned-up checkbox version before generating the project overview.

## MVP

- [ ] 1. **Legal content model** - define structured records for scenarios, legal sources, jurisdiction, review status, exceptions, and review dates
- [ ] 2. **Legal source register** - catalogue verified legislation, regulations, official guidance, and state-specific legal sources
- [ ] 3. **Scenario review workflow** - establish drafting, lawyer review, approval, publication, correction, and retirement of legal content
- [ ] 4. **Initial scenario library** - publish lawyer-reviewed roadside encounter guides with source-backed explanations and safety-first next steps
- [ ] 5. **Application shell** - build responsive navigation, homepage, scenario categories, and immediate guidance entry point
- [ ] 6. **Scenario detail pages** - display concise answers, legal explanations, exceptions, practical options, source links, and review dates
- [ ] 7. **Situation-based search** - search scenario titles, keywords, agencies, and plain-language questions
- [ ] 8. **Agency and jurisdiction browsing** - browse guidance by enforcement agency and distinguish federal from state-specific rules
- [ ] 9. **Immediate encounter mode** - provide concise, safety-first guidance for users dealing with an ongoing encounter
- [ ] 10. **Verified help directory** - list official complaint channels and legal support resources with verification dates
- [ ] 11. **Related scenarios and search recovery** - suggest relevant guides and useful categories when no exact result is found
- [ ] 12. **Content validation** - validate scenario records, required fields, and source links before publication
- [ ] 13. **PWA and offline access** - support installation and offline reading of the application and selected reviewed scenarios
- [ ] 14. **Offline freshness indicators** - display cached content status and review dates
- [ ] 15. **Accessibility and low-bandwidth support** - provide readable layouts, keyboard navigation, accessible contrast, and lightweight loading
- [ ] 16. **Privacy-preserving feedback** - let users flag missing, confusing, or outdated guidance without collecting unnecessary personal data
- [ ] 17. **Content history and corrections** - track material legal content changes and support corrections and rollback
- [ ] 18. **Usability testing** - validate search success, comprehension, navigation, and safety of guidance with target users
- [ ] 19. **Zero-cost production deployment** - publish the reviewed static application on a suitable free hosting tier with HTTPS, build validation, content versioning, and deployment recovery; use the provider subdomain initially and introduce no paid service without explicit approval

## Post-MVP

- [ ] 20. **Expanded agency coverage** - add more federal and state enforcement scenarios after legal verification
- [ ] 21. **Language expansion** - provide legally reviewed Nigerian Pidgin and selected Nigerian language versions
- [ ] 22. **Legal freshness monitoring** - identify changes in legislation and official guidance that require scenario review
- [ ] 23. **Search gap analysis** - use privacy-respecting aggregate feedback to identify unanswered questions
- [ ] 24. **Expanded legal support directory** - add verified legal aid organisations and civil society resources
- [ ] 25. **AI-assisted scenario discovery** - optionally map user questions to reviewed scenarios with source-grounded retrieval and uncertainty handling; only proceed if a genuinely free implementation is available or costs are explicitly approved
- [ ] 26. **Sustainability and partnerships** - evaluate donations, grants, and public-interest partnerships while preserving free access and privacy
