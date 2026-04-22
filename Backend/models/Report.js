import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    report_name: String,
    category: String,
    status: {
      type: String,
      enum: ["verified", "processing", "archived"],
    },
    /** Snapshot / notes built from live finance + members (not fake seed). */
    summary: { type: String, default: "" },
    file_url: String,
  },
  { timestamps: true }
);

export default mongoose.model("Report", reportSchema);