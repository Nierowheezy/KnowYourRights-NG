#!/usr/bin/env bash
# Convert all legal-source PDFs to plain text for agent review.
# Requires poppler (pdftotext): brew install poppler
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PDF_DIR="$ROOT/legal-sources/pdfs"
TXT_DIR="$ROOT/legal-sources/txt"

mkdir -p "$TXT_DIR"

if ! command -v pdftotext >/dev/null 2>&1; then
  echo "pdftotext not found. Install with: brew install poppler" >&2
  exit 1
fi

for pdf in "$PDF_DIR"/*.pdf; do
  [ -e "$pdf" ] || continue
  base="$(basename "$pdf" .pdf)"
  # -layout preserves columns/indentation; -nopgbrk keeps pages flowing
  pdftotext -layout -nopgbrk "$pdf" "$TXT_DIR/$base.txt"
  lines=$(wc -l < "$TXT_DIR/$base.txt" | tr -d ' ')
  echo "converted: $base.txt ($lines lines)"
done

echo "Done. Text files in: $TXT_DIR"
