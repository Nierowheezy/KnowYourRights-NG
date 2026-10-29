#!/usr/bin/env node
/* Lightweight content integrity check (mirrors src/lib/schema.ts invariants). */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const C = path.join(ROOT, "src", "content");
const SCEN = path.join(C, "scenarios");

const STATUSES = new Set(["draft", "under-review", "approved", "needs-revision", "retired"]);
const REVIEWED_STATUSES = new Set(["under-review", "approved", "needs-revision"]);
const HISTORY_STATUSES = new Set(["under-review", "approved", "needs-revision", "retired"]);
/** Under the source-verification model, a reviewer field must not claim legal sign-off. */
const LAWYER_CLAIM = /lawyer|barrister|solicitor|esq\.?\b|sign-?off/i;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const sources = read(path.join(C, "sources.json"));
const agencies = read(path.join(C, "agencies.json"));
const support = read(path.join(C, "support.json"));
const scenarioFiles = fs.readdirSync(SCEN).filter((f) => f.endsWith(".json"));
const scenarios = scenarioFiles.map((f) => ({ file: f, data: read(path.join(SCEN, f)) }));

const errors = [];
const warn = [];
const statusCounts = {};

const isText = (value) => typeof value === "string" && value.trim().length > 0;
const isDate = (value) => typeof value === "string" && DATE.test(value);

const srcIds = new Set();
for (const s of sources) {
  if (srcIds.has(s.id)) errors.push(`duplicate source id: ${s.id}`);
  srcIds.add(s.id);
  if (!s.title) errors.push(`source ${s.id} missing title`);
  if (s.url && !/^https?:\/\//.test(s.url)) errors.push(`source ${s.id} bad url`);
}

const scenIds = new Set();
for (const { file, data: s } of scenarios) {
  if (!s.id) {
    errors.push(`${file}: missing id`);
    continue;
  }
  if (scenIds.has(s.id)) errors.push(`${file}: duplicate scenario id ${s.id}`);
  scenIds.add(s.id);
}

const required = ["id", "title", "question", "shortAnswer", "legalExplanation", "practicalOptions", "jurisdiction", "category", "sources"];
for (const { file, data: s } of scenarios) {
  for (const k of required) if (!s[k] || (Array.isArray(s[k]) && s[k].length === 0)) errors.push(`${file}: missing ${k}`);
  if (!Array.isArray(s.sources) || s.sources.length === 0) errors.push(`${file}: no sources`);
  for (const ref of s.sources || []) {
    if (!srcIds.has(ref.sourceId)) errors.push(`${file}: unknown sourceId ${ref.sourceId}`);
    if (!Array.isArray(ref.sections) || ref.sections.length === 0) {
      errors.push(`${file}: source ${ref.sourceId} has no sections`);
    }
  }
  for (const rid of s.relatedScenarios || []) {
    if (!scenIds.has(rid)) errors.push(`${file}: related scenario ${rid} does not exist`);
  }

  if (!STATUSES.has(s.status)) {
    errors.push(`${file}: invalid status "${s.status}"`);
    continue;
  }
  statusCounts[s.status] = (statusCounts[s.status] || 0) + 1;

  if (REVIEWED_STATUSES.has(s.status)) {
    if (!isText(s.reviewer)) errors.push(`${file}: status=${s.status} requires reviewer`);
    if (!isDate(s.lastReviewed)) errors.push(`${file}: status=${s.status} requires lastReviewed as YYYY-MM-DD`);
    if (!isText(s.reviewNotes)) errors.push(`${file}: status=${s.status} requires reviewNotes`);
  }

  if (isText(s.reviewer) && LAWYER_CLAIM.test(s.reviewer)) {
    errors.push(`${file}: reviewer "${s.reviewer}" claims legal sign-off; use the source-check owner`);
  }
  if (isText(s.reviewNotes) && /lawyer review|signed off by/i.test(s.reviewNotes)) {
    warn.push(`${file}: reviewNotes still references lawyer review`);
  }

  if (s.status === "approved") {
    if (!isDate(s.nextReview)) errors.push(`${file}: status=approved requires nextReview as YYYY-MM-DD`);
    if (isDate(s.lastReviewed) && isDate(s.nextReview) && s.nextReview < s.lastReviewed) {
      errors.push(`${file}: nextReview must not be earlier than lastReviewed`);
    }
    for (const ref of s.sources || []) {
      const src = sources.find((x) => x.id === ref.sourceId);
      if (src && !src.currentStatusVerified) {
        warn.push(`${file}: cites unverified source "${ref.sourceId}"`);
      }
    }
  }

  if (HISTORY_STATUSES.has(s.status)) {
    if (!Array.isArray(s.changeHistory) || s.changeHistory.length === 0) {
      errors.push(`${file}: status=${s.status} requires at least one changeHistory entry`);
    }
  }
  for (const entry of s.changeHistory || []) {
    if (!isDate(entry.date)) errors.push(`${file}: changeHistory entry needs a YYYY-MM-DD date`);
    if (!isText(entry.note)) errors.push(`${file}: changeHistory entry needs a note`);
  }
}

for (const a of agencies) {
  for (const rid of a.relevantScenarios || []) {
    if (!scenIds.has(rid)) errors.push(`agency ${a.id}: references missing scenario ${rid}`);
  }
}

const statusSummary = Object.entries(statusCounts)
  .map(([status, count]) => `${status}=${count}`)
  .join(" ");

console.log(`sources: ${sources.length}  scenarios: ${scenarios.length}  agencies: ${agencies.length}  support: ${support.length}`);
console.log(`statuses: ${statusSummary}`);
console.log(`verified sources: ${sources.filter((s) => s.currentStatusVerified).length}/${sources.length}`);
if (errors.length) {
  console.error("\nERRORS:");
  errors.forEach((e) => console.error(" - " + e));
} else {
  console.log("\nNo structural errors.");
}
if (warn.length) {
  console.log("\nWarnings (source gaps to close):");
  warn.forEach((w) => console.log(" - " + w));
}
process.exit(errors.length ? 1 : 0);
