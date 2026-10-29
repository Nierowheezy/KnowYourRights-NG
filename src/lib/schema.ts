import { z } from "zod";

export const SourceType = z.enum(["act", "regulation", "guidance", "judgment", "commentary", "other"]);
export const Jurisdiction = z.enum(["federal", "state", "other"]);
export const ScenarioStatus = z.enum(["draft", "under-review", "approved", "needs-revision", "retired"]);
export const AgencyType = z.enum(["law-enforcement", "traffic", "customs", "immigration", "civil-defence", "military", "other"]);
export const SupportType = z.enum(["emergency", "complaints", "legal-aid", "civil-society"]);
export const FeedbackCategory = z.enum(["helpful", "unclear", "missing", "outdated", "broken"]);

export const SourceSchema = z.object({
  id: z.string(),
  title: z.string(),
  issuingBody: z.string(),
  jurisdiction: Jurisdiction,
  type: SourceType,
  publicationDate: z.string().optional(),
  commencementDate: z.string().optional(),
  amendmentStatus: z.string().optional(),
  currentStatusVerified: z.boolean().default(false),
  url: z.string().url().optional(),
  documentRef: z.string().optional(),
  sections: z.array(z.string()).default([]),
  lastAccessed: z.string().optional(),
  verificationNotes: z.string().optional(),
  isPrimary: z.boolean().default(true),
});

export const SourceReferenceSchema = z.object({
  sourceId: z.string(),
  sections: z.array(z.string()).default([]),
  notes: z.string().optional(),
});

export const ScenarioSchema = z.object({
  id: z.string(),
  title: z.string(),
  /** Short label for breadcrumbs / meta (defaults to title). */
  shortTitle: z.string().optional(),
  /** Emoji shown in agency badges. */
  icon: z.string().optional(),
  question: z.string(),
  keywords: z.array(z.string()).default([]),
  category: z.enum(["stop-search", "payments", "documents", "arrest", "impoundment", "complaints", "other"]),
  shortAnswer: z.string(),
  legalExplanation: z.string(),
  exceptions: z.string().optional(),
  practicalOptions: z.string(),
  whatToAvoid: z.string().optional(),
  whatToDocument: z.string().optional(),
  whatToDoAfter: z.string().optional(),
  sources: z.array(SourceReferenceSchema).min(1),
  jurisdiction: Jurisdiction,
  agency: z.array(z.string()).default([]),
  status: ScenarioStatus.default("draft"),
  /** Source-check owner. Never a lawyer claim: the model records source verification, not legal sign-off. */
  reviewer: z.string().optional(),
  lastReviewed: z.string().optional(),
  nextReview: z.string().optional(),
  reviewNotes: z.string().optional(),
  changeHistory: z.array(z.object({
    date: z.string(),
    note: z.string(),
    reviewer: z.string().optional(),
  })).default([]),
  relatedScenarios: z.array(z.string()).default([]),
});

export const AgencySchema = z.object({
  id: z.string(),
  name: z.string(),
  /** Short badge label, e.g. "NPF". */
  abbr: z.string().optional(),
  type: AgencyType,
  jurisdiction: Jurisdiction,
  mandate: z.string().optional(),
  scopeNotes: z.string().optional(),
  relevantScenarios: z.array(z.string()).default([]),
});

export const SupportChannelSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: SupportType,
  agencyOrOrg: z.string(),
  jurisdiction: z.string().optional(),
  issuesHandled: z.array(z.string()).default([]),
  url: z.string().url().optional(),
  contact: z.string().optional(),
  verificationSource: z.string().optional(),
  lastVerified: z.string().optional(),
  limitations: z.string().optional(),
  /** Presentation fields used by the help directory cards. */
  icon: z.string().optional(),
  description: z.string().optional(),
  coverageNote: z.string().optional(),
});

export const FeedbackSchema = z.object({
  id: z.string(),
  scenarioId: z.string(),
  category: FeedbackCategory,
  suggestion: z.string().optional(),
  timestamp: z.string(),
});

export type Source = z.infer<typeof SourceSchema>;
export type Scenario = z.infer<typeof ScenarioSchema>;
export type Agency = z.infer<typeof AgencySchema>;
export type SupportChannel = z.infer<typeof SupportChannelSchema>;
export type Feedback = z.infer<typeof FeedbackSchema>;
