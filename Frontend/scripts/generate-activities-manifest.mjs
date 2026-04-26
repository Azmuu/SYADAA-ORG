/**
 * Scans public/ activity folders (excludes "vedio") and writes
 * src/data/activities-manifest.json with image lists + static copy.
 * Run: node scripts/generate-activities-manifest.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "../public");
const outFile = path.join(__dirname, "../src/data/activities-manifest.json");

const COPY = {
  "kulanki-school-barkhadle": {
    title: "Booqashada Iskuulka Barkhadle",
    tag: "Education",
    desc: "Booqasho indho-indheyn ah oo aan ku tagnay Dugsiga Hoose/Dhexe ee Barkhadle ee magaalada Gaalkacyo, Mudug.",
  },
  "teamka-sportska-kulankodi": {
    title: "Kulaanka dhallinyarada sport-ga",
    tag: "Sports",
    desc: "Kulan Muqdisho ugu qabannay dhallinyarada sport-ga xilli ay u tartamayeen koobka gobolka Mudug.",
  },
  "dorashadii gudomiye abdinasir hire": {
    title: "Doorashada hoggaanka cusub",
    tag: "Leadership",
    desc: "Waxaa si guul ah inoogu soo dhammaatay doorashadii ururka, taas oo uu ku guulaystay Gudoomiye Abdinasir Hire.",
  },
  "la Kulanki-axmed-tajir ee wada hadal": {
    title: "Kulan wada-hadal la leh xildhibaanada",
    tag: "Governance",
    desc: "Kulan aan la qaadanay xildhibaanada si aan uga wada hadalno horumarinta iyo wacyigelinta SYADA.",
  },
  "Teamka-Kulankooda": {
    title: "Isbarashada kooxda SYADA",
    tag: "Internal",
    desc: "Kulan is-xog-wareysi iyo isbarasho ah oo u qabsoomay xubnaha kooxda si loo xoojiyo wada-shaqaynta.",
  },
  "Kulanka-Xilibanada": {
    title: "Kulanka xildhibaanada",
    tag: "Governance",
    desc: "Kulan wada-tashi ah oo la leh xildhibaanada ku saabsan qorshayaasha ururka.",
  },
  "Leadership-wada hadal": {
    title: "Wada-hadal hoggaaminta",
    tag: "Leadership",
    desc: "Fadhiyo wada-hadal oo u dhaxeeya hogaamiyaasha iyo wakiilada SYADA.",
  },
  "kulankii-tanaad": {
    title: "Kulankii tanaad",
    tag: "Events",
    desc: "Kulan iyo tanaad ay ka qayb qaateen xubnaha ururka.",
  },
  "sodhaweyntii-ustad-ibrahim": {
    title: "Sodhaweynta ustaad Ibraahim",
    tag: "Education",
    desc: "Sodhaweyn iyo kulan soo dhaweyn ah oo loogu talagalay tababar iyo wacyigelin.",
  },
};

const EXCLUDE = new Set(["vedio"]);

const entries = fs
  .readdirSync(publicDir, { withFileTypes: true })
  .filter((d) => d.isDirectory() && !EXCLUDE.has(d.name))
  .map((d) => d.name);

const activities = entries
  .map((folder) => {
    const full = path.join(publicDir, folder);
    let files = [];
    try {
      files = fs
        .readdirSync(full)
        .filter((f) => /\.(jpe?g|png|webp|gif)$/i.test(f))
        .sort();
    } catch {
      files = [];
    }
    if (!files.length) return null;
    const m = COPY[folder] || {
      title: folder.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      tag: "Activity",
      desc: "Sawirro laga soo qaatay fadhigii u dambeeyay.",
    };
    return {
      id: folder,
      folder,
      title: m.title,
      tag: m.tag,
      desc: m.desc,
      images: files,
    };
  })
  .filter(Boolean);

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, JSON.stringify({ generated: new Date().toISOString(), activities }, null, 2), "utf8");
console.log(`Wrote ${activities.length} activities → ${outFile}`);
