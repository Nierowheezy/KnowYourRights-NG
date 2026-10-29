#!/usr/bin/env node
/* Lightweight content integrity check (mirrors src/lib/schema.ts invariants). */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const C = path.join(ROOT, "src", "content");
const SCEN = path.join(C, "scenarios");

const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const sources = read(path.join(C, "sources.json"));
const agencies = read(path.join(C, "agencies.json"));
const support = read(path.join(C, "support.json"));
const scenarioFiles = fs.readdirSync(SCEN).filter((f) => f.endsWith(".json"));
const scenarios = scenarioFiles.map((f) => ({ file: f, data: read(path.join(SCEN, f)) }));

const errors = [];
const warn = [];

const srcIds = new Set();
for (const s of sources) {
  if (srcIds.has(s.id)) errors.push(`duplicate source id: ${s.id}`);
  srcIds.add(s.id);
  if (!s.title) errors.push(`source ${s.id} missing title`);
  if (s.url && !/^https?:\/\//.test(s.url)) errors.push(`source ${s.id} bad url`);
}

const scenIds = new Set();
const required = ["id", "title", "question", "shortAnswer", "legalExplanation", "practicalOptions", "jurisdiction", "category", "sources"];
for (const { file, data: s } of scenarios) {
  if (!s.id) errors.push(`${file}: missing id`);
  if (scenIds.has(s.id)) errors.push(`${file}: duplicate scenario id ${s.id}`);
  scenIds.add(s.id);
  for (const k of required) if (!s[k] || (Array.isArray(s[k]) && s[k].length === 0)) errors.push(`${file}: missing ${k}`);
  if (!Array.isArray(s.sources) || s.sources.length === 0) errors.push(`${file}: no sources`);
  for (const ref of s.sources || []) {
    if (!srcIds.has(ref.sourceId)) errors.push(`${file}: unknown sourceId ${ref.sourceId}`);
  }
  if (s.status === "approved" && /pre-review/i.test(s.reviewer || "")) {
    warn.push(`${file}: status=approved but reviewer is "${s.reviewer}" (not lawyer-reviewed)`);
  }
}

for (const a of agencies) {
  for (const rid of a.relevantScenarios || []) {
    if (!scenIds.has(rid)) errors.push(`agency ${a.id}: references missing scenario ${rid}`);
  }
}

console.log(`sources: ${sources.length}  scenarios: ${scenarios.length}  agencies: ${agencies.length}  support: ${support.length}`);
console.log(`verified sources: ${sources.filter((s) => s.currentStatusVerified).length}/${sources.length}`);
if (errors.length) {
  console.error("\nERRORS:");
  errors.forEach((e) => console.error(" - " + e));
} else {
  console.log("\nNo structural errors.");
}
if (warn.length) {
  console.log("\nWarnings (expected until lawyer review):");
  warn.forEach((w) => console.log(" - " + w));
}
process.exit(errors.length ? 1 : 0);
