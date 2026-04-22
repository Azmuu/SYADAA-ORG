import mongoose from "mongoose";
import Report from "../models/Report.js";
import Financial from "../models/Financial.js";
import Member from "../models/Member.js";

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const STATUSES = new Set(["verified", "processing", "archived"]);

async function financeTotals() {
  const [incomeAgg, expenseAgg, txCount] = await Promise.all([
    Financial.aggregate([
      { $match: { type: "income" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    Financial.aggregate([
      { $match: { type: "expense" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    Financial.countDocuments(),
  ]);
  const income = incomeAgg[0]?.total || 0;
  const expense = expenseAgg[0]?.total || 0;
  return { income, expense, balance: income - expense, transactionCount: txCount };
}

/** Plain-text block from current DB (members, finance, reports) for pasting into a report. */
export const getComposePreview = async (req, res) => {
  try {
    const [memberCount, reportCount, totals, recentTx] = await Promise.all([
      Member.countDocuments(),
      Report.countDocuments(),
      financeTotals(),
      Financial.find().sort({ date: -1, createdAt: -1 }).limit(8).lean(),
    ]);

    const lines = [
      `SYADA — Live data summary`,
      `Generated: ${new Date().toLocaleString()}`,
      ``,
      `Members in directory: ${memberCount}`,
      `Reports on file: ${reportCount}`,
      `Financial transactions recorded: ${totals.transactionCount}`,
      `Total income: ${Number(totals.income).toFixed(2)}`,
      `Total expense: ${Number(totals.expense).toFixed(2)}`,
      `Balance (income − expense): ${Number(totals.balance).toFixed(2)}`,
    ];

    if (recentTx.length) {
      lines.push(``, `Recent transactions (newest first):`);
      recentTx.forEach((t, i) => {
        const d = t.date ? new Date(t.date).toLocaleDateString() : "—";
        lines.push(
          `  ${i + 1}. ${t.entity_name || "Entry"} — ${t.type} ${Number(t.amount).toFixed(2)} — ${t.category || "General"} — ${d}`
        );
      });
    }

    const text = lines.join("\n");
    res.json({
      text,
      stats: {
        memberCount,
        reportCount,
        income: totals.income,
        expense: totals.expense,
        balance: totals.balance,
        transactionCount: totals.transactionCount,
      },
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

/** Mixed timeline: real financial rows + report filings. */
export const getActivityFeed = async (req, res) => {
  try {
    const [tx, reps] = await Promise.all([
      Financial.find()
        .sort({ date: -1, createdAt: -1 })
        .limit(12)
        .select("entity_name category amount type date createdAt")
        .lean(),
      Report.find()
        .sort({ createdAt: -1 })
        .limit(12)
        .select("report_name category status createdAt")
        .lean(),
    ]);

    const items = [
      ...tx.map((t) => ({
        kind: "financial",
        id: String(t._id),
        title: t.entity_name || "Transaction",
        subtitle: `${t.type} · ${t.category || "General"} · ${Number(t.amount).toFixed(2)}`,
        at: (t.date && new Date(t.date).toISOString()) || new Date(t.createdAt).toISOString(),
      })),
      ...reps.map((r) => ({
        kind: "report",
        id: String(r._id),
        title: r.report_name || "Report",
        subtitle: `${r.category || "—"} · ${r.status || "—"}`,
        at: new Date(r.createdAt).toISOString(),
      })),
    ]
      .sort((a, b) => new Date(b.at) - new Date(a.at))
      .slice(0, 20);

    res.json(items);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const getReports = async (req, res) => {
  try {
    const data = await Report.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const createReport = async (req, res) => {
  try {
    const b = req.body && typeof req.body === "object" ? req.body : {};
    const report_name = String(b.report_name || "").trim();
    if (!report_name) {
      return res.status(400).json({ message: "report_name is required" });
    }
    const category = String(b.category || "PROJECT").trim().slice(0, 64);
    const status = STATUSES.has(b.status) ? b.status : "processing";
    const summary = String(b.summary || "").trim().slice(0, 50000);
    const file_url = b.file_url != null ? String(b.file_url).trim().slice(0, 2000) : "";

    const data = await Report.create({
      report_name,
      category,
      status,
      summary,
      file_url: file_url || undefined,
    });
    res.status(201).json(data);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

export const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ message: "Invalid id" });
    const doc = await Report.findByIdAndDelete(id);
    if (!doc) return res.status(404).json({ message: "Report not found" });
    res.json({ message: "Deleted", id });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
