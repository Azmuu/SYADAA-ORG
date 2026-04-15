import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    full_name: String,
    email: { type: String, unique: true },
    password: String,
    role: {
      type: String,
      enum: ["super_admin", "manager", "editor"],
      default: "editor",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);