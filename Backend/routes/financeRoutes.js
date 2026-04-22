import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import requireStaff from "../middleware/requireStaff.js";
import {
  getStats,
  getOverview,
  listTransactions,
  createTransaction,
} from "../controllers/financeController.js";

const router = express.Router();
router.use(authMiddleware);
router.use(requireStaff);

router.get("/stats", getStats);
router.get("/overview", getOverview);
router.get("/transactions", listTransactions);
router.post("/transactions", createTransaction);

export default router;
