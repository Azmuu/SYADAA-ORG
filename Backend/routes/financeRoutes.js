import express from "express";
import { getStats } from "../controllers/financeController.js";

const router = express.Router();

// Finance stats (income & expense)
router.get("/stats", getStats);

export default router;