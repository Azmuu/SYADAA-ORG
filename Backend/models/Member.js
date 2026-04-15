import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    name: String,
    program: String,
    joined_date: Date,
    status: {
      type: String,
      enum: ["active", "pending", "inactive"],
      default: "pending",
    },
    email: String,
  },
  { timestamps: true }
);

export default mongoose.model("Member", memberSchema);