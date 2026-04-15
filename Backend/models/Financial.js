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
  },
  { timestamps: true }
);

export default mongoose.model("Financial", financialSchema);