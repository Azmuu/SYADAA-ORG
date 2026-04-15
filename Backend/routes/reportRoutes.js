import express from "express";
import { getReports, createReport } from "../controllers/reportController.js";

const router = express.Router();

// Get reports
router.get("/", getReports);

// Create report
router.post("/", createReport);

export default router;