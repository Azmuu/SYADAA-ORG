import Financial from "../models/Financial.js";

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
    res.json({
      income,
      expense,
      balance: income - expense,
      transactionCount: txCount,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const listTransactions = async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 200);
    const rows = await Financial.find().sort({ date: -1, createdAt: -1 }).limit(limit).lean();
    res.json(rows);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const createTransaction = async (req, res) => {
  try {
    const { entity_name, category, amount, type, date } = req.body;
    if (!type || !["income", "expense"].includes(type)) {
      return res.status(400).json({ message: "type must be income or expense" });
    }
    const amt = Number(amount);
    if (!Number.isFinite(amt) || amt < 0) {
      return res.status(400).json({ message: "amount must be a non-negative number" });
    }
    const doc = await Financial.create({
      entity_name: entity_name || "Unnamed",
      category: category || "General",
      amount: amt,
      type,
      date: date ? new Date(date) : new Date(),
    });
    res.status(201).json(doc);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};
