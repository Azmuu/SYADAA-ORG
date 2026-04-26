import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import bcrypt from "bcrypt";
import seedDemoData from "./seed/seedDemoData.js";

// Load env
dotenv.config();

const app = express();

// CORS: browser preflight (OPTIONS) must get Access-Control-* headers.
// `origin: true` reflects the requesting origin (any localhost port, etc.).
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Type"],
    optionsSuccessStatus: 204,
  })
);
// JSON first (typical API); urlencoded supports login and form posts
app.use(express.json({ limit: "8mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// Connect Database
connectDB().then(async () => {
  await createDefaultAdmin();
  await seedDemoData();
});

// Routes
import authRoutes from "./routes/authRoutes.js";
import memberRoutes from "./routes/memberRoutes.js";
import financeRoutes from "./routes/financeRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import portalRoutes from "./routes/portalRoutes.js";
import sportMemberRoutes from "./routes/sportMemberRoutes.js";

app.use("/api/auth", authRoutes);
app.use("/api/portal", portalRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/finance", financeRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/sports-members", sportMemberRoutes);

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
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  if (String(process.env.MAIL_USE_ETHEREAL).toLowerCase() === "true" && !process.env.MAIL_HOST?.trim()) {
    console.log(
      "📧 Ethereal test email ON — member welcome “emails” are free; open the preview URL printed in this console after each send."
    );
  }
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