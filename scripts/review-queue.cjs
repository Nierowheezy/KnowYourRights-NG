#!/usr/bin/env node
/* Local review queue for legal scenario content. */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const C = path.join(ROOT, "src", "content");
const SCEN = path.join(C, "scenarios");

const PRE_REVIEW_REVIEWER = /pre-review|content team|pending|unreviewed|draft/i;
const TODAY = new Date().toISOString().slice(0, 10);

const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const sources = read(path.join(C, "sources.json"));
const scenarios = fs
  .readdirSync(SCEN)
  .filter((f) => f.endsWith(".json"))
  .map((file) => ({ file, ...read(path.join(SCEN, file)) }))
  .sort((a, b) => a.title.localeCompare(b.title));

const isText = (value) => typeof value === "string" && value.trim().length > 0;
const isLawyerReviewed = (s) =>
  s.status === "approved" && isText(s.reviewer) && !PRE_REVIEW_REVIEWER.test(s.reviewer);

const reviewed = scenarios.filter(isLawyerReviewed);
const awaiting = scenarios.filter(
  (s) => s.status === "approved" && isText(s.reviewer) && PRE_REVIEW_REVIEWER.test(s.reviewer)
);
const underReview = scenarios.filter((s) => s.status === "under-review");
const needsRevision = scenarios.filter((s) => s.status === "needs-revision");
const drafts = scenarios.filter((s) => s.status === "draft");
const retired = scenarios.filter((s) => s.status === "retired");
const due = scenarios.filter(
  (s) => s.status === "approved" && isText(s.nextReview) && s.nextReview <= TODAY
);

const missingMetadata = scenarios.filter((s) => {
  if (!["approved", "under-review", "needs-revision"].includes(s.status)) return false;
  if (!isText(s.reviewer) || !isText(s.lastReviewed) || !isText(s.reviewNotes)) return true;
  if (s.status === "approved" && !isText(s.nextReview)) return true;
  return !Array.isArray(s.changeHistory) || s.changeHistory.length === 0;
});

const unverifiedSources = sources.filter((s) => !s.currentStatusVerified);

function row(s, extra) {
  const parts = [
    `- **${s.title}** (${s.id})`,
    `status: ${s.status}`,
    `reviewer: ${s.reviewer || "none"}`,
    `last checked: ${s.lastReviewed || "none"}`,
    s.nextReview ? `next review: ${s.nextReview}` : "",
    extra ? extra : "",
  ].filter(Boolean);
  return parts.join(" | ");
}

console.log("# Content review queue");
console.log("");
console.log(`Generated: ${TODAY}`);
console.log(
  `Scenarios: ${scenarios.length} | lawyer-reviewed: ${reviewed.length} | awaiting sign-off: ${awaiting.length} | under review: ${underReview.length} | needs revision: ${needsRevision.length} | due: ${due.length}`
);
if (drafts.length || retired.length) {
  console.log(`Draft: ${drafts.length} | retired: ${retired.length}`);
}
console.log("");

console.log(`## Lawyer reviewed (${reviewed.length})`);
if (reviewed.length === 0) console.log("- None");
else reviewed.forEach((s) => console.log(row(s)));
console.log("");

console.log(`## Awaiting lawyer sign-off (${awaiting.length})`);
if (awaiting.length === 0) console.log("- None");
else awaiting.forEach((s) => console.log(row(s, "published with pending label")));
console.log("");

console.log(`## Under review (${underReview.length})`);
if (underReview.length === 0) console.log("- None");
else underReview.forEach((s) => console.log(row(s)));
console.log("");

console.log(`## Needs revision (${needsRevision.length})`);
if (needsRevision.length === 0) console.log("- None");
else needsRevision.forEach((s) => console.log(row(s, s.reviewNotes)));
console.log("");

console.log(`## Due for review (${due.length})`);
if (due.length === 0) console.log("- None");
else due.forEach((s) => console.log(row(s, `due on ${s.nextReview}`)));
console.log("");

console.log(`## Missing review metadata (${missingMetadata.length})`);
if (missingMetadata.length === 0) console.log("- None");
else missingMetadata.forEach((s) => console.log(row(s, "incomplete review fields")));
console.log("");

console.log(`## Unverified sources (${unverifiedSources.length})`);
if (unverifiedSources.length === 0) console.log("- None");
else {
  unverifiedSources.forEach((s) => {
    console.log(`- **${s.title}** (${s.id}) | last accessed: ${s.lastAccessed || "unknown"}`);
  });
}
