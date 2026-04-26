import Financial from "../models/Financial.js";

/** @param {string|undefined} sector - "members" | "sports" | "all" */
function sectorMatchStage(sector) {
  if (sector === "sports") return { sector: "sports" };
  if (sector === "members")
    return { $or: [{ sector: "members" }, { sector: { $exists: false } }, { sector: null }] };
  return {};
}

export const getStats = async (req, res) => {
  try {
    const income = await Financial.aggregate([
      { $match: { type: "income" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const expense = await Financial.aggregate([
      { $match: { type: "expense" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    res.json({
      income: income[0]?.total || 0,
      expense: expense[0]?.total || 0,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

/** Overview for admin UI: totals + balance + counts */
export const getOverview = async (req, res) => {
  try {
    const raw = (req.query.sector || "all").toLowerCase();
    const sector = raw === "sports" || raw === "members" ? raw : "all";
    const base = sectorMatchStage(sector === "all" ? "all" : sector);

    const [incomeAgg, expenseAgg, txCount] = await Promise.all([
      Financial.aggregate([
        { $match: { type: "income", ...base } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      Financial.aggregate([
        { $match: { type: "expense", ...base } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      Financial.countDocuments(base),
    ]);
    const income = incomeAgg[0]?.total || 0;
    const expense = expenseAgg[0]?.total || 0;
    res.json({
      income,
      expense,
      balance: income - expense,
      transactionCount: txCount,
      sector: sector === "all" ? "all" : sector,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const listTransactions = async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 200);
    const raw = (req.query.sector || "all").toLowerCase();
    const sector = raw === "sports" || raw === "members" ? raw : "all";
    const q = sector === "all" ? {} : sectorMatchStage(sector);
    const rows = await Financial.find(q).sort({ date: -1, createdAt: -1 }).limit(limit).lean();
    res.json(rows);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const createTransaction = async (req, res) => {
  try {
    const { entity_name, category, amount, type, date, sector: sectorRaw } = req.body;
    if (!type || !["income", "expense"].includes(type)) {
      return res.status(400).json({ message: "type must be income or expense" });
    }
    const amt = Number(amount);
    if (!Number.isFinite(amt) || amt < 0) {
      return res.status(400).json({ message: "amount must be a non-negative number" });
    }
    const sector =
      typeof sectorRaw === "string" && sectorRaw === "sports" ? "sports" : "members";
    const doc = await Financial.create({
      entity_name: entity_name || "Unnamed",
      category: category || "General",
      amount: amt,
      type,
      date: date ? new Date(date) : new Date(),
      sector,
    });
    res.status(201).json(doc);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};
