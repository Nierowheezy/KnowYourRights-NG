# Legal Sources - Downloaded Documents

This folder holds the primary-source legal documents backing the
KnowYourRights NG content. Raw PDFs live in `pdfs/`, extracted text lives in
`txt/`, and HTML-only sources keep their page snapshot in `html/`.

## How these were obtained

Downloaded automatically via `curl` from official or authoritative repositories
on 2026-10-29. See `../src/content/sources.json` for the canonical register with
URLs, gazette references, and verification notes.

Convert PDFs to text with:

```bash
./scripts/convert-pdfs.sh
```

## Document map

| File | Act / Document | Primary source |
|------|----------------|----------------|
| `nigeria-police-act-2020.pdf` | Nigeria Police Act, 2020 | PLAC (placng.org) |
| `frsc-act-2007.pdf` | FRSC (Establishment) Act, 2007 | SabiLaw reproduction |
| `lagos-state-traffic-law-2012.pdf` | Lagos State Road Traffic Law, 2012 | Lagos State Ministry of Justice |
| `nigeria-customs-service-act-2023.pdf` | Nigeria Customs Service Act, 2023 (repeals CEMA) | Law-firm reproduction of gazette |
| `nigeria-immigration-act-2015.pdf` | Immigration Act, 2015 | Nigeria Immigration Service |
| `ndlea-act.pdf` | NDLEA Act (Cap N30 LFN 2004) | PLAC Laws of Nigeria |
| `nscdc-act-2003/` (html + txt) | Nigeria Security and Civil Defence Corps Act, 2003 | PLAC Laws of Nigeria (NSCDC site publishes no PDF) |
| `nscdc-act-2007.pdf` | NSCDC (Amendment) Act, 2007 | nms.ng reproduction |
| `cpo-act-2000.pdf` | Corrupt Practices and Other Related Offences Act, 2000 | ICPC official PDF |
| `criminal-code-act.pdf` | Criminal Code Act (Cap. C38 LFN 2004) | PLAC Laws of Nigeria |
| `acja-2015.pdf` | Administration of Criminal Justice Act, 2015 | Federal Ministry of Justice |
| `constitution-1999.pdf` | Constitution of the Federal Republic of Nigeria 1999 (updated) | PLAC (includes alterations) |
| `national-road-traffic-regulations-2012.pdf` | National Road Traffic Regulations, 2012 | SabiLaw reproduction |

## Verification status

- These are **reproductions**, not scans of the physical gazette in every case.
- A source counts as verified when its citations have been checked against the
  text held here, under the process in
  `buildflow/context/content-review.md`. Verification is not legal advice and is
  not a lawyer's sign-off.
- The Nigeria Customs Service Act, 2023 **repealed** the Customs and Excise
  Management Act (CEMA). Content must cite the 2023 Act, not CEMA.
