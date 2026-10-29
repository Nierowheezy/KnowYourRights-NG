# KnowYourRights NG - Project Overview

<!-- buildflow:source-hash ef4dab77028734e193406c2cd732af0f350331908556067ee20315209b6f5798 -->

> Free, mobile-first, searchable guide to Nigerian rights and practical options during roadside and related enforcement encounters.

## Problem

People in Nigeria may not know what the law permits during encounters with police, FRSC, vehicle inspection officers, customs, or other authorities. Laws are spread across sources, hard to search on a phone, and often written in dense language. This project provides accurate, source-backed, safety-first guidance organized by situation.

## Users

- **Everyday road users** - Drivers, riders, commercial drivers, dispatch riders, public transport users, cyclists, and pedestrians needing quick answers.
- **Civil society and advocates** - Groups helping people understand rights.
- **Lawyers/legal reviewers** - Answer specific legal questions readers raise.
- **Project owner** - Maintains software, research, review process, and releases.

Access is public and anonymous; no accounts required for core use.

## Features

In build-plan order:

1. **Legal content model** - Define structured records for scenarios, legal sources, jurisdiction, review status, exceptions, and review dates
2. **Legal source register** - Catalogue verified legislation, regulations, official guidance, and state-specific legal sources
3. **Scenario review workflow** - Establish drafting, source verification, approval, publication, correction, and retirement of legal content
4. **Initial scenario library** - Publish source-verified roadside encounter guides with source-backed explanations and safety-first next steps
5. **Application shell** - Build responsive navigation, homepage, scenario categories, and immediate guidance entry point
6. **Scenario detail pages** - Display concise answers, legal explanations, exceptions, practical options, source links, and review dates
7. **Situation-based search** - Search scenario titles, keywords, agencies, and plain-language questions
8. **Agency and jurisdiction browsing** - Browse guidance by enforcement agency and distinguish federal from state-specific rules
9. **Immediate encounter mode** - Provide concise, safety-first guidance for users dealing with an ongoing encounter
10. **Verified help directory** - List official complaint channels and legal support resources with verification dates
11. **Related scenarios and search recovery** - Suggest relevant guides and useful categories when no exact result is found
12. **Content validation** - Validate scenario records, required fields, and source links before publication
13. **PWA and offline access** - Support installation and offline reading of the application and selected reviewed scenarios
14. **Offline freshness indicators** - Display cached content status and review dates
15. **Accessibility and low-bandwidth support** - Provide readable layouts, keyboard navigation, accessible contrast, and lightweight loading
16. **Privacy-preserving feedback** - Let users flag missing, confusing, or outdated guidance without collecting unnecessary personal data
17. **Content history and corrections** - Track material legal content changes and support corrections and rollback
18. **Usability testing** - Validate search success, comprehension, navigation, and safety of guidance with target users
19. **Production deployment** - Configure static hosting, HTTPS, build validation, content versioning, and deployment recovery
20. **Expanded agency coverage** - Add more federal and state enforcement scenarios after legal verification (Post-MVP)
21. **Language expansion** - Provide Nigerian Pidgin and selected Nigerian language versions checked against the same official sources (Post-MVP)
22. **Legal freshness monitoring** - Identify changes in legislation and official guidance that require scenario review (Post-MVP)
23. **Search gap analysis** - Use privacy-respecting aggregate feedback to identify unanswered questions (Post-MVP)
24. **Expanded legal support directory** - Add verified legal aid organisations and civil society resources (Post-MVP)
25. **AI-assisted scenario discovery** - Optionally map user questions to reviewed scenarios with source-grounded retrieval and uncertainty handling (Post-MVP)
26. **Sustainability and partnerships** - Evaluate donations, grants, and public-interest partnerships while preserving free access and privacy (Post-MVP)

## Data model

### Scenario
- `id` (string, stable) - identifier
- `title` (string) - situation title
- `question` (string, plain-language) - user question
- `keywords` (string[]) - search terms
- `category` (string) - stop/search/payments/documents/arrest/impoundment/complaints
- `shortAnswer` (string) - concise summary with qualifications
- `legalExplanation` (string/markdown) - rights, duties, powers
- `exceptions` (string/markdown) - facts/provisions that change answer
- `practicalOptions` (string/markdown) - safety-first next steps
- `whatToAvoid` (string/markdown) - actions to avoid
- `whatToDocument` (string/markdown) - safe/lawful documentation
- `whatToDoAfter` (string/markdown) - complaint/legal aid
- `sources` (SourceReference[]) - links to primary sources
- `jurisdiction` (enum: federal|state|other, + notes) - scope
- `agency` (string[]) - relevant agencies
- `status` (enum: draft|under-review|approved|needs-revision|retired)
- `reviewer` (string) - who checked the citations against the official text
- `lastReviewed` (date) - date of the last source check
- `nextReview` (date) - next scheduled source check
- `reviewNotes` (string)
- `changeHistory` (array) - material changes
- `relatedScenarios` (string[]) - related scenario IDs

### SourceReference
- `sourceId` (string) - reference to Source
- `sections` (string[]) - relevant sections
- `notes` (string)

### Source
- `id` (string)
- `title` (string) - official title
- `issuingBody` (string)
- `jurisdiction` (enum: federal|state|other)
- `type` (enum: act|regulation|guidance|judgment|commentary|other)
- `publicationDate` (date)
- `commencementDate` (date)
- `amendmentStatus` (string)
- `currentStatusVerified` (boolean)
- `url` (string)
- `documentRef` (string)
- `sections` (string[])
- `lastAccessed` (date)
- `verificationNotes` (string)
- `isPrimary` (boolean) - true if primary law

### Agency
- `id` (string)
- `name` (string)
- `type` (enum: law-enforcement|traffic|customs|immigration|civil-defence|military|other)
- `jurisdiction` (enum: federal|state|other)
- `mandate` (string)
- `scopeNotes` (string)
- `relevantScenarios` (string[])

### SupportChannel
- `id` (string)
- `name` (string)
- `type` (enum: emergency|complaints|legal-aid|civil-society)
- `agencyOrOrg` (string)
- `jurisdiction` (string)
- `issuesHandled` (string[])
- `url` (string)
- `contact` (string) - only if verified
- `verificationSource` (string)
- `lastVerified` (date)
- `limitations` (string)

### Feedback (anonymous)
- `id` (string)
- `scenarioId` (string)
- `category` (enum: helpful|unclear|missing|outdated|broken)
- `suggestion` (string, optional)
- `timestamp` (datetime)

Relationships: Scenario has many SourceReferences (to Source); Scenario belongs to categories/agencies; SupportChannel independent; Feedback references Scenario anonymously.

## Tech stack

- **TypeScript** - Type-safe development
- **React** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Client-side routing** - Lightweight routing solution
- **Markdown/JSON content** - Version-controlled content with schema validation (Zod or equivalent)
- **Local search index** - Client-side search (no server-side search API)
- **PWA (Service Worker)** - Offline access via maintained Vite PWA solution
- **Vitest + React Testing Library** - Testing (opt-in)
- **Static hosting** - Cloudflare Pages or equivalent

## Monetization

Not in v1. Core rights guide remains free. Potential later: grants, partnerships with civil society, donations, carefully governed legal aid partnerships. No advertising, no selling user data/searches, no restricting essential rights information.

## UI/UX

**Routes/screens:**
- `/` - Home / Start here
- `/encounter` or immediate-encounter entry point - Safety-first guidance for ongoing encounters
- `/browse` or category pages - Browse by situation/category
- `/agencies` - Browse by enforcement agency
- `/search` - Search interface
- `/scenario/[id]` - Scenario detail page
- `/help` - Verified complaint channels and legal support
- `/about` - Scope, verification process, limitations, corrections

**Principles:** Mobile-first, calm and clear for stressful situations, prioritize practical info, safety-first, offline indicators, accessible (contrast, keyboard nav, screen readers), no account required.

## Deployment

- **Type:** Static-first Progressive Web App
- **Host:** Cloudflare Pages or suitable static host (HTTPS required)
- **Build:** Install deps, validate content/source links, run tests, build
- **Output:** Static files (Vite build output)
- **Env vars:** None required for core functionality; public env vars only if analytics/feedback added later (never secrets)
- **PWA:** Service worker caches app shell and selected reviewed scenarios
- **Versioning:** Content release versioning
- **Monitoring:** Broken links, build failures, content freshness
- **Rollback:** Ability to restore previous app/content release

> Deployment target not yet finalized beyond static hosting; confirm provider details when ready.

## Open questions

- **Stack specifics:** Confirm exact routing library, PWA plugin, and content schema location (src/content vs separate repo) during scaffolding.
- **Source verification capacity:** Download and check the official text behind every citation before publishing a scenario. Legal questions raised by readers go to a lawyer, but the publication gate is source verification.
- **Initial agency priority:** Confirm which state(s) to cover first (Lagos mentioned as example) beyond Police/FRSC.
- **Content validation tooling:** Decide on schema validation approach and link-checking strategy.
- **Feedback mechanism:** Design privacy-preserving feedback collection (anonymous) without backend if possible.
- **Hosting:** Finalize Cloudflare Pages vs alternative static host.
