#!/usr/bin/env node
/*
 * One-off data pass: align source citations with the downloaded official texts.
 * Run once: node scripts/apply-legal-corrections.cjs
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "src", "content");
const SCEN = path.join(SRC, "scenarios");

const TODAY = "2026-10-29";
const REVIEW_SUFFIX =
  " Section references checked against downloaded official texts on 2026-10-29; Nigerian lawyer review still required before publication.";

// ---- sources.json updates (keyed by original id) ----
const sources = JSON.parse(fs.readFileSync(path.join(SRC, "sources.json"), "utf8"));

const sourceUpdates = {
  "nigeria-police-act-2020": {
    sections: ["44", "49", "50", "51", "52", "86"],
    url: "https://placng.org/i/wp-content/uploads/2020/09/Police-Act-2020.pdf",
    currentStatusVerified: true,
    verificationNotes:
      "Text extracted from the Act PDF. s44 recording of arrests; s49 power to stop and search; s50 pre-search requirements; s51 conduct of search; s52 search of arrested suspect; s86 arrest without warrant to prevent an offence.",
  },
  "frsc-act-2007": {
    sections: ["10"],
    currentStatusVerified: true,
    verificationNotes:
      "Text extracted from the Act PDF. s10 establishes the Corps and its functions; s10(4) power to arrest/prosecute traffic offences and serve notice of offence sheet; s10(5) arrest, vehicle removal/detention, licence/document seizure.",
  },
  "lagos-state-traffic-law-2012": {
    sections: ["8", "11", "12", "15", "16", "17", "22"],
    currentStatusVerified: true,
    verificationNotes:
      "Text extracted from the Lagos MOJ PDF. s8 removal/towing of stationary/abandoned vehicles; s11-12 Vehicle Inspection Service and VIO powers incl. impound; s15 impound for missing particulars; s16 release within 24 hours/two weeks; s17 unclaimed vehicles; s22 arrest without warrant. Towing/storage fees in Schedules I-II.",
  },
  "customs-excise-management-act": {
    id: "nigeria-customs-service-act-2023",
    title: "Nigeria Customs Service Act, 2023",
    url: "https://alsecnominees.com/wp-content/uploads/2024/02/Nigeria-Customs-Service-ACT-2023.pdf",
    sections: ["3", "4", "5", "6", "30", "31", "226", "227"],
    currentStatusVerified: true,
    verificationNotes:
      "Text extracted from the 2023 Act PDF. Repeals CEMA. s3 scope; ss4-5 functions/powers; s6 customs officers exercise police powers for customs purposes; ss30-31 customs control and control zones; s226 patrol; s227 entry/search of places and conveyances and search of persons arriving/departing the customs territory on reasonable grounds.",
  },
  "nigeria-immigration-act": {
    url: "https://www.placng.org/lawsofnigeria/laws/I1.pdf",
    sections: ["24", "46", "48"],
    currentStatusVerified: true,
    verificationNotes:
      "Text extracted from the Act PDF. Arrest without warrant and offence provisions relevant to internal checks; confirm precise section numbering against gazetted text.",
  },
  "ndlea-act": {
    sections: ["25"],
    currentStatusVerified: true,
    verificationNotes:
      "Text extracted from PLAC Laws of Nigeria. Search power to enter/search land, building or carrier without warrant on reasonable belief of an offence; confirm operative section number against gazette.",
  },
  "nscdc-act": {
    currentStatusVerified: false,
    verificationNotes:
      "Downloaded document is the NSCDC (Amendment) Act 2007 only; principal Act 2003 full text not obtained. Do not publish NSCDC-specific claims until the principal Act is verified.",
  },
  "constitution-1999": {
    url: "https://placng.org/i/wp-content/uploads/2023/11/Constitution-of-the-Federal-Republic-of-Nigeria-1999-Updated.pdf",
    sections: ["34", "35", "37", "39", "40", "41"],
    currentStatusVerified: true,
    verificationNotes:
      "Text extracted from the PLAC updated Constitution. s34 dignity; s35 personal liberty/silence/24-hour notice/court; s37 privacy incl. telephone conversations; s39 expression; s40 assembly; s41 movement.",
  },
  "acja-2015": {
    sections: ["6", "7", "8", "9", "10", "144", "145", "146", "147", "148", "151"],
    currentStatusVerified: true,
    verificationNotes:
      "Text extracted from the Act PDF. s6 notification of cause/rights incl. legal aid; s7 arrest in lieu prohibited; s8 humane treatment; s9 search of arrested suspect; s10 inventory of property; Part 18 (ss144-151) search warrants.",
  },
  "national-road-traffic-regulations-2012": {
    sections: ["18", "22", "26", "142"],
    currentStatusVerified: true,
    verificationNotes:
      "Text extracted from the Regulations PDF. Regs on vehicle particulars, vehicle licence, display, and certificate of roadworthiness (reg 142).",
  },
};

const updatedSources = sources.map((s) => {
  const u = sourceUpdates[s.id];
  return u ? { ...s, ...u } : s;
});
fs.writeFileSync(
  path.join(SRC, "sources.json"),
  JSON.stringify(updatedSources, null, 2) + "\n"
);

// ---- scenario source references ----
const scenarioSources = {
  "police-stop-search-car": [
    {
      sourceId: "nigeria-police-act-2020",
      sections: ["49", "50", "51"],
      notes:
        "s49 power to stop and search (public places; reasonable grounds); s50 pre-search requirements (officer must give name, station, object and grounds, and be in uniform/ID); s51 conduct of search.",
    },
    {
      sourceId: "constitution-1999",
      sections: ["37"],
      notes: "Privacy of citizens, homes and communications.",
    },
  ],
  "police-phone-search-checkpoint": [
    {
      sourceId: "constitution-1999",
      sections: ["37"],
      notes:
        "Privacy of citizens, homes, correspondence and telephone conversations.",
    },
    {
      sourceId: "nigeria-police-act-2020",
      sections: ["49", "50", "52"],
      notes:
        "s49 stop/search powers; s50 pre-search requirements; s52 search of an arrested suspect (not a routine device search).",
    },
    {
      sourceId: "acja-2015",
      sections: ["9", "10"],
      notes:
        "s9 search of arrested suspect; s10 inventory of property seized, signed and copied to suspect.",
    },
  ],
  "police-phone-unlock": [
    {
      sourceId: "constitution-1999",
      sections: ["37"],
      notes: "Privacy of telephone conversations and correspondence.",
    },
    {
      sourceId: "nigeria-police-act-2020",
      sections: ["49", "50", "52"],
      notes:
        "s49-50 stop/search requirements; s52 limits search of arrested suspects.",
    },
    {
      sourceId: "acja-2015",
      sections: ["9", "10"],
      notes: "s9 search of arrested suspect; s10 inventory of seized property.",
    },
  ],
  "police-record-encounter": [
    {
      sourceId: "constitution-1999",
      sections: ["39"],
      notes:
        "Freedom of expression, including receiving and imparting information.",
    },
    {
      sourceId: "nigeria-police-act-2020",
      sections: ["50"],
      notes:
        "Pre-search: officer must give name, station, object and grounds; supports noting officer details.",
    },
  ],
  "police-arrest-detention": [
    {
      sourceId: "constitution-1999",
      sections: ["34", "35"],
      notes:
        "s34 dignity; s35 personal liberty, right to silence, informed of grounds within 24 hours, brought to court, habeas corpus.",
    },
    {
      sourceId: "nigeria-police-act-2020",
      sections: ["44", "86"],
      notes:
        "s44 recording of arrests; s86 arrest without warrant on reasonable suspicion to prevent an offence.",
    },
    {
      sourceId: "acja-2015",
      sections: ["6", "7", "8", "9", "10"],
      notes:
        "s6 notification of cause/rights incl. legal aid; s7 arrest in lieu prohibited; s8 humane treatment; s9 search of arrested suspect; s10 inventory.",
    },
  ],
  "customs-highway-stop": [
    {
      sourceId: "nigeria-customs-service-act-2023",
      sections: ["3", "4", "5", "6", "30", "31", "226", "227"],
      notes:
        "s3 scope; ss4-5 functions/powers; s6 customs officers exercise police powers for customs purposes; ss30-31 customs control and control zones; s226 patrol; s227 entry/search of places and conveyances and search of persons arriving/departing the customs territory on reasonable grounds.",
    },
  ],
  "lastma-towing": [
    {
      sourceId: "lagos-state-traffic-law-2012",
      sections: ["8", "15", "16", "17", "Schedule I", "Schedule II"],
      notes:
        "s8 removal/towing of stationary or abandoned vehicles; s15 impound of vehicles without prescribed particulars; s16 release within 24 hours / two weeks and fees; s17 unclaimed vehicles; Schedules I-II towing/storage fees.",
    },
  ],
  "vio-vehicle-impound": [
    {
      sourceId: "lagos-state-traffic-law-2012",
      sections: ["11", "12", "15", "16"],
      notes:
        "s11 establishes the Vehicle Inspection Service; s12 VIO functions incl. roadworthiness and power to impound vehicles failing standards; s15 impound for missing particulars; s16 release and fees.",
    },
  ],
  "frsc-fines-on-the-spot": [
    {
      sourceId: "frsc-act-2007",
      sections: ["10"],
      notes:
        "s10(4)-(5): Corps powers to arrest/prosecute traffic offences and serve notice of offence sheet; removal/detention of obstructing vehicles; seizure of licence/documents. Cash demands are not the lawful procedure.",
    },
  ],
  "vehicle-documents-checks": [
    {
      sourceId: "frsc-act-2007",
      sections: ["10"],
      notes:
        "s10 functions/powers re driver licensing, vehicle roadworthiness and enforcement.",
    },
    {
      sourceId: "lagos-state-traffic-law-2012",
      sections: ["12", "15"],
      notes:
        "s12 VIO inspection/roadworthiness and impound powers; s15 impound for missing prescribed particulars.",
    },
    {
      sourceId: "national-road-traffic-regulations-2012",
      sections: ["18", "22", "26", "142"],
      notes:
        "Regs on vehicle particulars, vehicle licence, display, and certificate of roadworthiness.",
    },
  ],
  "officer-demanded-money": [
    {
      sourceId: "constitution-1999",
      sections: ["34"],
      notes: "Right to dignity of the human person.",
    },
    {
      sourceId: "nigeria-police-act-2020",
      sections: ["49", "50"],
      notes:
        "Lawful stop/search requirements; demands outside these powers should be documented.",
    },
  ],
};

for (const [file, sourcesArr] of Object.entries(scenarioSources)) {
  const p = path.join(SCEN, file + ".json");
  if (!fs.existsSync(p)) {
    console.warn("skip missing", file);
    continue;
  }
  const j = JSON.parse(fs.readFileSync(p, "utf8"));
  j.sources = sourcesArr;
  j.lastReviewed = TODAY;
  j.reviewNotes = (j.reviewNotes || "").replace(REVIEW_SUFFIX, "").trim() + REVIEW_SUFFIX;
  if (file === "officer-demanded-money") {
    j.reviewNotes +=
      " Add the Corrupt Practices and Other Related Offences Act 2000 and the Criminal Code to the source register before publication.";
  }
  fs.writeFileSync(p, JSON.stringify(j, null, 2) + "\n");
}

console.log("Applied legal corrections to", Object.keys(scenarioSources).length, "scenarios and sources.json");
