#!/usr/bin/env node
/*
 * Convert every PDF in legal-sources/pdfs/ to plain text in legal-sources/txt/.
 * Uses pdf-parse v2 (pure JS, no native deps). Run: node scripts/pdf-to-text.cjs
 */
const fs = require("fs");
const path = require("path");
const { PDFParse } = require("pdf-parse");

const ROOT = path.resolve(__dirname, "..");
const PDF_DIR = path.join(ROOT, "legal-sources", "pdfs");
const TXT_DIR = path.join(ROOT, "legal-sources", "txt");

function clean(text) {
  return text
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\u000c/g, "\n") // form feeds
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function main() {
  fs.mkdirSync(TXT_DIR, { recursive: true });
  const files = fs.readdirSync(PDF_DIR).filter((f) => f.toLowerCase().endsWith(".pdf"));

  if (files.length === 0) {
    console.error("No PDFs found in", PDF_DIR);
    process.exit(1);
  }

  for (const file of files) {
    const inPath = path.join(PDF_DIR, file);
    const outPath = path.join(TXT_DIR, file.replace(/\.pdf$/i, ".txt"));
    let parser;
    try {
      parser = new PDFParse({ data: fs.readFileSync(inPath) });
      const result = await parser.getText();
      const text = clean(result.text || "");
      fs.writeFileSync(outPath, text + "\n", "utf8");
      const lines = text ? text.split("\n").length : 0;
      console.log(
        `ok  ${file}  pages=${result.total}  chars=${text.length}  lines=${lines}`
      );
    } catch (err) {
      console.error(`FAIL ${file}: ${err.message}`);
    } finally {
      if (parser) await parser.destroy().catch(() => {});
    }
  }
}

main();
