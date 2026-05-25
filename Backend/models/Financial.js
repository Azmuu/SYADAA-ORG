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
    auto_generated: { type: Boolean, default: false },
    source_model: {
      type: String,
      enum: ["Member", "SportMember", null],
      default: null,
    },
    source_id: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
  },
  { timestamps: true }
);

financialSchema.index({ source_model: 1, source_id: 1 });

export default mongoose.model("Financial", financialSchema);