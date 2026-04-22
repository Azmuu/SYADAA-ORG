import Member from "../models/Member.js";

const BLOOD = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Unknown"];

/**
 * Directory for logged-in members: no finance fields. Query: `search`, `blood` (blood type).
 */
export const listMembersForPortal = async (req, res) => {
  try {
    const search = typeof req.query.search === "string" ? req.query.search.trim() : "";
    const blood = typeof req.query.blood === "string" ? req.query.blood.trim() : "";

    const filter = {};
    if (blood && BLOOD.includes(blood)) {
      filter.blood_type = blood;
    }
    if (search) {
      const esc = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const rx = new RegExp(esc, "i");
      filter.$or = [
        { name: rx },
        { email: rx },
        { phone: rx },
        { title: rx },
        { address: rx },
        { program: rx },
      ];
    }

    const data = await Member.find(filter)
      .sort({ name: 1 })
      .select("-is_finance_member -finance_monthly_fee -finance_payment_method -finance_account_ref -finance_notes")
      .lean();

    res.json(data);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
