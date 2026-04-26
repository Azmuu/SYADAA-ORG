import mongoose from "mongoose";
import SportMember from "../models/SportMember.js";

const STATUSES = ["active", "injured", "inactive"];
const PAYMENT_STATUSES = ["unpaid", "partial", "paid"];
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

function sanitizeSportMember(raw) {
  const b = raw && typeof raw === "object" ? raw : {};
  const status =
    typeof b.status === "string" && STATUSES.includes(b.status) ? b.status : "active";
  let joined = b.joined_date ? new Date(b.joined_date) : new Date();
  if (Number.isNaN(joined.getTime())) joined = new Date();

  return {
    name: String(b.name ?? "").trim(),
    email: String(b.email ?? "").trim().toLowerCase(),
    phone: String(b.phone ?? "").trim(),
    address: String(b.address ?? "").trim(),
    picture: String(b.picture ?? "").trim(),
    sport: String(b.sport ?? "").trim(),
    team: String(b.team ?? "").trim(),
    position: String(b.position ?? "").trim(),
    notes: String(b.notes ?? "").trim(),
    status,
    joined_date: joined,
    finance_payment_status:
      typeof b.finance_payment_status === "string" && PAYMENT_STATUSES.includes(b.finance_payment_status)
        ? b.finance_payment_status
        : "unpaid",
  };
}

function formatMongooseError(e) {
  if (e.name === "ValidationError" && e.errors) {
    const first = Object.values(e.errors)[0];
    if (first?.message) return first.message;
  }
  return e.message || "Could not save sports member.";
}

export const getSportMembers = async (_req, res) => {
  try {
    const data = await SportMember.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const getSportMemberById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ message: "Invalid id" });
    const data = await SportMember.findById(id);
    if (!data) return res.status(404).json({ message: "Sports member not found" });
    res.json(data);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const createSportMember = async (req, res) => {
  try {
    const body = sanitizeSportMember(req.body);
    if (!body.name) return res.status(400).json({ message: "Name is required." });
    if (!body.phone) return res.status(400).json({ message: "Phone is required." });
    if (!body.sport) return res.status(400).json({ message: "Sport is required." });
    const data = await SportMember.create(body);
    res.status(201).json(data);
  } catch (e) {
    res.status(400).json({ message: formatMongooseError(e) });
  }
};

export const updateSportMember = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ message: "Invalid id" });
    const existing = await SportMember.findById(id);
    if (!existing) return res.status(404).json({ message: "Sports member not found" });

    const raw = req.body && typeof req.body === "object" ? req.body : {};
    const rawKeys = Object.keys(raw);
    const onlyPayment = rawKeys.length === 1 && rawKeys[0] === "finance_payment_status";

    if (onlyPayment && "finance_payment_status" in raw) {
      const st = raw.finance_payment_status;
      if (typeof st !== "string" || !PAYMENT_STATUSES.includes(st)) {
        return res.status(400).json({ message: "finance_payment_status must be unpaid, partial, or paid" });
      }
      const data = await SportMember.findByIdAndUpdate(id, { finance_payment_status: st }, { new: true, runValidators: true });
      return res.json(data);
    }

    const body = sanitizeSportMember(req.body);
    if (!body.name) return res.status(400).json({ message: "Name is required." });
    if (!body.phone) return res.status(400).json({ message: "Phone is required." });
    if (!body.sport) return res.status(400).json({ message: "Sport is required." });
    const data = await SportMember.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!data) return res.status(404).json({ message: "Sports member not found" });
    res.json(data);
  } catch (e) {
    res.status(400).json({ message: formatMongooseError(e) });
  }
};

export const deleteSportMember = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ message: "Invalid id" });
    const doc = await SportMember.findByIdAndDelete(id);
    if (!doc) return res.status(404).json({ message: "Sports member not found" });
    res.json({ message: "Deleted", id });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
