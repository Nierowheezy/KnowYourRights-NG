#!/usr/bin/env node
/* Local review queue for legal scenario content. */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const C = path.join(ROOT, "src", "content");
const SCEN = path.join(C, "scenarios");

const TODAY = new Date().toISOString().slice(0, 10);

const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const sources = read(path.join(C, "sources.json"));
const support = read(path.join(C, "support.json"));
const scenarios = fs
  .readdirSync(SCEN)
  .filter((f) => f.endsWith(".json"))
  .map((file) => ({ file, ...read(path.join(SCEN, file)) }))
  .sort((a, b) => a.title.localeCompare(b.title));

const isText = (value) => typeof value === "string" && value.trim().length > 0;
const isSourceVerified = (s) => s.status === "approved" && isText(s.reviewer) && isText(s.lastReviewed);

const verified = scenarios.filter(isSourceVerified);
const awaiting = scenarios.filter(
  (s) => s.status === "approved" && !isSourceVerified(s)
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
const unverifiedIds = new Set(unverifiedSources.map((s) => s.id));
const citingUnverifiedSources = scenarios.filter((s) =>
  (s.sources || []).some((ref) => unverifiedIds.has(ref.sourceId))
);

function row(s, extra) {
  const parts = [
    `- **${s.title}** (${s.id})`,
    `status: ${s.status}`,
    `checked by: ${s.reviewer || "none"}`,
    `checked: ${s.lastReviewed || "none"}`,
    s.nextReview ? `next check: ${s.nextReview}` : "",
    extra ? extra : "",
  ].filter(Boolean);
  return parts.join(" | ");
}

console.log("# Content review queue");
console.log("");
console.log(`Generated: ${TODAY}`);
console.log(
  `Scenarios: ${scenarios.length} | source-verified: ${verified.length} | awaiting source check: ${awaiting.length} | under review: ${underReview.length} | needs revision: ${needsRevision.length} | due: ${due.length}`
);
if (drafts.length || retired.length) {
  console.log(`Draft: ${drafts.length} | retired: ${retired.length}`);
}
console.log("");

console.log(`## Source-verified (${verified.length})`);
if (verified.length === 0) console.log("- None");
else verified.forEach((s) => console.log(row(s)));
console.log("");

console.log(`## Awaiting source check (${awaiting.length})`);
if (awaiting.length === 0) console.log("- None");
else awaiting.forEach((s) => console.log(row(s, "published with a pending label")));
console.log("");

console.log(`## Under review (${underReview.length})`);
if (underReview.length === 0) console.log("- None");
else underReview.forEach((s) => console.log(row(s)));
console.log("");

console.log(`## Needs revision (${needsRevision.length})`);
if (needsRevision.length === 0) console.log("- None");
else needsRevision.forEach((s) => console.log(row(s, s.reviewNotes)));
console.log("");

console.log(`## Due for re-check (${due.length})`);
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
console.log("");

console.log(`## Scenarios citing an unverified source (${citingUnverifiedSources.length})`);
if (citingUnverifiedSources.length === 0) console.log("- None");
else {
  citingUnverifiedSources.forEach((s) => {
    const ids = (s.sources || []).map((r) => r.sourceId).filter((id) => unverifiedIds.has(id));
    console.log(row(s, `cites ${[...new Set(ids)].join(", ")}`));
  });
}
console.log("");

const supportVerified = support.filter((c) => c.contactVerified);
const supportUnverified = support.filter((c) => !c.contactVerified);
console.log(`## Help directory (${support.length})`);
console.log(`- Verified: ${supportVerified.length} | unverified: ${supportUnverified.length}`);
if (supportUnverified.length === 0) {
  console.log("- Every entry is checked against an official page and records its source and date.");
} else {
  supportUnverified.forEach((c) => {
    console.log(`- **${c.name}** (${c.id}) | not checked against its official page`);
  });
}
