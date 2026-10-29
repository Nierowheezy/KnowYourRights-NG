# Project Plan

\> This document defines the problem, users, MVP features, data, technical architecture, legal-content rules, constraints, and exclusions for the Nigerian roadside rights guide. Use it as the source of truth when developing the project and its implementation plan. Once this document and `build-plan.md` are ready, run `/overview` to generate the project overview.

## 1. Problem: What problem are we solving?\*\*

`

People in Nigeria can encounter police officers, road-safety officers, state traffic enforcement personnel, vehicle inspection officers, customs officers, and other authorities while travelling. During these encounters, people may not know what the law permits, what an officer is entitled to request, how to respond safely, or where to seek help afterward.

The relevant laws and regulations are often lengthy, spread across different sources, difficult to search on a phone, or written in language that is hard to interpret quickly. People may rely on hearsay, social media posts, or broad claims that leave out important legal exceptions.

This project solves that problem by building a free, mobile-first, searchable guide to Nigerian rights and practical options during roadside and related enforcement encounters.

The guide will:

- Organize information by situation rather than requiring users to know the name of a law.

- Explain relevant legal rights and enforcement powers in plain English.

- Link each substantive legal explanation to the relevant Act, regulation, section, or authoritative source.

- Distinguish federal law from state-specific laws and procedures.

- Explain exceptions and uncertainty instead of presenting broad legal claims as universal rules.

- Give safety-first practical guidance for responding to an encounter.

- Help users find appropriate official complaint channels and legal support after an incident.

- Work on low-cost smartphones and unreliable mobile connections.

- Make core guides available offline after they have been loaded.

- Remain free for users and inexpensive to maintain.

**\*\*Main purpose:\*\*** Help ordinary Nigerians quickly find accurate, understandable, source-backed information about their rights and safe options during roadside enforcement encounters.

The platform is an educational legal-information resource. It must not encourage confrontation, physical resistance, obstruction of lawful duties, or risky evidence gathering. It must not promise that following a guide will prevent arrest, seizure, fines, or other consequences.

## 2. Users: Who is this for?\*\*

**\*\*Primary users:\*\*** Everyday Nigerians who may encounter law-enforcement or traffic-enforcement personnel while driving, riding in a commercial vehicle, using public transport, cycling, or walking.

**\*\*Initial target audience:\*\*** Road users who need clear answers to common questions about stops, documents, searches, fines, unofficial payment demands, vehicle impoundment, arrest, and complaints.

**\*\*Secondary users:\*\***

- Commercial drivers, dispatch riders, and transport workers who regularly encounter roadside enforcement.

- Civil society organizations, rights advocates, and community groups that help people understand their rights.

- Lawyers and legal reviewers who can verify content and identify gaps.

- The project owner, who maintains the software, research sources, content review process, and release process.

The initial release is a free public resource for use in Nigeria. It is not a law firm, emergency service, incident investigation platform, police reporting system, or substitute for advice from a qualified lawyer about an individual case.

The first release should prioritize common roadside encounters and a small number of carefully reviewed scenarios rather than attempting to cover every Nigerian law or every government agency.

## 3. Features: What does the MVP need?\*\*

### 3.1 Situation-Based Scenario Library\*\*

The platform must organize answers around the user's situation.

Initial scenario categories should include:

- An officer has stopped me.

- An officer is asking for my identity or vehicle documents.

- An officer wants to search my vehicle.

- An officer wants to search my phone or access its contents.

- An officer wants to arrest me or take me to a station.

- An officer is asking me for money.

- I have been issued a traffic ticket or told to pay a fine.

- My vehicle or goods may be impounded or seized.

- I believe an officer is threatening, intimidating, or abusing their authority.

- I want to make a complaint after an encounter.

Requirements:

- Each scenario must have a clear title written in language ordinary users are likely to search.

- Provide a concise answer near the top of the page.

- Explain the applicable legal position, relevant limits, and exceptions.

- Provide practical, safety-first next steps.

- Link to the supporting legal source and the relevant section where available.

- Identify whether the answer depends on the state, location, type of road, alleged offence, or specific facts.

- Clearly identify unanswered questions or uncertainty.

- Include related scenarios so users can continue to relevant information.

- Display the content's last-reviewed date and review status.

- Avoid presenting an unreviewed draft as verified legal guidance.

The initial release should contain approximately 15 to 25 reviewed scenarios. This is a planning target, not a requirement to publish a fixed number before the content is ready.

### 3.2 Search and Navigation\*\*

Users must be able to find information without knowing legal terminology.

Requirements:

- Search scenario titles, plain-language questions, keywords, agency names, and relevant legal terms.

- Support common phrases such as "they want money", "police want my phone", "FRSC stopped me", and "they want to impound my car".

- Provide category browsing for stops, searches, payments, documents, arrest, impoundment, and complaints.

- Offer suggested searches and related scenarios.

- Handle common spelling variations where practical.

- Work without a server-side search API for the initial release.

- Return a useful no-results message and allow users to browse related categories.

- Keep search fast on low-cost phones and slow connections.

Search is a way to locate reviewed content. It must not generate new legal conclusions.

### 3.3 Scenario Answer Structure\*\*

Every substantive scenario should follow a consistent structure.

Required fields:

- **\*\*Situation:\*\*** What the user may be experiencing.

- **\*\*Short answer:\*\*** A concise summary of the legal position, with necessary qualifications.

- **\*\*What the law says:\*\*** The relevant rights, duties, and enforcement powers.

- **\*\*Important exceptions:\*\*** Facts or legal provisions that may change the answer.

- **\*\*What you can do now:\*\*** Calm, practical, safety-first options.

- **\*\*What to avoid:\*\*** Actions that could increase danger or create legal risk.

- **\*\*What to document later:\*\*** Information a person may record when safe and lawful.

- **\*\*What to do afterward:\*\*** Appropriate complaint channels, legal aid, or further assistance.

- **\*\*Legal sources:\*\*** Exact Act, regulation, section, source link, and relevant notes.

- **\*\*Jurisdiction:\*\*** Federal, state, or other applicable scope.

- **\*\*Review information:\*\*** Reviewer or review process, last-reviewed date, and content status.

Requirements:

- Put the most immediately useful information first.

- Use plain English and short paragraphs.

- Avoid absolute claims where exceptions may apply.

- Explain the difference between a legal right and a practical recommendation.

- Never state that an officer has or lacks a power unless the cited sources support the claim.

- Do not treat a general disclaimer as a substitute for accurate content.

- Include an appropriate note that the guide provides general legal information, not legal representation or a determination of an individual case.

### 3.4 Agency and Jurisdiction Guidance\*\*

The guide must help users understand which agency and legal framework may be relevant.

Initial agencies and bodies to research include:

- Nigeria Police Force.

- Federal Road Safety Corps.

- State Vehicle Inspection Officers and equivalent state agencies.

- State traffic enforcement agencies, including LASTMA where Lagos-specific content is covered.

- Nigeria Customs Service, particularly for relevant customs and border contexts.

- Nigeria Security and Civil Defence Corps where relevant to the scenario.

- Nigerian Immigration Service where relevant to border and immigration enforcement.

- Military personnel only for carefully researched situations where their involvement and legal authority are relevant.

Requirements:

- Do not assume every agency has the same powers.

- Identify the applicable federal law, state law, regulation, or lawful delegation.

- Treat Lagos-specific procedures as state-specific, not as rules for all Nigeria.

- Distinguish an agency's general mandate from the specific power relevant to a scenario.

- Avoid implying that every agency routinely conducts ordinary roadside traffic enforcement.

- Include an agency only when there is a verified and useful scenario to support it.

- Keep agency coverage expandable as legal research and user testing identify demand.

The first release should prioritize the Police, FRSC, and selected state traffic or vehicle inspection scenarios. Other agencies can be added after their relevant powers and use cases have been reviewed.

### 3.5 Legal Source Register\*\*

The project must maintain a source register for the laws and authoritative materials used in the guide.

Potential source categories include:

- Acts of the National Assembly.

- State laws and regulations.

- Official government publications.

- Official agency guidance and procedures.

- Court judgments and authoritative legal decisions where relevant.

- Reputable legal repositories where official copies are not readily available.

- Legal commentary used to locate or interpret primary sources, clearly distinguished from primary law.

Requirements:

- Record the source title, issuing body, jurisdiction, date, URL, and relevant sections.

- Prefer official primary sources when available.

- Record when a source is a secondary reproduction rather than an official publication.

- Verify that a law has not been amended, repealed, or superseded before relying on it.

- Do not assume that a search result or an undated PDF is the current law.

- Keep a record of source retrieval and review dates.

- Make the source link accessible from the relevant scenario.

- Record uncertainty when the current text or interpretation cannot be verified.

The initial legal source register should cover the Nigeria Police Act, 2020, the FRSC (Establishment) Act, 2007, relevant National Road Traffic Regulations, the Nigeria Customs Service Act, 2023, and the state laws required for the scenarios actually included in the MVP. Inclusion in this list does not mean that every provision has already been verified or is relevant to every scenario.

### 3.6 Legal Review and Content Governance\*\*

Legal accuracy is a core product requirement.

Requirements:

- Have a Nigerian lawyer review initial substantive scenarios before publication.

- Maintain a clear distinction between draft, under review, approved, and needs-revision content.

- Record who reviewed a scenario or which review process approved it.

- Track the sources supporting each legal claim.

- Re-review content when relevant laws, regulations, judgments, or official procedures change.

- Provide a correction mechanism for users and legal reviewers.

- Keep a change history for material legal-content updates.

- Remove or mark content that can no longer be supported by current sources.

- Do not use AI output as legal verification.

- Do not label content as lawyer-reviewed unless that review has actually occurred.

If a legal issue cannot be stated confidently from the available sources, the guide must say so and point users toward qualified legal assistance where appropriate.

### 3.7 Safety-First Guidance\*\*

The platform must account for the practical power imbalance during an encounter.

Requirements:

- Prioritize immediate personal safety over arguing about legal rights.

- Avoid advising physical resistance, threats, obstruction, or escalation.

- Avoid telling users to refuse every instruction, search, request, or demand.

- Explain when a person may need to comply in the moment while preserving the option to challenge conduct later.

- Do not recommend secretly recording an officer without reviewing the applicable legal and safety considerations.

- Do not require users to gather evidence while an encounter is ongoing.

- Encourage documentation only when it is safe and lawful.

- Make clear that a user should seek emergency help if there is an immediate threat to life or safety.

- Avoid implying that the app can intervene in an active incident.

- Use careful language where the safest practical response depends on facts that the guide cannot know.

A prominent "I am dealing with this right now" entry point should present concise, safety-first guidance and the next practical step before showing detailed legal background.

### 3.8 Complaint and Legal Support Directory\*\*

The platform should help users find suitable next steps after an incident.

Requirements:

- Provide links to relevant official complaint bodies and legal support resources.

- State which agency or conduct each channel handles, where verified.

- Prefer official contact details and reporting instructions.

- Record source URLs and last verification dates for contact information.

- Distinguish emergency services, complaints bodies, legal aid, and civil society support.

- Do not promise that a complaint will be accepted, investigated, or resolved.

- Avoid publishing unverified phone numbers, email addresses, or social media accounts.

- Provide a fallback instruction when a contact channel cannot be verified.

- Allow users to navigate to the external reporting channel without submitting incident details to this platform.

The MVP should link users to established reporting channels rather than collect or investigate allegations itself.

### 3.9 Progressive Web App and Offline Access\*\*

The product should be a mobile-first Progressive Web App.

Requirements:

- Work in modern mobile and desktop browsers.

- Provide an installable experience where supported.

- Cache the app shell and selected core scenario content for offline access.

- Clearly indicate when the user is reading cached content.

- Display the last update or review date for cached legal content.

- Update cached content when a newer version becomes available.

- Avoid showing stale cached content as if it had just been checked against current law.

- Keep downloads and initial page loads small.

- Support low bandwidth and modest devices.

- Provide accessible typography, contrast, keyboard navigation, and touch targets.

- Make core information readable without requiring an account.

Offline content cannot guarantee that a law or contact detail remains current. The interface must make that limitation clear.

### 3.10 Language and Accessibility\*\*

English is the initial content language.

Potential later languages include Nigerian Pidgin, Yoruba, Hausa, and Igbo, subject to review capacity.

Requirements:

- Keep legal concepts consistent across translations.

- Have translations reviewed by people competent in both the language and the legal meaning.

- Avoid presenting machine translation as an authoritative legal translation.

- Use plain language and explain unavoidable legal terms.

- Avoid relying on colour alone to communicate warnings or content status.

- Support screen readers and accessible focus states.

- Make essential information readable on narrow screens.

- Do not let language expansion delay the release of a smaller, accurate English version.

### 3.11 Privacy and Security\*\*

The MVP should not require personal accounts or collect incident reports.

Requirements:

- Do not require names, phone numbers, identity documents, or precise location to read the guide.

- Do not collect officer names, photos, vehicle registrations, or incident narratives by default.

- Avoid location tracking and unnecessary third-party analytics.

- Do not store sensitive search history on a server.

- Use privacy-respecting, minimal analytics only if needed to evaluate product usefulness.

- Explain any analytics and obtain consent where required.

- Keep dependencies updated and use HTTPS.

- Protect the content publishing process against unauthorized changes.

- Never include API keys or private credentials in frontend code or version control.

- Review applicable obligations under the Nigeria Data Protection Act, 2023 before adding any personal-data processing.

- Conduct a privacy review before adding feedback forms, incident submissions, or location-based features.

The product must not imply that using the guide or searching for a scenario is confidential if the actual hosting, analytics, or browser environment cannot support that promise.

### 3.12 Feedback and Content Gaps\*\*

The project should provide a lightweight way for users to report missing, confusing, outdated, or broken content.

Requirements:

- Allow users to indicate that an answer was helpful or unclear without requiring an account.

- Offer an optional way to suggest a missing scenario.

- Do not request sensitive incident details in the initial feedback form.

- Explain that feedback is not an emergency or complaint channel.

- Avoid collecting unnecessary personal information.

- Review submissions before changing legal content.

- Track repeated unanswered questions to prioritize future scenarios.

- Do not treat user-submitted claims as verified legal facts.

Feedback should improve the content library without turning the MVP into an incident-reporting service.

### 3.13 AI and Assisted Search\*\*

AI is not required for the MVP.

The first version must rely on reviewed scenario content and deterministic search.

If AI is considered later, it may help map a user's wording to relevant published scenarios, but it must not become an independent legal authority.

Future AI requirements, if approved:

- Retrieve answers only from the reviewed legal-content library.

- Show the specific sources and scenarios used.

- Avoid inventing legal sections, cases, contact details, or agency powers.

- Say when the library does not contain enough information.

- Direct users to qualified legal assistance for unresolved or fact-specific issues.

- Apply rate limits and cost controls.

- Avoid sending personal or sensitive incident details to external model providers.

- Keep AI output clearly distinct from lawyer-reviewed source content.

- Test for misleading, unsafe, and overconfident answers before release.

AI must not be introduced solely to make the product appear more sophisticated.

## 4. Data: What are we storing?\*\*

The MVP needs only the data required to publish, search, review, and maintain legal information.

### Legal Content\*\*

Each scenario should include:

- Stable scenario identifier.

- Title and plain-language question.

- Search keywords and category.

- Short answer.

- Legal explanation.

- Exceptions and jurisdiction notes.

- Safety-first practical guidance.

- Suggested next steps.

- Source references.

- Content status.

- Last-reviewed date.

- Next review date or review trigger.

- Review notes and change history where appropriate.

### Legal Sources\*\*

Each source record should include:

- Stable source identifier.

- Official title.

- Issuing body.

- Jurisdiction.

- Source type.

- Publication or commencement date where verified.

- Amendment or current-status notes where verified.

- URL or document reference.

- Relevant section references.

- Date last accessed.

- Verification notes.

### Agency and Support Directory\*\*

Each directory record should include:

- Agency or organization name.

- Type of support.

- Jurisdiction or area served.

- Issues handled, where verified.

- Official contact or reporting URL.

- Verification source.

- Last verification date.

- Notes on any limitations.

### Application Data\*\*

The static application may include:

- Search index.

- Scenario categories.

- App version.

- Content release version.

- Cache metadata.

- Accessibility and interface preferences where required.

### Feedback Data\*\*

If anonymous feedback is enabled, store only what is necessary, such as:

- Scenario identifier.

- Feedback category.

- Optional short suggestion.

- Submission timestamp.

Avoid collecting identity, precise location, or incident details by default. Define retention and deletion rules before enabling feedback collection.

**\*\*Persistence:\*\*** Store scenarios and source metadata in version-controlled Markdown, JSON, or another simple content format. A database is not required for the MVP. The build process should validate content fields and source references before deployment.

No user accounts, subscription billing, centralized incident database, public API, or AI conversation history is required in v1.

## 5. Tech: What stack are we using?\*\*

The implementation should prioritize a small, maintainable, static-first web application with reliable offline behaviour.

- **\*\*Runtime and language:\*\*** TypeScript.

- **\*\*Frontend:\*\*** React with Vite.

- **\*\*Styling:\*\*** Tailwind CSS.

- **\*\*Routing:\*\*** A lightweight client-side or static-compatible routing solution.

- **\*\*Content:\*\*** Version-controlled Markdown or JSON with a defined schema.

- **\*\*Validation:\*\*** Zod or an equivalent schema validator for content and build-time checks.

- **\*\*Search:\*\*** Local client-side search over the published content index.

- **\*\*PWA:\*\*** Web app manifest and service worker, using a maintained Vite PWA solution if appropriate.

- **\*\*Hosting:\*\*** Cloudflare Pages or another static host with suitable free-tier terms.

- **\*\*Testing:\*\*** Vitest and React Testing Library, plus browser-level tests for key flows.

- **\*\*Accessibility:\*\*** Automated checks plus manual keyboard and screen-reader testing.

- **\*\*Analytics:\*\*** None by default; if added, use a minimal privacy-respecting option after review.

- **\*\*AI:\*\*** Not included in the MVP.

- **\*\*Database:\*\*** Not required for the MVP.

- **\*\*Backend:\*\*** Not required for the core guide.

### Proposed Architecture\*\*

`Reviewed Markdown/JSON Content`

→ `Content Schema Validation`

→ `Build-Time Source and Link Checks`

→ `Static React Application`

→ `Local Search Index`

→ `Scenario and Agency Pages`

→ `Service Worker and Offline Cache`

→ `Static Hosting`

A separate content review process should take place before the build and publication steps. Publishing must not automatically turn a draft into verified legal guidance.

### Architectural Constraints\*\*

- No native mobile application is required for the MVP.

- No user registration or authentication is required.

- No paid AI API is required.

- No database server is required.

- No server-side search service is required.

- No incident reporting or evidence upload is required.

- No location tracking is required.

- No personalized legal decision engine is required.

- No claim that the app can contact authorities on the user's behalf.

- No dependence on a single external model provider.

- No legal answer should be generated dynamically from unreviewed text.

- The app must remain usable if optional analytics or third-party services are unavailable.

### Content Reference Documents\*\*

Maintain focused context documents so that content and legal rules can be updated without rewriting the entire project plan.

Recommended files:

- `blueprint/context/legal-content-policy.md`: Content standards, legal review, publication status, corrections, and review cycles.

- `blueprint/context/source-register.md`: Primary legislation, regulations, official sources, and verification notes.

- `blueprint/context/scenario-template.md`: Required fields and structure for every scenario.

- `blueprint/context/agency-scope.md`: Agency mandates, jurisdictions, and boundaries for initial coverage.

- `blueprint/context/safety-guidance.md`: Safety-first wording, prohibited advice patterns, and escalation guidance.

- `blueprint/context/privacy-and-data.md`: Data minimization, analytics, feedback, retention, and privacy obligations.

- `blueprint/context/pwa-and-offline.md`: Cache behaviour, stale-content handling, updates, and offline limitations.

- `blueprint/context/content-review-process.md`: Legal review workflow, approvals, correction requests, and release checks.

- `blueprint/context/testing-and-acceptance.md`: Scenario tests, search tests, accessibility checks, and release criteria.

These documents must distinguish verified legal positions from assumptions, unresolved research, and proposed product behaviour.

## 6. Monetize: How will this make money?\*\*

No monetization is planned for v1. The core rights guide should remain free to access. The MVP should also avoid recurring operating costs by using free tools and hosting tiers wherever practical, without compromising legal review, privacy, accessibility, or safety.

The first objective is to establish that users can find and understand reliable information, that the legal content is trustworthy, and that the platform can be maintained responsibly.

Potential later support models include:

- Grants for civic technology, access to justice, and public-interest information.

- Partnerships with civil society and rights organizations.

- Institutional sponsorship that does not control legal conclusions or user data.

- Donations to support legal review, translation, hosting, and maintenance.

- Carefully governed partnerships with legal aid providers.

Commercial activity must not restrict essential rights information or compromise user privacy.

Avoid selling user searches or incident data. Do not accept sponsorship that requires changing, suppressing, or selectively presenting legal information. Any funding arrangement should be transparent.

The platform should not be launched with advertising or paid features that interfere with access to urgent information.

## 7. UI/UX: How should this look and feel?\*\*

The experience should be mobile-first, calm, clear, accessible, and designed for stressful situations.

The interface should prioritize practical information over decoration. It should not resemble a legal document repository or an AI dashboard.

### Core Navigation\*\*

The initial navigation should provide:

- **\*\*Start here:\*\*** A quick route for people dealing with an encounter now.

- **\*\*Search:\*\*** Search by situation, words, agency, or legal topic.

- **\*\*Browse situations:\*\*** Explore the scenario library by category.

- **\*\*Agencies:\*\*** Browse verified guidance by agency.

- **\*\*Get help:\*\*** Find official complaint channels and legal support.

- **\*\*About this guide:\*\*** Explain scope, legal review, limitations, and corrections.

### Immediate-Encounter Mode\*\*

Provide a visible entry point for users who need quick guidance.

Requirements:

- Ask only essential questions, such as which agency is involved and what is happening.

- Allow the user to skip questions and browse directly.

- Present immediate safety guidance first.

- Show the short answer and next practical step before detailed legal context.

- Avoid long questionnaires and unnecessary personal questions.

- Make it easy to return to the complete legal explanation.

- Clearly state that the app cannot provide emergency intervention.

### Scenario Page Layout\*\*

Each scenario page should prioritize:

1. Situation title.

2. Short answer and essential safety note.

3. What the law says.

4. What the user can do now.

5. Important exceptions and jurisdiction.

6. Source references.

7. What to do afterward.

8. Related scenarios.

9. Last-reviewed date and content status.

### Design Principles\*\*

- Use readable typography and strong contrast.

- Keep the layout light and fast on mobile.

- Avoid unnecessary animation, gradients, glass effects, and decorative dashboards.

- Use clear labels for verified, under-review, and outdated content.

- Do not rely on colour alone for warnings or status.

- Make legal sources easy to open without overwhelming the main answer.

- Provide a clear offline indicator.

- Make the search field prominent.

- Use plain, non-inflammatory language.

- Avoid presenting the app as a weapon against officers or encouraging confrontational behaviour.

### Example: Scenario Answer\*\*

**\*\*Police have stopped my vehicle. What should I do?\*\***

**\*\*First:\*\*** Stay calm and prioritize your safety. Do not physically resist. The legal position depends on the circumstances and the authority being exercised.

**\*\*Understand your position:\*\*** Review the applicable guidance on the reason for the stop, requests for documents, searches, and any alleged offence.

**\*\*Next step:\*\*** Open the relevant section for the specific request being made.

**\*\*Legal basis:\*\*** The published answer should link to the exact provisions that have been reviewed for this scenario.

**\*\*Important:\*\*** This example is a layout illustration, not approved legal advice. The production version must contain a legally reviewed explanation and must not publish placeholder legal conclusions.

## 8. Deployment: Where and how will this ship?

### Zero-Cost MVP Constraint

The initial MVP must be developed, tested, and launched using free tools and service tiers wherever practical. The project must not depend on paid infrastructure to provide its core rights guide.

- Use the existing development computer and free, open-source development tools wherever practical.
- Store source code and version-controlled legal content in a free source-code hosting plan.
- Deploy the static application to a suitable free hosting tier, such as Cloudflare Pages, after checking current terms and limits.
- Use the hosting provider's subdomain for the initial launch. A custom domain is optional and must not block release.
- Do not introduce paid APIs, AI services, databases, backend hosting, paid analytics, subscriptions, or other recurring services into the MVP.
- Prefer local client-side search and version-controlled content over paid infrastructure.
- Keep the core guide usable without accounts, paid integrations, location tracking, or incident submissions.
- Check current free-tier limits, terms, build limits, bandwidth limits, and usage restrictions before deployment. Do not assume a free tier will remain unchanged indefinitely.
- Treat legal review, internet access, electricity, and other external expenses as possible costs. Do not compromise legal accuracy or safety to maintain a zero-cost budget. Seek qualified volunteer or pro bono legal review where available, without describing content as lawyer-reviewed until review has actually happened.
- Reassess spending only after usability testing provides evidence of public value and a clear reason to incur the cost.

The zero-cost target is a launch constraint, not a guarantee that the project can operate indefinitely without any expense. If a required service becomes paid or exceeds its free limits, prefer a free alternative or defer the optional feature rather than silently introducing a recurring cost.
\*\*

- **\*\*Type:\*\*** Static-first Progressive Web App.

- **\*\*Initial host:\*\*** Cloudflare Pages or another suitable static hosting service.

- **\*\*Build:\*\*** Install dependencies, validate content and source links, run tests, and build the production application.

- **\*\*Release:\*\*** Deploy the approved build and publish a versioned content release.

- **\*\*Domain:\*\*** Optional for the first prototype; a custom domain can be added when appropriate.

- **\*\*HTTPS:\*\*** Required for production.

- **\*\*Monitoring:\*\*** Check availability, broken links, build failures, and content freshness.

- **\*\*Backups:\*\*** Version-controlled source code and content, with a documented recovery process.

- **\*\*Offline:\*\*** Cache the app shell and selected published scenarios; show cached content dates.

- **\*\*Rollback:\*\*** Keep the ability to restore a previous application and content release.

### Environment Variables\*\*

The static MVP should require no secret environment variables for core functionality.

If optional services are added later, configuration may include:

- Public application URL.

- Optional analytics configuration.

- Optional feedback service configuration.

- Build and content validation settings.

Never put private credentials or secret API keys in frontend code. A public environment variable embedded in a static build must be treated as visible to every user.

### Operational Requirements\*\*

- Validate all scenario records before publication.

- Check that source URLs are well-formed and accessible where automated checks are possible.

- Do not treat a successful HTTP response as proof that a source is legally current.

- Record the published content version.

- Show when content was last reviewed.

- Keep a correction and rollback process.

- Test offline behaviour after each relevant service-worker change.

- Monitor hosting and build failures.

- Keep dependencies maintained.

- Provide a way to report a broken link or potentially outdated answer.

- Review legal content on a defined schedule and when a material legal change is identified.

### Deployment Exclusions\*\*

The initial deployment does not require:

- A long-running application server.

- A database server.

- User accounts.

- Authentication.

- Subscription billing.

- An AI backend.

- A public API.

- Incident evidence uploads.

- Location-based tracking.

- Push notifications.

- A native Android or iOS application.

## 9. Explicit Exclusions and Guardrails\*\*

The following are outside the MVP unless explicitly approved later:

- Providing legal representation or case-specific legal opinions.

- Guaranteeing a legal outcome.

- Claiming that every stop, search, arrest, fine, or seizure is lawful or unlawful without examining the applicable rules and facts.

- Encouraging physical resistance or confrontation.

- Advising users to obstruct lawful duties.

- Encouraging unsafe or unlawful evidence gathering.

- Publishing unverified accusations against individual officers.

- Collecting incident reports or evidence for investigation.

- Automatically sending complaints to authorities.

- Tracking users' precise location.

- Requiring identity information to read the guide.

- Treating social media posts or hearsay as authoritative law.

- Treating an unofficial copy of legislation as current without verification.

- Publishing legal claims without traceable supporting sources.

- Presenting AI-generated text as lawyer-reviewed content.

- Generating legal conclusions from unrestricted AI prompts.

- Adding a chatbot before the core content and search experience are validated.

- Covering every Nigerian agency and state law in the first release.

- Monetizing access to essential rights information.

- Selling search, identity, or incident data.

Any future feature that processes personal data, accepts allegations, or offers case-specific legal guidance requires a separate legal, privacy, safety, and operational review.

## 10. Acceptance Criteria\*\*

The MVP is ready for public release when:

- Users can find a relevant scenario through search or browsing.

- The initial scenario set has been reviewed under the documented legal review process.

- Every substantive legal claim has a traceable source or is explicitly marked as unresolved.

- Source records distinguish primary law from secondary commentary.

- Federal and state-specific rules are clearly distinguished.

- Scenario pages explain relevant exceptions and avoid unsupported absolute claims.

- Safety-first guidance is visible where an encounter may be ongoing.

- The platform does not encourage confrontation or unsafe actions.

- Official complaint and support links included in the MVP have been checked against their sources.

- The interface works on common mobile screen sizes.

- Core content remains accessible offline after being cached.

- Cached content displays an appropriate last-update or review date.

- The application does not require an account to access the guide.

- No unnecessary personal data is collected by the core experience.

- Keyboard navigation, contrast, readable text, and essential accessibility behaviours have been tested.

- Automated tests cover content validation, search, navigation, and offline behaviour where practical.

- Broken source links and malformed content are caught before release where automated checks can detect them.

- A correction process and release rollback process exist.

- Users can distinguish general legal information from individualized legal advice.

- A small usability test shows that users can locate and explain the meaning of relevant guidance without being coached.

Initial success should be measured by answer-finding speed, comprehension, user trust, successful access on low-bandwidth connections, repeated use, and the quality of legal review. Page views alone are not sufficient evidence of impact.

## 11. Implementation Priorities\*\*

Build in the following order:

1. Define the MVP audience, scope, and safety principles.

2. Create the legal-content policy and scenario template.

3. Build the legal source register and verify the initial source documents.

4. Select the first 15 to 25 high-value scenarios based on user research.

5. Draft and obtain legal review for the first scenarios.

6. Set up the React, TypeScript, and Vite repository.

7. Define and validate the scenario content schema.

8. Build the mobile-first home page and situation-based navigation.

9. Implement local search and related-scenario links.

10. Build reusable scenario pages with sources, exceptions, and review dates.

11. Add the immediate-encounter entry point and safety-first presentation.

12. Add the verified complaint and legal support directory.

13. Implement PWA installation and offline content caching.

14. Add accessibility, content validation, and link-checking tests.

15. Test the prototype with real road users and revise unclear content.

16. Review privacy, security, legal wording, and stale-content behaviour.

17. Publish the first reviewed release and document the correction process.

18. Monitor unanswered searches, feedback, and content review needs.

19. Expand agency coverage and language support only when review capacity permits.

20. Reconsider AI or other advanced features only after the core guide demonstrates real value.

The first milestone is not the number of agencies covered or the number of pages published. It is whether a person can find accurate, understandable, safety-conscious guidance for a common encounter and verify the legal source behind it.

Only after the initial content and user experience have been validated should the project expand into more complex legal topics, additional languages, or AI-assisted search.
