import Financial from "../models/Financial.js";

export const getStats = async (req, res) => {
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
};