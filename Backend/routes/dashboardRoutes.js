import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import requireStaff from "../middleware/requireStaff.js";
import { getSummary } from "../controllers/dashboardController.js";

const router = express.Router();
router.use(authMiddleware);
router.use(requireStaff);
router.get("/summary", getSummary);

export default router;
