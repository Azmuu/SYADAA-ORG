/**
 * Demo / fake financial & report rows are **disabled by default** so Finance & Reports show only real data.
 * To insert sample rows once (empty collections only), set in `.env`:
 *   SEED_DEMO_DATA=true
 */
import Financial from "../models/Financial.js";
import Report from "../models/Report.js";

export default async function seedDemoData() {
  if (String(process.env.SEED_DEMO_DATA || "").toLowerCase() !== "true") {
    return;
  }
  try {
    const fc = await Financial.countDocuments();
    if (fc === 0) {
      const now = new Date();
      await Financial.insertMany([
        {
          entity_name: "Member contributions",
          category: "Membership",
          amount: 15000,
          type: "income",
          date: new Date(now.getFullYear(), now.getMonth() - 1, 5),
        },
        {
          entity_name: "SomNet Solutions",
          category: "Infrastructure",
          amount: 1240,
          type: "expense",
          date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2),
        },
      ]);
      console.log("✅ SEED_DEMO_DATA: seeded sample financial rows");
    }

    const rc = await Report.countDocuments();
    if (rc === 0) {
      await Report.insertMany([
        { report_name: "Sample Q3 audit", category: "PROJECT", status: "verified", summary: "" },
      ]);
      console.log("✅ SEED_DEMO_DATA: seeded sample report");
    }
  } catch (e) {
    console.error("Seed demo data error:", e.message);
  }
}
