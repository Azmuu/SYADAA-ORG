import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import requireStaff from "../middleware/requireStaff.js";
import {
  getReports,
  createReport,
  deleteReport,
  getComposePreview,
  getActivityFeed,
} from "../controllers/reportController.js";

const router = express.Router();
router.use(authMiddleware);
router.use(requireStaff);

router.get("/compose-preview", getComposePreview);
router.get("/activity-feed", getActivityFeed);
router.get("/", getReports);
router.post("/", createReport);
router.delete("/:id", deleteReport);

export default router;
