import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  try {
    const body = req.body && typeof req.body === "object" ? req.body : {};
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const passwordRaw =
      typeof body.password === "string" ? body.password : body.password != null ? String(body.password) : "";
    const password = passwordRaw;

    if (!email || !password.trim()) {
      return res.status(400).json({
        message: "Email and password are required",
        hint:
          Object.keys(body).length === 0
            ? "Empty body — check network tab that email/password are sent."
            : undefined,
      });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
      },
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};