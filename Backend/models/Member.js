import mongoose from "mongoose";

const BLOOD = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Unknown"];

const memberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, default: "" },
    phone: { type: String, trim: true, default: "" },
    address: { type: String, trim: true, default: "" },
    /** URL or small data URL from client */
    picture: { type: String, default: "" },
    blood_type: { type: String, enum: BLOOD, default: "Unknown" },
    title: { type: String, trim: true, default: "" },
    is_finance_member: { type: Boolean, default: false },
    finance_monthly_fee: { type: Number, default: null },
    finance_payment_method: { type: String, trim: true, default: "" },
    finance_account_ref: { type: String, trim: true, default: "" },
    finance_notes: { type: String, trim: true, default: "" },
    program: { type: String, trim: true, default: "" },
    joined_date: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["active", "pending", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Member", memberSchema);
