import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    full_name: String,
    email: { type: String, unique: true, lowercase: true, trim: true },
    password: String,
    role: {
      type: String,
      enum: ["super_admin", "manager", "editor", "member"],
      default: "editor",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);