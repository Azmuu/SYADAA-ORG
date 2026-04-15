import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import bcrypt from "bcrypt";

// Load env
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect Database
connectDB().then(() => {
  createDefaultAdmin();
});

// Routes
import authRoutes from "./routes/authRoutes.js";
import memberRoutes from "./routes/memberRoutes.js";
import financeRoutes from "./routes/financeRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";

app.use("/api/auth", authRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/finance", financeRoutes);
app.use("/api/reports", reportRoutes);

// Home route
app.get("/", (req, res) => {
  res.send("🚀 SYADA ORG API is running...");
});


// ❌ Not Found Handler (MUHIIM)
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});


// ⚠️ Global Error Handler (PRO)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Server Error",
    error: err.message,
  });
});


// Server Start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});



// 🔐 Create default admin if not exists
const createDefaultAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ email: "admin@syada.org" });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("123456", 10);

      await User.create({
        full_name: "Admin User",
        email: "admin@syada.org",
        password: hashedPassword,
        role: "super_admin",
      });

      console.log("✅ Default admin created");
    } else {
      console.log("ℹ️ Admin already exists");
    }
  } catch (error) {
    console.error("Error creating admin:", error);
  }
};