import mongoose from "mongoose";

const financialSchema = new mongoose.Schema(
  {
    entity_name: String,
    category: String,
    amount: Number,
    type: {
      type: String,
      enum: ["income", "expense"],
    },
    date: Date,
    /** Sub-ledger: general members vs sports program */
    sector: {
      type: String,
      enum: ["members", "sports"],
      default: "members",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Financial", financialSchema);