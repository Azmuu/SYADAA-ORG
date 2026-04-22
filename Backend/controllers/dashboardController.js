import Member from "../models/Member.js";
import Financial from "../models/Financial.js";
import Report from "../models/Report.js";

export const getSummary = async (req, res) => {
  try {
    const [memberCount, pendingMembers, incomeAgg, expenseAgg, reportCount] = await Promise.all([
      Member.countDocuments(),
      Member.countDocuments({ status: "pending" }),
      Financial.aggregate([
        { $match: { type: "income" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      Financial.aggregate([
        { $match: { type: "expense" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      Report.countDocuments(),
    ]);

    const income = incomeAgg[0]?.total || 0;
    const expense = expenseAgg[0]?.total || 0;

    res.json({
      memberCount,
      pendingMembers,
      income,
      expense,
      balance: income - expense,
      reportCount,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
