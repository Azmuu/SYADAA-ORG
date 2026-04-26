import mongoose from "mongoose";

const STATUSES = ["active", "injured", "inactive"];

const sportMemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, default: "" },
    phone: { type: String, trim: true, default: "" },
    address: { type: String, trim: true, default: "" },
    picture: { type: String, trim: true, default: "" },
    sport: { type: String, trim: true, default: "" },
    team: { type: String, trim: true, default: "" },
    position: { type: String, trim: true, default: "" },
    notes: { type: String, trim: true, default: "" },
    status: { type: String, enum: STATUSES, default: "active" },
    /** Fee / dues payment in sports finance (listed on Sports finance page) */
    finance_payment_status: {
      type: String,
      enum: ["unpaid", "partial", "paid"],
      default: "unpaid",
    },
    joined_date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("SportMember", sportMemberSchema);
